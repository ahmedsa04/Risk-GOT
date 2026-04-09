const fs = require('fs');
const path = require('path');

// ── Parse SVG and extract paths ──────────────────────────────────────────────

function parseSvg(filePath) {
  const svg = fs.readFileSync(filePath, 'utf8');
  
  // Get viewBox dimensions
  const viewBoxMatch = svg.match(/viewBox="([^"]+)"/);
  const [, , , width, height] = viewBoxMatch[1].split(/\s+/).map(Number);
  const widthAttr = svg.match(/width="(\d+)"/)?.[1];
  const heightAttr = svg.match(/height="(\d+)"/)?.[1];
  
  // Extract ALL paths in order
  const pathRegex = /<path\s+([^>]+?)\/>/g;
  const paths = [];
  let match;
  
  while ((match = pathRegex.exec(svg)) !== null) {
    const attrs = match[1];
    const dMatch = attrs.match(/d="([^"]+)"/);
    const fillMatch = attrs.match(/fill="(#[0-9a-fA-F]+)"/);
    const strokeMatch = attrs.match(/stroke="([^"]+)"/);
    const fillRuleMatch = attrs.match(/fill-rule="([^"]+)"/);
    const clipRuleMatch = attrs.match(/clip-rule="([^"]+)"/);
    
    if (!dMatch) continue;
    
    const hasRealFill = fillMatch && !strokeMatch;
    const isStrokeOnly = strokeMatch && !fillMatch;
    const hasBoth = fillMatch && strokeMatch;
    
    paths.push({
      d: dMatch[1],
      fill: fillMatch ? fillMatch[1] : null,
      stroke: strokeMatch ? strokeMatch[1] : null,
      fillRule: fillRuleMatch ? fillRuleMatch[1] : null,
      clipRule: clipRuleMatch ? clipRuleMatch[1] : null,
      isFilled: hasRealFill || false,
      isStrokeOnly: isStrokeOnly || false,
      hasBoth: hasBoth || false,
    });
  }
  
  return { width: parseInt(widthAttr), height: parseInt(heightAttr), viewBox: viewBoxMatch[1], paths };
}

// ── Compute centroid from path d attribute ────────────────────────────────────

function computeCentroid(d) {
  // Extract all coordinate numbers from the path
  const coords = [];
  // Match all numbers (including decimals and negatives)
  const numRegex = /[-+]?\d*\.?\d+/g;
  const parts = d.split(/[MLHVCSQTAZmlhvcsqtaz]/);
  
  let currentX = 0, currentY = 0;
  let allX = [], allY = [];
  
  // Simple approach: extract all coordinate pairs from M, L, C commands
  const cmdRegex = /([MLCQSTAZHVmlcqstahvz])([^MLCQSTAZHVmlcqstahvz]*)/g;
  let cmdMatch;
  
  while ((cmdMatch = cmdRegex.exec(d)) !== null) {
    const cmd = cmdMatch[1];
    const nums = [];
    let numMatch;
    const numR = /[-+]?\d*\.?\d+/g;
    while ((numMatch = numR.exec(cmdMatch[2])) !== null) {
      nums.push(parseFloat(numMatch[0]));
    }
    
    if (cmd === 'M' || cmd === 'L') {
      for (let i = 0; i < nums.length - 1; i += 2) {
        allX.push(nums[i]);
        allY.push(nums[i + 1]);
      }
    } else if (cmd === 'C') {
      // Cubic bezier: take endpoint (every 6th pair)
      for (let i = 0; i < nums.length - 1; i += 6) {
        if (i + 5 < nums.length) {
          allX.push(nums[i + 4]);
          allY.push(nums[i + 5]);
        }
      }
    } else if (cmd === 'Q') {
      for (let i = 0; i < nums.length - 1; i += 4) {
        if (i + 3 < nums.length) {
          allX.push(nums[i + 2]);
          allY.push(nums[i + 3]);
        }
      }
    } else if (cmd === 'H') {
      nums.forEach(n => allX.push(n));
    } else if (cmd === 'V') {
      nums.forEach(n => allY.push(n));
    }
  }
  
  if (allX.length === 0 || allY.length === 0) {
    // Fallback: just grab all numbers in pairs
    const allNums = [...d.matchAll(/[-+]?\d*\.?\d+/g)].map(m => parseFloat(m[0]));
    for (let i = 0; i < allNums.length - 1; i += 2) {
      allX.push(allNums[i]);
      allY.push(allNums[i + 1]);
    }
  }
  
  const cx = Math.round(allX.reduce((a, b) => a + b, 0) / allX.length);
  const cy = Math.round(allY.reduce((a, b) => a + b, 0) / allY.length);
  
  return { cx, cy };
}

// ── Region mappings ──────────────────────────────────────────────────────────

const WESTEROS_REGIONS = {
  '#564627': { region: 'iron-islands', name: 'Iron Islands' },
  '#464748': { region: 'the-vale', name: 'The Vale' },
  '#4E4434': { region: 'westerlands', name: 'Westerlands' },
  '#40372A': { region: 'stormlands', name: 'Stormlands' },
  '#424541': { region: 'the-north', name: 'The North' },
  '#412C23': { region: 'dorne', name: 'Dorne' },
  '#1C302B': { region: 'the-reach', name: 'The Reach' },
  '#2C1E21': { region: 'crownlands', name: 'Crownlands' },
  '#343C43': { region: 'riverlands', name: 'Riverlands' },
};

const ESSOS_REGIONS = {
  '#A46C67': { region: 'slavers-bay', name: "Slaver's Bay" },
  '#777052': { region: 'free-cities', name: 'Free Cities' },
  '#976D3B': { region: 'dothraki-sea', name: 'Dothraki Sea' },
  '#5D696B': { region: 'ghiscar', name: 'Ghiscar' },
  '#7F6376': { region: 'valyria', name: 'Valyria' },
};

// Territory names for Westeros (by region, ordered roughly north to south, west to east)
const WESTEROS_TERRITORY_NAMES = {
  'iron-islands': ['Pyke', 'Great Wyk'],
  'the-vale': ['The Fingers', 'Gulltown', 'The Eyrie', 'Runestone', 'Bloody Gate', 'Heart of the Vale', 'Longbow Hall', 'Wickenden', 'Ironoaks', 'Redfort', 'Snakewood', 'Old Anchor'],
  'westerlands': ['Lannisport', 'Casterly Rock', 'The Golden Tooth', 'Ashemark'],
  'stormlands': ["Storm's End", 'Bronzegate', 'Blackhaven', 'Griffin\'s Roost'],
  'the-north': ['Winterfell', 'Bear Island', 'The Dreadfort', 'White Harbor', 'Deepwood Motte', 'Last Hearth', 'Moat Cailin'],
  'dorne': ['Sunspear', 'Yronwood', 'Starfall', 'Hellholt', 'Godsgrace'],
  'the-reach': ['Highgarden', 'Oldtown', 'Horn Hill', 'Brightwater Keep'],
  'crownlands': ["King's Landing", 'Dragonstone', 'Duskendale', 'Rosby', 'Crackclaw Point'],
  'riverlands': ['Riverrun', 'Harrenhal', 'The Twins', 'Seagard', 'Maidenpool'],
};

const ESSOS_TERRITORY_NAMES = {
  'slavers-bay': ['Astapor', 'Yunkai', 'Meereen', 'New Ghis', 'Tolos', 'Elyria', 'Mantarys', 'Volantis Hinterland', 'Bhorash', 'Oros', 'Chroyane'],
  'free-cities': ['Braavos', 'Pentos', 'Myr', 'Tyrosh', 'Lys', 'Norvos', 'Qohor'],
  'dothraki-sea': ['Vaes Dothrak', 'Western Dothraki Sea', 'Eastern Dothraki Sea', 'Sarnath', 'Haesh Dori', 'Saath'],
  'ghiscar': ['Ghiscar', 'Lhazar', 'Bayasabhad', 'Shamyriana', 'Kayakayanaya', 'Port Yhos', 'Isle of Cedars', 'Ghozai', 'Hesh'],
  'valyria': ['Valyria', 'Sar Mell', 'Selhorys', 'Volon Therys', 'Dagger Lake', 'Ar Noy'],
};

// ── Generate React component ─────────────────────────────────────────────────

function generateComponent(name, svgData, prefix, regionMap) {
  const filledPaths = svgData.paths.filter(p => p.isFilled && !p.fillRule);
  const strokePaths = svgData.paths.filter(p => p.isStrokeOnly || p.hasBoth);
  
  // Escape JSX special chars in path data
  const escapeJSX = (str) => str;
  
  let jsx = `'use client';

import React from 'react';

interface ${name}Props {
  territoryFills: Record<string, string>;
  territoryStrokes: Record<string, { color: string; width: number }>;
  selectedTerritory: string | null;
  onTerritoryClick: (id: string) => void;
  onTerritoryHover: (id: string | null) => void;
  overlays: React.ReactNode;
}

const ORIGINAL_FILLS: Record<string, string> = {
${filledPaths.map((p, i) => `  '${prefix}${i + 1}': '${p.fill}',`).join('\n')}
};

export const ${name.toUpperCase()}_PATH_IDS = [
${filledPaths.map((_, i) => `  '${prefix}${i + 1}',`).join('\n')}
];

export default function ${name}({
  territoryFills,
  territoryStrokes,
  selectedTerritory,
  onTerritoryClick,
  onTerritoryHover,
  overlays,
}: ${name}Props) {
  return (
    <svg
      width="${svgData.width}"
      height="${svgData.height}"
      viewBox="${svgData.viewBox}"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <defs>
        <filter id="${prefix}glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Territory paths */}
`;

  filledPaths.forEach((p, i) => {
    const id = `${prefix}${i + 1}`;
    jsx += `      <path
        data-territory="${id}"
        d="${escapeJSX(p.d)}"
        fill={territoryFills['${id}'] || ORIGINAL_FILLS['${id}']}
        stroke={territoryStrokes['${id}']?.color || 'black'}
        strokeWidth={territoryStrokes['${id}']?.width || 1}
        className="cursor-pointer transition-colors duration-200 hover:brightness-125"
        filter={selectedTerritory === '${id}' ? 'url(#${prefix}glow)' : undefined}
        onClick={() => onTerritoryClick('${id}')}
        onMouseEnter={() => onTerritoryHover('${id}')}
        onMouseLeave={() => onTerritoryHover(null)}
      />\n`;
  });

  // Add stroke-only paths (borders)
  strokePaths.forEach((p, i) => {
    jsx += `      <path
        d="${escapeJSX(p.d)}"
        stroke="black"
        strokeWidth={1}
        fill="none"
        className="pointer-events-none"
      />\n`;
  });

  jsx += `
      {/* Overlays (army badges, icons) */}
      {overlays}
    </svg>
  );
}
`;

  return jsx;
}

// ── Generate territory data ──────────────────────────────────────────────────

function generateTerritoryData(westerosData, essosData) {
  const wFilledPaths = westerosData.paths.filter(p => p.isFilled && !p.fillRule);
  const eFilledPaths = essosData.paths.filter(p => p.isFilled);
  
  // Track name usage per region
  const wNameCounters = {};
  const eNameCounters = {};
  
  function getTerritoryName(fill, index, nameMap, counters, regionMapEntry) {
    const regionId = regionMapEntry.region;
    if (!counters[regionId]) counters[regionId] = 0;
    const names = nameMap[regionId] || [];
    const name = names[counters[regionId]] || `${regionMapEntry.name} ${counters[regionId] + 1}`;
    counters[regionId]++;
    return name;
  }
  
  let output = `export interface Territory {
  id: string;
  name: string;
  map: "westeros" | "essos";
  region: string;
  owner: string | null;
  armies: number;
  hascastle: boolean;
  hasport: boolean;
  portColor: string | null;
  hasSeatOfPower: boolean;
  specialUnits: string[];
  isNeutral: boolean;
  adjacentTerritories: string[];
  portConnections: string[];
  cx: number;
  cy: number;
  svgPathIndex: number;
  originalFill: string;
}

export interface TerritoryCard {
  id: string;
  territoryId: string;
  type: 'infantry' | 'cavalry' | 'siege' | 'wild';
  territoryName: string;
}

`;

  // Generate Westeros territories
  output += `// Westeros territories (${wFilledPaths.length} territories)\n`;
  output += `export const WESTEROS_TERRITORIES: Territory[] = [\n`;
  
  wFilledPaths.forEach((p, i) => {
    const regionEntry = WESTEROS_REGIONS[p.fill] || { region: 'unknown', name: 'Unknown' };
    const name = getTerritoryName(p.fill, i, WESTEROS_TERRITORY_NAMES, wNameCounters, regionEntry);
    const { cx, cy } = computeCentroid(p.d);
    const id = `w${i + 1}`;
    
    output += `  {
    id: "${id}",
    name: "${name}",
    map: "westeros",
    region: "${regionEntry.region}",
    owner: null,
    armies: 0,
    hascastle: ${i % 5 === 0},
    hasport: false,
    portColor: null,
    hasSeatOfPower: ${i === 0},
    specialUnits: [],
    isNeutral: false,
    adjacentTerritories: [],
    portConnections: [],
    cx: ${cx},
    cy: ${cy},
    svgPathIndex: ${i},
    originalFill: "${p.fill}",
  },\n`;
  });
  
  output += `];\n\n`;

  // Generate Essos territories
  output += `// Essos territories (${eFilledPaths.length} territories)\n`;
  output += `export const ESSOS_TERRITORIES: Territory[] = [\n`;
  
  eFilledPaths.forEach((p, i) => {
    const regionEntry = ESSOS_REGIONS[p.fill] || { region: 'unknown', name: 'Unknown' };
    const name = getTerritoryName(p.fill, i, ESSOS_TERRITORY_NAMES, eNameCounters, regionEntry);
    const { cx, cy } = computeCentroid(p.d);
    const id = `e${i + 1}`;
    
    output += `  {
    id: "${id}",
    name: "${name}",
    map: "essos",
    region: "${regionEntry.region}",
    owner: null,
    armies: 0,
    hascastle: ${i % 5 === 0},
    hasport: false,
    portColor: null,
    hasSeatOfPower: ${i === 0},
    specialUnits: [],
    isNeutral: false,
    adjacentTerritories: [],
    portConnections: [],
    cx: ${cx},
    cy: ${cy},
    svgPathIndex: ${i},
    originalFill: "${p.fill}",
  },\n`;
  });
  
  output += `];\n\n`;

  // Compute adjacency based on centroid proximity
  output += computeAdjacency(wFilledPaths, eFilledPaths);

  // Generate remaining exports
  output += `
export const ALL_TERRITORIES: Territory[] = [...WESTEROS_TERRITORIES, ...ESSOS_TERRITORIES];

export interface Region {
  id: string;
  name: string;
  map: "westeros" | "essos";
  territoryIds: string[];
  bonusArmies: number;
}

export const WESTEROS_REGIONS: Region[] = [
  { id: "the-north", name: "The North", map: "westeros", territoryIds: WESTEROS_TERRITORIES.filter(t => t.region === "the-north").map(t => t.id), bonusArmies: 5 },
  { id: "iron-islands", name: "Iron Islands", map: "westeros", territoryIds: WESTEROS_TERRITORIES.filter(t => t.region === "iron-islands").map(t => t.id), bonusArmies: 2 },
  { id: "the-vale", name: "The Vale", map: "westeros", territoryIds: WESTEROS_TERRITORIES.filter(t => t.region === "the-vale").map(t => t.id), bonusArmies: 7 },
  { id: "riverlands", name: "Riverlands", map: "westeros", territoryIds: WESTEROS_TERRITORIES.filter(t => t.region === "riverlands").map(t => t.id), bonusArmies: 4 },
  { id: "westerlands", name: "Westerlands", map: "westeros", territoryIds: WESTEROS_TERRITORIES.filter(t => t.region === "westerlands").map(t => t.id), bonusArmies: 4 },
  { id: "crownlands", name: "Crownlands", map: "westeros", territoryIds: WESTEROS_TERRITORIES.filter(t => t.region === "crownlands").map(t => t.id), bonusArmies: 4 },
  { id: "the-reach", name: "The Reach", map: "westeros", territoryIds: WESTEROS_TERRITORIES.filter(t => t.region === "the-reach").map(t => t.id), bonusArmies: 4 },
  { id: "stormlands", name: "Stormlands", map: "westeros", territoryIds: WESTEROS_TERRITORIES.filter(t => t.region === "stormlands").map(t => t.id), bonusArmies: 3 },
  { id: "dorne", name: "Dorne", map: "westeros", territoryIds: WESTEROS_TERRITORIES.filter(t => t.region === "dorne").map(t => t.id), bonusArmies: 3 },
];

export const ESSOS_REGIONS: Region[] = [
  { id: "free-cities", name: "Free Cities", map: "essos", territoryIds: ESSOS_TERRITORIES.filter(t => t.region === "free-cities").map(t => t.id), bonusArmies: 5 },
  { id: "dothraki-sea", name: "Dothraki Sea", map: "essos", territoryIds: ESSOS_TERRITORIES.filter(t => t.region === "dothraki-sea").map(t => t.id), bonusArmies: 4 },
  { id: "slavers-bay", name: "Slaver's Bay", map: "essos", territoryIds: ESSOS_TERRITORIES.filter(t => t.region === "slavers-bay").map(t => t.id), bonusArmies: 6 },
  { id: "ghiscar", name: "Ghiscar", map: "essos", territoryIds: ESSOS_TERRITORIES.filter(t => t.region === "ghiscar").map(t => t.id), bonusArmies: 5 },
  { id: "valyria", name: "Valyria", map: "essos", territoryIds: ESSOS_TERRITORIES.filter(t => t.region === "valyria").map(t => t.id), bonusArmies: 4 },
];

export const ALL_REGIONS: Region[] = [...WESTEROS_REGIONS, ...ESSOS_REGIONS];

export const CARD_SET_BONUSES = {
  threeInfantry: 4,
  threeCavalry: 6,
  threeSiege: 8,
  oneEach: 10,
  wild: 2,
};

export function generateTerritoryCards(): TerritoryCard[] {
  const types: Array<'infantry' | 'cavalry' | 'siege'> = ['infantry', 'cavalry', 'siege'];
  const cards: TerritoryCard[] = ALL_TERRITORIES.map((t, i) => ({
    id: \`card-\${t.id}\`,
    territoryId: t.id,
    type: types[i % 3],
    territoryName: t.name,
  }));
  // Add 2 wild cards
  cards.push({ id: 'wild-1', territoryId: '', type: 'wild', territoryName: 'Wild' });
  cards.push({ id: 'wild-2', territoryId: '', type: 'wild', territoryName: 'Wild' });
  return cards;
}
`;

  return output;
}

function computeAdjacency(wPaths, ePaths) {
  // Compute centroids
  const wCentroids = wPaths.map(p => computeCentroid(p.d));
  const eCentroids = ePaths.map(p => computeCentroid(p.d));
  
  // For Westeros: connect territories within ~120px of each other
  const WESTEROS_THRESHOLD = 120;
  const ESSOS_THRESHOLD = 100;
  
  let code = `// Auto-computed adjacency based on proximity\n`;
  code += `function initAdjacency() {\n`;
  code += `  const adj: Record<string, string[]> = {};\n`;
  
  // Westeros adjacency
  for (let i = 0; i < wCentroids.length; i++) {
    const neighbors = [];
    for (let j = 0; j < wCentroids.length; j++) {
      if (i === j) continue;
      const dx = wCentroids[i].cx - wCentroids[j].cx;
      const dy = wCentroids[i].cy - wCentroids[j].cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < WESTEROS_THRESHOLD) {
        neighbors.push(`w${j + 1}`);
      }
    }
    code += `  adj['w${i + 1}'] = ${JSON.stringify(neighbors)};\n`;
  }
  
  // Essos adjacency
  for (let i = 0; i < eCentroids.length; i++) {
    const neighbors = [];
    for (let j = 0; j < eCentroids.length; j++) {
      if (i === j) continue;
      const dx = eCentroids[i].cx - eCentroids[j].cx;
      const dy = eCentroids[i].cy - eCentroids[j].cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < ESSOS_THRESHOLD) {
        neighbors.push(`e${j + 1}`);
      }
    }
    code += `  adj['e${i + 1}'] = ${JSON.stringify(neighbors)};\n`;
  }
  
  code += `  return adj;\n`;
  code += `}\n\n`;
  code += `const ADJACENCY = initAdjacency();\n\n`;
  
  // Apply adjacency to territories
  code += `// Apply adjacency\n`;
  code += `WESTEROS_TERRITORIES.forEach(t => { t.adjacentTerritories = ADJACENCY[t.id] || []; });\n`;
  code += `ESSOS_TERRITORIES.forEach(t => { t.adjacentTerritories = ADJACENCY[t.id] || []; });\n\n`;
  
  return code;
}

// ── Main ─────────────────────────────────────────────────────────────────────

const projectRoot = __dirname;
const srcDir = path.join(projectRoot, 'src', 'app', 'game');

// Parse SVGs
const westerosData = parseSvg(path.join(projectRoot, 'public', 'Vector 1.svg'));
const essosData = parseSvg(path.join(projectRoot, 'public', 'Group 20 (1).svg'));

console.log(`Westeros: ${westerosData.width}x${westerosData.height}, ${westerosData.paths.length} total paths`);
console.log(`  Filled: ${westerosData.paths.filter(p => p.isFilled).length}`);
console.log(`  Stroke: ${westerosData.paths.filter(p => p.isStrokeOnly).length}`);
console.log(`  Both: ${westerosData.paths.filter(p => p.hasBoth).length}`);

console.log(`\nEssos: ${essosData.width}x${essosData.height}, ${essosData.paths.length} total paths`);
console.log(`  Filled: ${essosData.paths.filter(p => p.isFilled).length}`);
console.log(`  Stroke: ${essosData.paths.filter(p => p.isStrokeOnly).length}`);
console.log(`  Both: ${essosData.paths.filter(p => p.hasBoth).length}`);

// Generate components
const westerosComponent = generateComponent('WesterosMap', westerosData, 'w', WESTEROS_REGIONS);
const essosComponent = generateComponent('EssosMap', essosData, 'e', ESSOS_REGIONS);

// Generate territory data
const territoryData = generateTerritoryData(westerosData, essosData);

// Write files
const componentsDir = path.join(srcDir, 'components');
fs.writeFileSync(path.join(componentsDir, 'WesterosMap.tsx'), westerosComponent);
console.log('\nWrote WesterosMap.tsx');

fs.writeFileSync(path.join(componentsDir, 'EssosMap.tsx'), essosComponent);
console.log('Wrote EssosMap.tsx');

fs.writeFileSync(path.join(srcDir, 'data', 'territories.ts'), territoryData);
console.log('Wrote territories.ts');

console.log('\nDone! Generated map components and territory data.');
