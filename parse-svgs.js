const fs = require('fs');

// Parse Westeros SVG
const wSvg = fs.readFileSync('public/Vector 1.svg', 'utf8');
const wPaths = [...wSvg.matchAll(/<path\s+([^>]+)\/>/g)];

let fillPaths = 0;
let strokePaths = 0;
wPaths.forEach((m, i) => {
  const attrs = m[1];
  const hasFill = attrs.match(/fill="(#[0-9a-fA-F]+)"/);
  const hasStroke = attrs.includes('stroke=');
  const hasFillRule = attrs.includes('fill-rule');
  if (hasFill && !hasStroke) {
    fillPaths++;
    const cx = attrs.match(/d="M([\d.]+)\s+([\d.]+)/);
    console.log('W-' + fillPaths + ': fill=' + hasFill[1] + (hasFillRule ? ' (fill-rule)' : '') + ' start=(' + (cx?cx[1]:'?') + ',' + (cx?cx[2]:'?') + ')');
  } else if (hasStroke && !hasFill) {
    strokePaths++;
  } else {
    const f = attrs.match(/fill="([^"]+)"/);
    if (f && f[1] !== 'none') {
      // Has both fill and stroke
    }
  }
});
console.log('\nWesteros Total: ' + fillPaths + ' filled, ' + strokePaths + ' stroke-only');

// Parse Essos SVG  
const eSvg = fs.readFileSync('public/Group 20 (1).svg', 'utf8');
const ePaths = [...eSvg.matchAll(/<path\s+([^>]+)\/>/g)];

let eFillPaths = 0;
let eStrokePaths = 0;
ePaths.forEach((m, i) => {
  const attrs = m[1];
  const hasFill = attrs.match(/fill="(#[0-9a-fA-F]+)"/);
  const hasStroke = attrs.includes('stroke=');
  if (hasFill && !hasStroke) {
    eFillPaths++;
    const cx = attrs.match(/d="M([\d.]+)\s+([\d.]+)/);
    console.log('E-' + eFillPaths + ': fill=' + hasFill[1] + ' start=(' + (cx?cx[1]:'?') + ',' + (cx?cx[2]:'?') + ')');
  } else if (hasStroke && !hasFill) {
    eStrokePaths++;
  }
});
console.log('\nEssos Total: ' + eFillPaths + ' filled, ' + eStrokePaths + ' stroke-only');
