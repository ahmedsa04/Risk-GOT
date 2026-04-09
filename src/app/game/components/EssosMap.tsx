'use client';

import React from 'react';

interface EssosMapProps {
  territoryFills: Record<string, string>;
  territoryStrokes: Record<string, { color: string; width: number }>;
  selectedTerritory: string | null;
  onTerritoryClick: (id: string) => void;
  onTerritoryHover: (id: string | null) => void;
  overlays: React.ReactNode;
}

const ORIGINAL_FILLS: Record<string, string> = {
  'e1': '#A46C67',
  'e2': '#A46C67',
  'e3': '#A46C67',
  'e4': '#A46C67',
  'e5': '#777052',
  'e6': '#777052',
  'e7': '#777052',
  'e8': '#777052',
  'e9': '#777052',
  'e10': '#777052',
  'e11': '#777052',
  'e12': '#976D3B',
  'e13': '#976D3B',
  'e14': '#976D3B',
  'e15': '#976D3B',
  'e16': '#976D3B',
  'e17': '#5D696B',
  'e18': '#5D696B',
  'e19': '#5D696B',
  'e20': '#5D696B',
  'e21': '#5D696B',
  'e22': '#5D696B',
  'e23': '#5D696B',
  'e24': '#5D696B',
  'e25': '#5D696B',
  'e26': '#7F6376',
  'e27': '#7F6376',
  'e28': '#7F6376',
  'e29': '#7F6376',
  'e30': '#7F6376',
  'e31': '#7F6376',
  'e32': '#A46C67',
  'e33': '#A46C67',
  'e34': '#A46C67',
  'e35': '#A46C67',
  'e36': '#A46C67',
  'e37': '#A46C67',
  'e38': '#A46C67',
  'e39': '#976D3B',
};

export const ESSOSMAP_PATH_IDS = [
  'e1',
  'e2',
  'e3',
  'e4',
  'e5',
  'e6',
  'e7',
  'e8',
  'e9',
  'e10',
  'e11',
  'e12',
  'e13',
  'e14',
  'e15',
  'e16',
  'e17',
  'e18',
  'e19',
  'e20',
  'e21',
  'e22',
  'e23',
  'e24',
  'e25',
  'e26',
  'e27',
  'e28',
  'e29',
  'e30',
  'e31',
  'e32',
  'e33',
  'e34',
  'e35',
  'e36',
  'e37',
  'e38',
  'e39',
];

export default function EssosMap({
  territoryFills,
  territoryStrokes,
  selectedTerritory,
  onTerritoryClick,
  onTerritoryHover,
  overlays,
}: EssosMapProps) {
  return (
    <svg
      width="943"
      height="653"
      viewBox="0 0 943 653"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <defs>
        <filter id="eglow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Territory paths */}
      <path
        data-territory="e1"
        d="M942.06 41.9999L935.06 49.9999L924.06 53.9999L904.06 48.9999C899.227 49.8332 888.96 50.9999 886.56 48.9999C883.56 46.4999 873.06 38.4999 871.56 38.4999C870.06 38.4999 866.56 45.9999 862.56 43.9999C859.36 42.3999 856.227 40.3332 855.06 39.4999L842.06 41.9999L841.06 47.9999L834.06 52.4999L829.06 49.9999L825.06 51.4999L820.56 44.9999L812.56 41.9999L807.06 47.9999H797.06L798.06 55L795.06 60.5L788.06 62.5L783.56 58.5L780.06 62.5L776.06 64.5L772.56 63.5L767.56 64.5L761.56 67V71.5C765.227 76.5 772.06 88.1 770.06 94.5C769.66 94.9 773.894 104.333 776.06 109C781.227 113 792.16 123.2 794.56 132C794.56 132.8 798.227 134.667 800.06 135.5C802.727 138 808.96 142.9 812.56 142.5C817.06 142 816.06 149.5 820.56 152.5C824.16 154.9 825.727 156.5 826.06 157C827.394 161.5 828.16 171.8 820.56 177C820.56 178.2 820.894 191.167 821.06 197.5L855.06 216.5C861.394 209.333 876.16 194.7 884.56 193.5C892.96 192.3 900.727 192.333 903.56 192.5C907.227 190.5 914.56 186.1 914.56 184.5C914.56 182.9 916.894 180.5 918.06 179.5H929.06L937.56 177H942.06L942.06 41.9999Z"
        fill={territoryFills['e1'] || ORIGINAL_FILLS['e1']}
        stroke={territoryStrokes['e1']?.color || 'black'}
        strokeWidth={territoryStrokes['e1']?.width || 1}
        className="cursor-pointer transition-colors duration-200 hover:brightness-125"
        filter={selectedTerritory === 'e1' ? 'url(#eglow)' : undefined}
        onClick={() => onTerritoryClick('e1')}
        onMouseEnter={() => onTerritoryHover('e1')}
        onMouseLeave={() => onTerritoryHover(null)}
      />
      <path
        data-territory="e2"
        d="M863.56 355L861.56 350L865.06 349V343.5L868.56 336L871.56 327L868.56 317L862.56 312L861.56 303.5L855.06 297L857.06 290.5L854.06 289.5L849.06 288.5L847.06 285.5L851.56 278L854.06 266.5L852.56 256L849.06 253.5L850.56 241.5L851.56 231.5H859.06L862.56 226L860.56 222.5L857.06 221.5L855.06 216.5L821.06 197.5L818.06 196L813.06 199C809.56 199.5 802.06 200.5 800.06 200.5C792.06 208.5 784.394 205.167 781.56 202.5L763.56 203.5L774.06 211.5L781.56 216.5L789.56 224.5V233L792.56 241.5V253.5L787.56 263L780.06 275.5L768.06 280.5L763.56 285.5L757.31 286.25L763.56 288.5L765.06 291L768.06 294L770.06 298.5L772.06 299.5V309.5L768.06 313L767.06 318L768.06 325V330L770.56 333L770.06 337L768.06 340V342C768.06 342.8 772.06 349.667 774.06 353L783.56 361.5V364.5L788.56 365.5L790.06 363L791.56 359L795.56 357L797.06 354.5L796.56 348.5L802.56 343.5H807.06L812.06 345H834.56L841.56 350L844.56 347L852.56 348L859.06 354L861.56 357L863.56 355Z"
        fill={territoryFills['e2'] || ORIGINAL_FILLS['e2']}
        stroke={territoryStrokes['e2']?.color || 'black'}
        strokeWidth={territoryStrokes['e2']?.width || 1}
        className="cursor-pointer transition-colors duration-200 hover:brightness-125"
        filter={selectedTerritory === 'e2' ? 'url(#eglow)' : undefined}
        onClick={() => onTerritoryClick('e2')}
        onMouseEnter={() => onTerritoryHover('e2')}
        onMouseLeave={() => onTerritoryHover(null)}
      />
      <path
        data-territory="e3"
        d="M923.06 468.5V462.5L912.56 459V454C909.394 452.167 903.06 447.7 903.06 444.5C903.06 441.3 897.394 439.5 894.56 439L890.06 432L883.56 433V427C881.894 425 878.16 420.7 876.56 419.5C874.96 418.3 872.56 418.333 871.56 418.5L866.06 412.5L862.56 407L857.06 409L859.06 398L861.56 393C860.727 392.167 859.06 390.2 859.06 389V381.5L862.56 374L865.06 364.5L863.56 355L861.56 357L859.06 354L852.56 348L844.56 347L841.56 350L834.56 345H812.06L807.06 343.5H802.56L796.56 348.5L797.06 354.5L795.56 357L791.56 359L790.06 363L788.56 365.5L783.56 364.5L781.06 366.5L782.06 371L777.56 374L768.06 385L764.56 388.5L766.06 391.5V394.5L770.56 395L774.56 395.5C775.06 396.667 776.06 399.1 776.06 399.5C776.06 399.9 775.727 403.667 775.56 405.5L777.56 410L778.56 413.5H785.56L791.06 416.5H793.56L799.56 420V424H796.56L795.06 429L793.06 434L793.56 437C794.727 437.5 797.16 438.5 797.56 438.5C797.96 438.5 801.394 437.5 803.06 437C803.56 437.667 804.66 439.4 805.06 441C805.46 442.6 805.227 447 805.06 449L807.56 450.5L812.56 452.5L815.56 456.5L814.56 462L819.56 465.5V471L821.56 474.5L824.06 480.5H826.56V476L829.56 472L831.56 471L834.56 472L838.06 470L842.56 469.5C843.894 470.333 846.66 472 847.06 472C847.46 472 853.894 471 857.06 470.5L863.06 464.5H878.06L884.56 469.5L890.06 468.5C892.227 469.667 896.66 472.1 897.06 472.5C897.46 472.9 899.894 473.333 901.06 473.5L906.06 470.5L918.56 468L923.06 468.5Z"
        fill={territoryFills['e3'] || ORIGINAL_FILLS['e3']}
        stroke={territoryStrokes['e3']?.color || 'black'}
        strokeWidth={territoryStrokes['e3']?.width || 1}
        className="cursor-pointer transition-colors duration-200 hover:brightness-125"
        filter={selectedTerritory === 'e3' ? 'url(#eglow)' : undefined}
        onClick={() => onTerritoryClick('e3')}
        onMouseEnter={() => onTerritoryHover('e3')}
        onMouseLeave={() => onTerritoryHover(null)}
      />
      <path
        data-territory="e4"
        d="M803.06 531.5V535.5L807.06 536.5H810.06V544.5L816.06 556.5L811.06 559L808.56 564L803.06 569C803.56 570 804.56 572.4 804.56 574C804.56 575.6 807.227 577.333 808.56 578L831.06 567.5L833.06 562.5L843.56 556.5H853.06L854.56 551L871.56 549.5L877.56 541L868.56 537.5L867.06 531.5L857.06 523L845.56 524.5L844.56 523L837.56 522C833.894 520.333 829.46 513.5 841.06 499.5C841.06 498.7 843.394 497.5 844.56 497L846.56 499.5L857.06 500.5L860.56 507L867.06 511L869.56 514.5L873.06 517.5L876.56 523H881.06L885.06 517.5L898.06 515.5L903.06 511V507L908.06 506L920.56 496L927.06 484L923.06 468.5L918.56 468L906.06 470.5L901.06 473.5C899.894 473.333 897.46 472.9 897.06 472.5C896.66 472.1 892.227 469.667 890.06 468.5L884.56 469.5L878.06 464.5H863.06L857.06 470.5C853.894 471 847.46 472 847.06 472C846.66 472 843.894 470.333 842.56 469.5L838.06 470L834.56 472L831.56 471L829.56 472L826.56 476V480.5L827.56 484L825.06 486.5L822.56 488L813.56 494.5L805.56 498.5L793.56 509V518.5L796.06 523L797.06 527.5L803.06 531.5Z"
        fill={territoryFills['e4'] || ORIGINAL_FILLS['e4']}
        stroke={territoryStrokes['e4']?.color || 'black'}
        strokeWidth={territoryStrokes['e4']?.width || 1}
        className="cursor-pointer transition-colors duration-200 hover:brightness-125"
        filter={selectedTerritory === 'e4' ? 'url(#eglow)' : undefined}
        onClick={() => onTerritoryClick('e4')}
        onMouseEnter={() => onTerritoryHover('e4')}
        onMouseLeave={() => onTerritoryHover(null)}
      />
      <path
        data-territory="e5"
        d="M812.56 41.9999C813.727 38.9999 814.96 32.3999 810.56 29.9999C805.06 26.9999 780.06 23.9999 778.56 24.9999C777.36 25.7999 770.727 27.6666 767.56 28.5C766.56 26 764.16 21 762.56 21C760.56 21 761.56 16 759.06 15.5C757.06 15.1 760.56 12.6667 762.56 11.5L763.56 5.5H759.06L755.56 0.5H753.06L751.56 4H746.06C744.893 3.66667 742.26 3.5 741.06 5.5C739.86 7.5 738.56 11.6667 738.06 13.5C740.893 16.6666 745.06 24.3998 739.06 29.9999C738.06 31 731.06 51.5 693.56 56.5C692.36 56.5 685.393 59.8333 682.06 61.5L656.56 63.5C656.227 61.5 654.16 57.6 648.56 58C648.56 56.5 647.06 52 645.56 52C644.06 52 639.56 56 639.06 58C638.56 60 638.06 69.5 639.06 71.5C639.86 73.1 631.06 80.5 626.56 84H620.56L606.56 96.5L595.56 110.5L583.56 116L578.992 109.147L573.56 122.5H576.06L578.56 123.5H584.06C584.46 123.5 585.227 124.5 585.56 125H598.56L603.06 120.5H626.56L642.56 112H649.56L659.06 116H670.06L675.06 112L681.06 103C691.394 103 712.56 102.8 714.56 102C716.56 101.2 720.06 97 721.56 95L733.56 94.5L751.06 72L761.56 71.5V67L767.56 64.5L772.56 63.5L776.06 64.5L780.06 62.5L783.56 58.5L788.06 62.5L795.06 60.5L798.06 55L797.06 47.9999H807.06L812.56 41.9999Z"
        fill={territoryFills['e5'] || ORIGINAL_FILLS['e5']}
        stroke={territoryStrokes['e5']?.color || 'black'}
        strokeWidth={territoryStrokes['e5']?.width || 1}
        className="cursor-pointer transition-colors duration-200 hover:brightness-125"
        filter={selectedTerritory === 'e5' ? 'url(#eglow)' : undefined}
        onClick={() => onTerritoryClick('e5')}
        onMouseEnter={() => onTerritoryHover('e5')}
        onMouseLeave={() => onTerritoryHover(null)}
      />
      <path
        data-territory="e6"
        d="M776.06 109C773.894 104.333 769.66 94.9 770.06 94.5C772.06 88.1 765.227 76.5 761.56 71.5L751.06 72L733.56 94.5L721.56 95C720.06 97 716.56 101.2 714.56 102C712.56 102.8 691.394 103 681.06 103L675.06 112L670.06 116H659.06L649.56 112H642.56L626.56 120.5H603.06L598.56 125H585.56C585.227 124.5 584.46 123.5 584.06 123.5H578.56L576.06 122.5H573.56V125.5L561.56 145V157L569.56 177.5H597.06L611.06 171.5H615.06C621.727 176 637.86 184.6 649.06 183C660.26 181.4 678.727 175.667 686.56 173C692.394 176 704.96 182 708.56 182C712.16 182 735.727 182.667 747.06 183L763.56 203.5L781.56 202.5C784.394 205.167 792.06 208.5 800.06 200.5C802.06 200.5 809.56 199.5 813.06 199L818.06 196L821.06 197.5C820.894 191.167 820.56 178.2 820.56 177C828.16 171.8 827.394 161.5 826.06 157C825.727 156.5 824.16 154.9 820.56 152.5C816.06 149.5 817.06 142 812.56 142.5C808.96 142.9 802.727 138 800.06 135.5C798.227 134.667 794.56 132.8 794.56 132C792.16 123.2 781.227 113 776.06 109Z"
        fill={territoryFills['e6'] || ORIGINAL_FILLS['e6']}
        stroke={territoryStrokes['e6']?.color || 'black'}
        strokeWidth={territoryStrokes['e6']?.width || 1}
        className="cursor-pointer transition-colors duration-200 hover:brightness-125"
        filter={selectedTerritory === 'e6' ? 'url(#eglow)' : undefined}
        onClick={() => onTerritoryClick('e6')}
        onMouseEnter={() => onTerritoryHover('e6')}
        onMouseLeave={() => onTerritoryHover(null)}
      />
      <path
        data-territory="e7"
        d="M578.56 108.5L576.06 101.5L571.06 98.5L564.56 89L551.06 94V104L556.56 110.5L562.06 119V126.5L559.06 131.5V135L555.56 137L551.06 131.5H545.06L543.56 132C545.06 141.333 547.76 160.9 546.56 164.5C545.06 169 561.56 189 561.56 195.5C561.56 200.7 558.227 203.667 556.56 204.5H551.06L548.56 207V211.5L555.56 215.5L561.56 220L559.06 223.5V227.5L564.56 231.5V236L571.56 237L563.06 245.5V252L564.56 255.5L561.56 259L552.06 258L544.06 261L537.56 249L526.06 243.5L521.06 245.5L507.56 241.5L506.56 246V255.5L507.56 261H514.06L515.56 267L511.06 270.5V274.5L515.56 277.5L507.56 289L514.06 309L512.56 323L507.56 329.5L503.06 335.5H515.56L528.06 333.5H546.56L553.56 335.5L578.06 326L593.06 316L601.56 314L616.06 313C619.727 313.833 629.06 314.1 637.06 308.5C645.06 302.9 669.727 302.833 681.06 303.5L706.06 306.5L723.06 299L737.56 297L742.06 290.5L751.06 287L757.31 286.25L763.56 285.5L768.06 280.5L780.06 275.5L787.56 263L792.56 253.5V241.5L789.56 233V224.5L781.56 216.5L774.06 211.5L763.56 203.5L747.06 183C735.727 182.667 712.16 182 708.56 182C704.96 182 692.394 176 686.56 173C678.727 175.667 660.26 181.4 649.06 183C637.86 184.6 621.727 176 615.06 171.5H611.06L597.06 177.5H569.56L561.56 157V145L573.56 125.5V122.5L578.992 109.147L578.56 108.5Z"
        fill={territoryFills['e7'] || ORIGINAL_FILLS['e7']}
        stroke={territoryStrokes['e7']?.color || 'black'}
        strokeWidth={territoryStrokes['e7']?.width || 1}
        className="cursor-pointer transition-colors duration-200 hover:brightness-125"
        filter={selectedTerritory === 'e7' ? 'url(#eglow)' : undefined}
        onClick={() => onTerritoryClick('e7')}
        onMouseEnter={() => onTerritoryHover('e7')}
        onMouseLeave={() => onTerritoryHover(null)}
      />
      <path
        data-territory="e8"
        d="M553.56 335.5L546.56 333.5L549.06 345.5L563.56 357.5L578.06 370.5L577.56 378L580.56 379L585.06 382.5L586.06 386.5L590.56 389.5L593.56 393.5C592.727 395.5 590.36 400.1 587.56 402.5C584.76 404.9 588.394 405.833 590.56 406L591.06 411L587.56 414V417.5L598.06 415L618.56 401L626.56 392L631.56 383.5L646.06 370.5H652.06L657.56 365L661.06 364.5L676.56 369L693.06 360.5L706.06 348L719.06 344L728.56 336.5L729.56 325L736.56 317L737.56 305V297L723.06 299L706.06 306.5L681.06 303.5C669.727 302.833 645.06 302.9 637.06 308.5C629.06 314.1 619.727 313.833 616.06 313L601.56 314L593.06 316L578.06 326L553.56 335.5Z"
        fill={territoryFills['e8'] || ORIGINAL_FILLS['e8']}
        stroke={territoryStrokes['e8']?.color || 'black'}
        strokeWidth={territoryStrokes['e8']?.width || 1}
        className="cursor-pointer transition-colors duration-200 hover:brightness-125"
        filter={selectedTerritory === 'e8' ? 'url(#eglow)' : undefined}
        onClick={() => onTerritoryClick('e8')}
        onMouseEnter={() => onTerritoryHover('e8')}
        onMouseLeave={() => onTerritoryHover(null)}
      />
      <path
        data-territory="e9"
        d="M506.56 255.5V246H501.06L496.56 243.5V238.5L489.56 240V232.5L484.06 231.5L479.56 234H470.56L464.56 231.5H458.06L450.56 237L442.56 231.5V227.5H438.06L430.56 225L425.06 223.5L421.56 225H416.56L415.06 218L413.06 214V207L410.56 205V202L412.06 200V194.5H409.06L408.06 192H400.56L399.06 194.5H392.06L390.56 191L389.56 184L385.06 183L384.06 180.5L379.56 181.5L376.56 184L368.06 187L364.06 191H357.56L351.06 194.5L346.06 200L342.06 208H336.06L322.06 217L316.56 225L314.56 239.5L312.56 243.5L310.56 251L299.06 273V283L293.06 291L290.06 299V301.5L285.06 305L283.56 311L285.06 317L283.56 320V328.5L280.56 330.5L278.56 335L285.06 336L306.56 356L315.06 354L318.06 353L328.06 352L330.06 356L334.06 359.5L342.06 362.5L347.06 368C347.894 368 350.26 368.3 353.06 369.5C355.86 370.7 356.56 369 356.56 368C358.894 367.167 363.66 365.6 364.06 366C364.46 366.4 365.894 367.5 366.56 368L377.06 362.5L380.06 358L384.56 356L391.56 354L396.06 356C396.56 355 397.86 352.8 399.06 352C400.56 351 408.56 350.5 409.06 350.5C409.46 350.5 413.56 352.167 415.56 353H422.06L424.06 350.5H435.06L438.56 353H444.06L450.56 348L464.56 345.5L470.56 349L478.56 346.5L479.56 343L481.06 341.5H486.56L503.06 335.5L507.56 329.5L512.56 323L514.06 309L507.56 289L515.56 277.5L511.06 274.5V270.5L515.56 267L514.06 261H507.56L506.56 255.5Z"
        fill={territoryFills['e9'] || ORIGINAL_FILLS['e9']}
        stroke={territoryStrokes['e9']?.color || 'black'}
        strokeWidth={territoryStrokes['e9']?.width || 1}
        className="cursor-pointer transition-colors duration-200 hover:brightness-125"
        filter={selectedTerritory === 'e9' ? 'url(#eglow)' : undefined}
        onClick={() => onTerritoryClick('e9')}
        onMouseEnter={() => onTerritoryHover('e9')}
        onMouseLeave={() => onTerritoryHover(null)}
      />
      <path
        data-territory="e10"
        d="M545.06 131.5L540.56 122.5L541.56 118L526.06 110.5L537.56 96.5V92.5L532.06 90.5L518.56 75L514.06 77L504.06 78L495.06 81L486.56 86L485.06 92.5L474.56 106.5V112L466.06 118L456.56 125V126.5L454.06 138.5V148.5L452.06 151L449.06 162L446.56 168.5L444.56 174L440.06 176.5L434.06 180L430.06 186.5L427.06 188L425.56 192L422.06 192.5L419.56 194.5H412.06V200L410.56 202V205L413.06 207V214L415.06 218L416.56 225H421.56L425.06 223.5L430.56 225L438.06 227.5H442.56V231.5L450.56 237L458.06 231.5H464.56L470.56 234H479.56L484.06 231.5L489.56 232.5V240L496.56 238.5V243.5L501.06 246H506.56L507.56 241.5L521.06 245.5L526.06 243.5L537.56 249L544.06 261L552.06 258L561.56 259L564.56 255.5L563.06 252V245.5L571.56 237L564.56 236V231.5L559.06 227.5V223.5L561.56 220L555.56 215.5L548.56 211.5V207L551.06 204.5H556.56C558.227 203.667 561.56 200.7 561.56 195.5C561.56 189 545.06 169 546.56 164.5C547.76 160.9 545.06 141.333 543.56 132L545.06 131.5Z"
        fill={territoryFills['e10'] || ORIGINAL_FILLS['e10']}
        stroke={territoryStrokes['e10']?.color || 'black'}
        strokeWidth={territoryStrokes['e10']?.width || 1}
        className="cursor-pointer transition-colors duration-200 hover:brightness-125"
        filter={selectedTerritory === 'e10' ? 'url(#eglow)' : undefined}
        onClick={() => onTerritoryClick('e10')}
        onMouseEnter={() => onTerritoryHover('e10')}
        onMouseLeave={() => onTerritoryHover(null)}
      />
      <path
        data-territory="e11"
        d="M456.56 125L447.06 113L442.56 105L436.06 100V84L428.06 72L425.06 62.5L417.06 54.5L408.56 49L405.06 48L398.56 51L392.06 54.5L387.06 56.5L385.06 61.5V65L380.06 70.5L375.06 78L368.56 82L361.06 86H350.56L348.56 89.5V98.5L347.56 102L342.56 103L340.06 105L337.06 101V98.5L330.56 101L325.06 107.5L317.06 113L313.06 118H308.06L306.06 123L308.06 127H311.56L322.56 136.5H327.56L338.56 147.5V152L339.56 158.5L340.56 164.5L339.56 169.5L341.06 180.5L340.56 185.5L339.56 189V201L338.56 203.5L336.06 208H342.06L346.06 200L351.06 194.5L357.56 191H364.06L368.06 187L376.56 184L379.56 181.5L384.06 180.5L385.06 183L389.56 184L390.56 191L392.06 194.5H399.06L400.56 192H408.06L409.06 194.5H412.06H419.56L422.06 192.5L425.56 192L427.06 188L430.06 186.5L434.06 180L440.06 176.5L444.56 174L446.56 168.5L449.06 162L452.06 151L454.06 148.5V138.5L456.56 126.5V125Z"
        fill={territoryFills['e11'] || ORIGINAL_FILLS['e11']}
        stroke={territoryStrokes['e11']?.color || 'black'}
        strokeWidth={territoryStrokes['e11']?.width || 1}
        className="cursor-pointer transition-colors duration-200 hover:brightness-125"
        filter={selectedTerritory === 'e11' ? 'url(#eglow)' : undefined}
        onClick={() => onTerritoryClick('e11')}
        onMouseEnter={() => onTerritoryHover('e11')}
        onMouseLeave={() => onTerritoryHover(null)}
      />
      <path
        data-territory="e12"
        d="M474.06 390V393C473.727 393.167 472.96 393.7 472.56 394.5C472.16 395.3 472.394 396.833 472.56 397.5C474.394 398.333 478.16 400.4 478.56 402C478.96 403.6 479.394 405.667 479.56 406.5L484.56 402L489.06 399L501.06 391.5H507.06C513.56 387.167 527.16 379.2 529.56 382L545.56 379L549.06 382V388C549.06 389.6 546.727 392 545.56 393V400.5L557.06 402.5H563.56L569.06 406H582.56L587.56 402.5C590.36 400.1 592.727 395.5 593.56 393.5L590.56 389.5L586.06 386.5L585.06 382.5L580.56 379L577.56 378L578.06 370.5L563.56 357.5L549.06 345.5L546.56 333.5H528.06L515.56 335.5H503.06L486.56 341.5H481.06L479.56 343L478.56 346.5L470.56 349L472.56 353.5L470.06 359L469.06 368.5L472.06 373V378L476.06 385.5L474.06 390Z"
        fill={territoryFills['e12'] || ORIGINAL_FILLS['e12']}
        stroke={territoryStrokes['e12']?.color || 'black'}
        strokeWidth={territoryStrokes['e12']?.width || 1}
        className="cursor-pointer transition-colors duration-200 hover:brightness-125"
        filter={selectedTerritory === 'e12' ? 'url(#eglow)' : undefined}
        onClick={() => onTerritoryClick('e12')}
        onMouseEnter={() => onTerritoryHover('e12')}
        onMouseLeave={() => onTerritoryHover(null)}
      />
      <path
        data-territory="e13"
        d="M545.56 400.5L538.06 406.5H526.06L525.06 418.5L529.56 431.5L534.56 441.5L545.56 440.5L550.56 438.5L559.56 445.5H572.06L575.56 442.5L579.56 441.5L580.56 434C582.394 432.167 585.36 427.6 582.56 424C579.76 420.4 582.06 420.5 583.56 421L587.56 417.5V414L591.06 411L590.56 406C588.394 405.833 584.76 404.9 587.56 402.5L582.56 406H569.06L563.56 402.5H557.06L545.56 400.5Z"
        fill={territoryFills['e13'] || ORIGINAL_FILLS['e13']}
        stroke={territoryStrokes['e13']?.color || 'black'}
        strokeWidth={territoryStrokes['e13']?.width || 1}
        className="cursor-pointer transition-colors duration-200 hover:brightness-125"
        filter={selectedTerritory === 'e13' ? 'url(#eglow)' : undefined}
        onClick={() => onTerritoryClick('e13')}
        onMouseEnter={() => onTerritoryHover('e13')}
        onMouseLeave={() => onTerritoryHover(null)}
      />
      <path
        data-territory="e14"
        d="M700.06 531.5L711.56 535.5L716.56 536.5L720.06 541L724.56 544.5L716.56 552.5V557.5L713.56 560.5V565C713.56 566.2 715.56 568.167 716.56 569L740.56 557.5L745.56 559L753.06 556.5V552.5C753.227 551.833 754.26 550.3 757.06 549.5C759.86 548.7 766.227 545.833 769.06 544.5C768.727 542.167 768.46 537.5 770.06 537.5C771.66 537.5 773.394 536.833 774.06 536.5L772.06 541L775.56 543L778.56 544.5L783.06 537.5L793.06 532.5H799.56L803.06 531.5L797.06 527.5L796.06 523L793.56 518.5V509L805.56 498.5L813.56 494.5L822.56 488L825.06 486.5L827.56 484L826.56 480.5H824.06L821.56 474.5L819.56 471V465.5L814.56 462L815.56 456.5L812.56 452.5L807.56 450.5L805.06 449C805.227 447 805.46 442.6 805.06 441C804.66 439.4 803.56 437.667 803.06 437C801.394 437.5 797.96 438.5 797.56 438.5C797.16 438.5 794.727 437.5 793.56 437L793.06 434L795.06 429L796.56 424H799.56V420L793.56 416.5H791.06L785.56 413.5H778.56L777.56 410L775.56 405.5C775.727 403.667 776.06 399.9 776.06 399.5C776.06 399.1 775.06 396.667 774.56 395.5L770.56 395L766.06 394.5V391.5L764.56 388.5L768.06 385L777.56 374L782.06 371L781.06 366.5L783.56 364.5V361.5L774.06 353C772.06 349.667 768.06 342.8 768.06 342V340L770.06 337L770.56 333L768.06 330V325L767.06 318L768.06 313L772.06 309.5V299.5L770.06 298.5L768.06 294L765.06 291L763.56 288.5L757.31 286.25L751.06 287L742.06 290.5L737.56 297V305L736.56 317L729.56 325L728.56 336.5L719.06 344L706.06 348L693.06 360.5L676.56 369L661.06 364.5L657.56 365L652.06 370.5H646.06L631.56 383.5L626.56 392L618.56 401L598.06 415L587.56 417.5L583.56 421C582.06 420.5 579.76 420.4 582.56 424C585.36 427.6 582.394 432.167 580.56 434L579.56 441.5H601.06L611.06 438.5L613.56 435.5L618.06 436C620.06 437.167 624.06 440.3 624.06 443.5C624.06 446.7 620.394 447.5 618.56 447.5V452.5L616.56 456L618.06 459L609.56 468L613.56 472V481.5C613.06 481.333 611.86 481.1 611.06 481.5C610.26 481.9 610.727 484.333 611.06 485.5L612.06 495.5L615.56 501V505.5L622.06 511L627.06 517.5L647.56 529H663.56L669.56 533.5L675.06 535.5L676.56 532.5C676.96 531.7 680.394 532.167 682.06 532.5L688.06 533.5L692.56 537.25L700.06 531.5Z"
        fill={territoryFills['e14'] || ORIGINAL_FILLS['e14']}
        stroke={territoryStrokes['e14']?.color || 'black'}
        strokeWidth={territoryStrokes['e14']?.width || 1}
        className="cursor-pointer transition-colors duration-200 hover:brightness-125"
        filter={selectedTerritory === 'e14' ? 'url(#eglow)' : undefined}
        onClick={() => onTerritoryClick('e14')}
        onMouseEnter={() => onTerritoryHover('e14')}
        onMouseLeave={() => onTerritoryHover(null)}
      />
      <path
        data-territory="e15"
        d="M534.56 441.5L532.56 447.5L528.06 455C527.394 456.833 526.06 460.8 526.06 462C526.06 463.2 522.06 471.167 520.06 475H510.06L503.06 477L497.56 470L492.06 468L484.56 467L472.56 465.5L467.56 467V485.5L482.06 502L486.56 507L489.06 512.5V513.5L496.06 516H503.06L508.56 513.5H520.06C525.894 514.333 537.76 516 538.56 516C539.36 516 544.227 515 546.56 514.5L558.56 516L568.06 514.5L579.56 511L587.56 508L596.56 509.5L604.56 506.5L609.56 509.5L615.56 505.5V501L612.06 495.5L611.06 485.5C610.727 484.333 610.26 481.9 611.06 481.5C611.86 481.1 613.06 481.333 613.56 481.5V472L609.56 468L618.06 459L616.56 456L618.56 452.5V447.5C620.394 447.5 624.06 446.7 624.06 443.5C624.06 440.3 620.06 437.167 618.06 436L613.56 435.5L611.06 438.5L601.06 441.5H579.56L575.56 442.5L572.06 445.5H559.56L550.56 438.5L545.56 440.5L534.56 441.5Z"
        fill={territoryFills['e15'] || ORIGINAL_FILLS['e15']}
        stroke={territoryStrokes['e15']?.color || 'black'}
        strokeWidth={territoryStrokes['e15']?.width || 1}
        className="cursor-pointer transition-colors duration-200 hover:brightness-125"
        filter={selectedTerritory === 'e15' ? 'url(#eglow)' : undefined}
        onClick={() => onTerritoryClick('e15')}
        onMouseEnter={() => onTerritoryHover('e15')}
        onMouseLeave={() => onTerritoryHover(null)}
      />
      <path
        data-territory="e16"
        d="M489.06 518.5L496.06 519.5L500.06 523.5L508.56 525.5L520.06 538.5L528.06 539.5L532.56 548L529.56 554L528.06 561.5L530.56 570.5L549.06 572L552.56 570.5L554.56 574L569.56 578L576.56 584.5V590.5L583.56 601.5L593.56 606H605.06L615.56 616L638.06 606L643.56 590.5L642.06 584.5L645.56 580L643.56 569L645.56 566.5H649.06L653.56 567.5V570.5L657.56 575V578H661.06L663.06 574L666.06 569L667.56 565L670.06 557.5L675.56 556.5L682.06 549.5L685.06 543L692.56 537.25L688.06 533.5L682.06 532.5C680.394 532.167 676.96 531.7 676.56 532.5L675.06 535.5L669.56 533.5L663.56 529H647.56L627.06 517.5L622.06 511L615.56 505.5L609.56 509.5L604.56 506.5L596.56 509.5L587.56 508L579.56 511L568.06 514.5L558.56 516L546.56 514.5C544.227 515 539.36 516 538.56 516C537.76 516 525.894 514.333 520.06 513.5H508.56L503.06 516H496.06L489.06 513.5V518.5Z"
        fill={territoryFills['e16'] || ORIGINAL_FILLS['e16']}
        stroke={territoryStrokes['e16']?.color || 'black'}
        strokeWidth={territoryStrokes['e16']?.width || 1}
        className="cursor-pointer transition-colors duration-200 hover:brightness-125"
        filter={selectedTerritory === 'e16' ? 'url(#eglow)' : undefined}
        onClick={() => onTerritoryClick('e16')}
        onMouseEnter={() => onTerritoryHover('e16')}
        onMouseLeave={() => onTerritoryHover(null)}
      />
      <path
        data-territory="e17"
        d="M273.06 439.5C273.86 439.1 282.227 439.083 286.06 439.25L292.56 429.75L300.06 422.25L308.06 425.25H320.56L327.56 422.25L339.06 418.25L336.06 426.75L337.06 438.25H343.56L363.06 425.25L376.06 427.75L384.56 438.75H388.06L391.06 435.25L405.06 430L413.56 434.5C414.394 437.333 415.56 443 413.56 443C411.06 443 411.56 450 415.56 450C418.76 450 421.56 446.333 422.56 444.5L424.06 440L426.56 435.5L429.56 430L434.56 428C438.227 423.333 446.06 414.3 448.06 415.5C450.06 416.7 449.56 412 449.06 409.5L469.06 393L474.06 390L476.06 385.5L472.06 378V373L469.06 368.5L470.06 359L472.56 353.5L470.56 349L464.56 345.5L450.56 348L444.06 353H438.56L435.06 350.5H424.06L422.06 353H415.56C413.56 352.167 409.46 350.5 409.06 350.5C408.56 350.5 400.56 351 399.06 352C397.86 352.8 396.56 355 396.06 356L391.56 354L384.56 356L380.06 358L377.06 362.5L366.56 368C365.894 367.5 364.46 366.4 364.06 366C363.66 365.6 358.894 367.167 356.56 368C356.56 369 355.86 370.7 353.06 369.5C350.26 368.3 347.894 368 347.06 368L342.06 362.5L334.06 359.5L330.06 356L328.06 352L318.06 353L315.06 354L306.56 356L285.06 336L278.56 335L277.06 337L273.06 336L269.56 335L259.56 341.5V359.5L257.56 361V367C257.56 367.8 255.56 370 254.56 371V374.5L262.06 378.5L264.06 386.5L270.56 394.5V399.5L274.56 402.5L277.06 416V430L273.06 439.5Z"
        fill={territoryFills['e17'] || ORIGINAL_FILLS['e17']}
        stroke={territoryStrokes['e17']?.color || 'black'}
        strokeWidth={territoryStrokes['e17']?.width || 1}
        className="cursor-pointer transition-colors duration-200 hover:brightness-125"
        filter={selectedTerritory === 'e17' ? 'url(#eglow)' : undefined}
        onClick={() => onTerritoryClick('e17')}
        onMouseEnter={() => onTerritoryHover('e17')}
        onMouseLeave={() => onTerritoryHover(null)}
      />
      <path
        data-territory="e18"
        d="M286.06 439.25L294.06 432.25H302.56V445.25C303.227 447.417 305.26 452.45 308.06 455.25C310.86 458.05 309.227 462.417 308.06 464.25L310.56 468.25H318.56V471.75V475.25C318.56 476.45 315.894 480.083 314.56 481.75L312.56 483.25L308.06 480.75L304.56 483.25L302.56 486.25V493.75C302.56 494.95 297.894 501.25 295.56 504.25H291.56L289.06 509.25L284.06 511.25V515.25L289.06 520.75V526.25L294.06 528.75L300.06 526.25L302.56 520.75L308.06 517.25L310.56 520.75H314.56C314.394 522.583 314.16 526.25 314.56 526.25C315.06 526.25 317.06 527.75 318.56 528.75C320.06 529.75 319.56 531.25 320.56 533.75C321.56 536.25 325.06 538.25 326.56 541.75C328.06 545.25 331.06 546.25 334.56 545.25C337.36 544.45 339.06 541.25 339.56 539.75L339.06 533.75L339.56 523.25L343.06 522.25L347.56 515.25V506.75L361.56 486.75L362.56 471.75L368.06 462.75L384.56 461.75L383.06 458.25L384.56 455.75L393.56 452H398.56V445L391.56 440L391.06 435.25L388.06 438.75H384.56L376.06 427.75L363.06 425.25L343.56 438.25H337.06L336.06 426.75L339.06 418.25L327.56 422.25L320.56 425.25H308.06L300.06 422.25L292.56 429.75L286.06 439.25Z"
        fill={territoryFills['e18'] || ORIGINAL_FILLS['e18']}
        stroke={territoryStrokes['e18']?.color || 'black'}
        strokeWidth={territoryStrokes['e18']?.width || 1}
        className="cursor-pointer transition-colors duration-200 hover:brightness-125"
        filter={selectedTerritory === 'e18' ? 'url(#eglow)' : undefined}
        onClick={() => onTerritoryClick('e18')}
        onMouseEnter={() => onTerritoryHover('e18')}
        onMouseLeave={() => onTerritoryHover(null)}
      />
      <path
        data-territory="e19"
        d="M339.56 539.75L347.06 537L353.56 536.5C354.894 537 358.26 538.4 361.06 540C364.56 542 374.06 542.5 372.06 550.5C370.46 556.9 375.06 553.5 377.56 551C378.727 548.667 381.66 544.4 384.06 546C387.06 548 391.06 555.5 391.56 559.5C391.96 562.7 397.394 562.833 400.06 562.5C402.06 561.333 406.16 558.5 406.56 556.5C406.96 554.5 407.727 533 408.06 522.5L404.06 518.5L402.56 506.5L404.06 496.5L413.56 495V492.5L411.06 487L406.56 485L397.56 479.5L393.06 481C391.894 480 389.36 477.9 388.56 477.5C387.76 477.1 383.227 477.333 381.06 477.5L382.56 470L384.56 461.75L368.06 462.75L362.56 471.75L361.56 486.75L347.56 506.75V515.25L343.06 522.25L339.56 523.25L339.06 533.75L339.56 539.75Z"
        fill={territoryFills['e19'] || ORIGINAL_FILLS['e19']}
        stroke={territoryStrokes['e19']?.color || 'black'}
        strokeWidth={territoryStrokes['e19']?.width || 1}
        className="cursor-pointer transition-colors duration-200 hover:brightness-125"
        filter={selectedTerritory === 'e19' ? 'url(#eglow)' : undefined}
        onClick={() => onTerritoryClick('e19')}
        onMouseEnter={() => onTerritoryHover('e19')}
        onMouseLeave={() => onTerritoryHover(null)}
      />
      <path
        data-territory="e20"
        d="M401.56 570.5L396.56 571L395.56 575L388.56 580.5L386.56 585.5L384.06 587L383.56 598.5L381.06 605.5L383.06 611.5L386.56 612.5L388.56 621.5L392.06 624L396.56 620L397.56 615.5L396.56 611L394.56 609L397.56 605.5L399.56 601V596.5L397.06 593L400.06 588.5L401.56 584.5L401.06 581.5L400.06 578L404.06 574.5L401.56 570.5Z"
        fill={territoryFills['e20'] || ORIGINAL_FILLS['e20']}
        stroke={territoryStrokes['e20']?.color || 'black'}
        strokeWidth={territoryStrokes['e20']?.width || 1}
        className="cursor-pointer transition-colors duration-200 hover:brightness-125"
        filter={selectedTerritory === 'e20' ? 'url(#eglow)' : undefined}
        onClick={() => onTerritoryClick('e20')}
        onMouseEnter={() => onTerritoryHover('e20')}
        onMouseLeave={() => onTerritoryHover(null)}
      />
      <path
        data-territory="e21"
        d="M362.06 570.5L360.56 578L362.06 584.5L357.06 592.5L355.56 589L358.06 582V574C358.06 573.2 354.727 570 353.06 568.5L347.56 569.5L342.56 573L338.56 576L332.56 577H328.06C327.66 577 326.227 585 325.56 589L328.06 593.5L324.56 595L321.56 606L319.56 609L320.56 617V636L335.06 647.5L345.56 650.5L354.56 644L358.06 648L365.06 651.5C366.227 649.667 368.66 645.9 369.06 645.5C369.56 645 372.06 640 371.06 639.5C370.26 639.1 367.394 637.333 366.06 636.5L364.06 638L358.56 635L355.56 627C355.727 625.5 356.06 622.3 356.06 621.5C356.06 620.7 357.394 616.5 358.06 614.5H362.06L365.06 607L365.56 596.5L364.06 592.5L367.06 589L368.06 579.5L366.06 578L366.56 574.5L368.06 570.5H362.06Z"
        fill={territoryFills['e21'] || ORIGINAL_FILLS['e21']}
        stroke={territoryStrokes['e21']?.color || 'black'}
        strokeWidth={territoryStrokes['e21']?.width || 1}
        className="cursor-pointer transition-colors duration-200 hover:brightness-125"
        filter={selectedTerritory === 'e21' ? 'url(#eglow)' : undefined}
        onClick={() => onTerritoryClick('e21')}
        onMouseEnter={() => onTerritoryHover('e21')}
        onMouseLeave={() => onTerritoryHover(null)}
      />
      <path
        data-territory="e22"
        d="M320.06 587L313.56 593.5H308.06V596L303.56 597V602L295.56 610L288.56 608.5V602C287.227 601 284.56 598.8 284.56 598C284.56 597.2 283.227 590.333 282.56 587L284.56 582.5L286.56 577V567L284.56 563.5V558.5L291.06 552.5L299.56 545.5H303.56L310.56 547.5L312.06 558.5H320.06V563.5L318.06 567V571L317.06 574.5L318.06 581.5L320.06 587Z"
        fill={territoryFills['e22'] || ORIGINAL_FILLS['e22']}
        stroke={territoryStrokes['e22']?.color || 'black'}
        strokeWidth={territoryStrokes['e22']?.width || 1}
        className="cursor-pointer transition-colors duration-200 hover:brightness-125"
        filter={selectedTerritory === 'e22' ? 'url(#eglow)' : undefined}
        onClick={() => onTerritoryClick('e22')}
        onMouseEnter={() => onTerritoryHover('e22')}
        onMouseLeave={() => onTerritoryHover(null)}
      />
      <path
        data-territory="e23"
        d="M314.06 600L313.56 604.5H312.06V608.5L308.06 611L305.56 610L307.06 605C306.56 604.167 305.56 602.4 305.56 602C305.56 601.6 308.894 599.833 310.56 599L314.06 600Z"
        fill={territoryFills['e23'] || ORIGINAL_FILLS['e23']}
        stroke={territoryStrokes['e23']?.color || 'black'}
        strokeWidth={territoryStrokes['e23']?.width || 1}
        className="cursor-pointer transition-colors duration-200 hover:brightness-125"
        filter={selectedTerritory === 'e23' ? 'url(#eglow)' : undefined}
        onClick={() => onTerritoryClick('e23')}
        onMouseEnter={() => onTerritoryHover('e23')}
        onMouseLeave={() => onTerritoryHover(null)}
      />
      <path
        data-territory="e24"
        d="M288.56 626.5C287.894 624 287.26 618.9 290.06 618.5C292.86 618.1 291.227 616 290.06 615L285.56 610H282.56L279.06 605L278.06 607.5L279.06 612L281.06 613L285.56 618.5L283.56 623L284.56 626.5L287.56 628.5L288.56 626.5Z"
        fill={territoryFills['e24'] || ORIGINAL_FILLS['e24']}
        stroke={territoryStrokes['e24']?.color || 'black'}
        strokeWidth={territoryStrokes['e24']?.width || 1}
        className="cursor-pointer transition-colors duration-200 hover:brightness-125"
        filter={selectedTerritory === 'e24' ? 'url(#eglow)' : undefined}
        onClick={() => onTerritoryClick('e24')}
        onMouseEnter={() => onTerritoryHover('e24')}
        onMouseLeave={() => onTerritoryHover(null)}
      />
      <path
        data-territory="e25"
        d="M282.06 561L277.56 564L276.06 561L277.56 555.5L274.56 551.5L277.56 549L274.56 546.5L276.56 537.5L281.06 532H282.56L283.06 539.5L280.56 542.5L280.06 545.5L282.06 542.5L283.56 543L284.56 547.5V552.5L282.06 554L281.06 558.5L282.06 561Z"
        fill={territoryFills['e25'] || ORIGINAL_FILLS['e25']}
        stroke={territoryStrokes['e25']?.color || 'black'}
        strokeWidth={territoryStrokes['e25']?.width || 1}
        className="cursor-pointer transition-colors duration-200 hover:brightness-125"
        filter={selectedTerritory === 'e25' ? 'url(#eglow)' : undefined}
        onClick={() => onTerritoryClick('e25')}
        onMouseEnter={() => onTerritoryHover('e25')}
        onMouseLeave={() => onTerritoryHover(null)}
      />
      <path
        data-territory="e26"
        d="M278.56 335L280.56 330.5L283.56 328.5V320L285.06 317L283.56 311L285.06 305H267.56L253.56 313.5L250.06 309.5L238.06 303.5L234.06 300L230.56 291.5L218.56 286L201.56 295L194.56 298.5L190.06 302.5L186.56 313.5L182.56 317V323L184.56 325L182.56 327.5V330.5L185.56 332L184.56 336L182.06 338.5V341.5L178.06 343L176.56 348.5L178.06 351.5L182.06 352.5L181.56 355.5L174.56 358.5L174.06 361.5L178.06 364.5L175.06 368V374L174.06 380.5L174.56 385.5L179.56 387.5L182.56 390L183.56 392.5L178.06 399.5L183.56 405L185.06 410C184.06 411 181.26 412.3 178.06 409.5L182.56 421L185.06 425L186.56 418.5L190.06 414.5H197.56L205.06 416L211.06 418.5L214.06 413.5L225.06 410L234.06 400.5H242.56V394.5L248.56 390.5L257.56 386.5H264.06L262.06 378.5L254.56 374.5V371C255.56 370 257.56 367.8 257.56 367V361L259.56 359.5V341.5L269.56 335L273.06 336L277.06 337L278.56 335Z"
        fill={territoryFills['e26'] || ORIGINAL_FILLS['e26']}
        stroke={territoryStrokes['e26']?.color || 'black'}
        strokeWidth={territoryStrokes['e26']?.width || 1}
        className="cursor-pointer transition-colors duration-200 hover:brightness-125"
        filter={selectedTerritory === 'e26' ? 'url(#eglow)' : undefined}
        onClick={() => onTerritoryClick('e26')}
        onMouseEnter={() => onTerritoryHover('e26')}
        onMouseLeave={() => onTerritoryHover(null)}
      />
      <path
        data-territory="e27"
        d="M80.5603 319C81.7603 320.2 84.3936 322.167 85.5603 323C81.5603 327.333 75.4603 332.1 77.0603 332.5C78.6603 332.9 70.0603 335.5 81.5603 339.5L85.5603 349.5L80.5603 357L73.5603 362L70.5603 368.5L72.0603 371.5L78.0603 374L87.0603 377.5L95.0603 380L101.56 381.5L106.06 380.5H110.06L112.56 381.5V382.5L114.06 383.5L117.06 384.5L117.56 386L114.56 387.5L112.06 390L118.06 389L120.56 393.5L124.56 396L131.06 400.5L149.06 402.5L153.56 400.5H163.06L170.56 405H174.06L177.06 409.064C177.175 408.886 177.489 409 178.06 409.5C181.26 412.3 184.06 411 185.06 410L183.56 405L178.06 399.5L183.56 392.5L182.56 390L179.56 387.5L174.56 385.5L174.06 380.5L175.06 374V368L178.06 364.5L174.06 361.5L174.56 358.5L181.56 355.5L182.06 352.5L178.06 351.5L176.56 348.5L178.06 343H174.06L172.56 339L169.06 338L165.06 338.5V342.5H161.56L158.06 338H144.56L139.56 336L136.06 328.5L126.56 323L120.56 319L115.56 311H107.56L103.56 307.5H95.0603L93.0603 306C92.0603 307.667 89.4603 311 87.0603 311C84.6603 311 81.727 316.333 80.5603 319Z"
        fill={territoryFills['e27'] || ORIGINAL_FILLS['e27']}
        stroke={territoryStrokes['e27']?.color || 'black'}
        strokeWidth={territoryStrokes['e27']?.width || 1}
        className="cursor-pointer transition-colors duration-200 hover:brightness-125"
        filter={selectedTerritory === 'e27' ? 'url(#eglow)' : undefined}
        onClick={() => onTerritoryClick('e27')}
        onMouseEnter={() => onTerritoryHover('e27')}
        onMouseLeave={() => onTerritoryHover(null)}
      />
      <path
        data-territory="e28"
        d="M70.5603 368.5L65.0603 370L59.5603 367V363.5L54.5603 359.5H45.0603L40.0603 362L35.0603 365H30.5603L28.0603 370L22.5603 365L17.5603 362L14.5603 365L9.0603 367V373L5.0603 377.5V380.5L7.5603 388.5L12.5603 390V396L5.0603 401.5L2.0603 408.5V413L7.5603 408.5L11.0603 405L14.5603 403.5L22.5603 401.5L24.0603 407.5C25.227 408.667 27.8603 411.2 29.0603 412C30.5603 413 29.0603 415 29.0603 416.5C31.5603 418 34.0603 416.5 37.0603 416.5C40.0603 416.5 40.0603 415 42.5603 416.5C44.5603 417.7 45.0603 419.667 45.0603 420.5L54.5603 425L56.0603 419.5L59.5603 417.5L67.0603 416.5L79.0603 416L90.5603 409.5L93.0603 402.5L105.56 397.5H107.56L112.06 390L114.56 387.5L117.56 386L117.06 384.5L114.06 383.5L112.56 382.5V381.5L110.06 380.5H106.06L101.56 381.5L95.0603 380L87.0603 377.5L78.0603 374L72.0603 371.5L70.5603 368.5Z"
        fill={territoryFills['e28'] || ORIGINAL_FILLS['e28']}
        stroke={territoryStrokes['e28']?.color || 'black'}
        strokeWidth={territoryStrokes['e28']?.width || 1}
        className="cursor-pointer transition-colors duration-200 hover:brightness-125"
        filter={selectedTerritory === 'e28' ? 'url(#eglow)' : undefined}
        onClick={() => onTerritoryClick('e28')}
        onMouseEnter={() => onTerritoryHover('e28')}
        onMouseLeave={() => onTerritoryHover(null)}
      />
      <path
        data-territory="e29"
        d="M54.5603 425L57.0603 429.5L65.5603 438L77.5603 439L80.0603 444.5L90.5603 442L101.56 448.5V454.5L108.56 459L115.56 454.5L123.06 453C126.06 452.667 132.26 451.9 133.06 451.5C133.86 451.1 139.394 449.667 142.06 449L152.56 450L148.06 455.5L149.06 458C150.727 458.667 154.26 459.9 155.06 459.5C155.86 459.1 158.727 459 160.06 459L163.06 462C164.56 462 167.76 462.2 168.56 463L174.06 468.5C175.06 470 177.26 473.1 178.06 473.5C178.86 473.9 182.727 478.667 184.56 481H192.56L198.06 486.5L210.06 481L205.06 468.5L210.06 461L207.06 450L199.56 445.5L197.56 434.5L192.56 431.5L185.06 425L182.56 421C180.233 416.893 176.533 409.883 177.06 409.064L174.06 405H170.56L163.06 400.5H153.56L149.06 402.5L131.06 400.5L124.56 396L120.56 393.5L118.06 389L112.06 390L107.56 397.5H105.56L93.0603 402.5L90.5603 409.5L79.0603 416L67.0603 416.5L59.5603 417.5L56.0603 419.5L54.5603 425Z"
        fill={territoryFills['e29'] || ORIGINAL_FILLS['e29']}
        stroke={territoryStrokes['e29']?.color || 'black'}
        strokeWidth={territoryStrokes['e29']?.width || 1}
        className="cursor-pointer transition-colors duration-200 hover:brightness-125"
        filter={selectedTerritory === 'e29' ? 'url(#eglow)' : undefined}
        onClick={() => onTerritoryClick('e29')}
        onMouseEnter={() => onTerritoryHover('e29')}
        onMouseLeave={() => onTerritoryHover(null)}
      />
      <path
        data-territory="e30"
        d="M210.06 481H219.06V464.5H223.56L229.56 467H238.56C240.56 467 243.56 463 245.06 463C246.26 463 255.227 454.333 259.56 450C261.56 449.167 265.76 447.1 266.56 445.5C267.56 443.5 272.06 440 273.06 439.5L277.06 430V416L274.56 402.5L270.56 399.5V394.5L264.06 386.5H257.56L248.56 390.5L242.56 394.5V400.5H234.06L225.06 410L214.06 413.5L211.06 418.5L205.06 416L197.56 414.5H190.06L186.56 418.5L185.06 425L192.56 431.5L197.56 434.5L199.56 445.5L207.06 450L210.06 461L205.06 468.5L210.06 481Z"
        fill={territoryFills['e30'] || ORIGINAL_FILLS['e30']}
        stroke={territoryStrokes['e30']?.color || 'black'}
        strokeWidth={territoryStrokes['e30']?.width || 1}
        className="cursor-pointer transition-colors duration-200 hover:brightness-125"
        filter={selectedTerritory === 'e30' ? 'url(#eglow)' : undefined}
        onClick={() => onTerritoryClick('e30')}
        onMouseEnter={() => onTerritoryHover('e30')}
        onMouseLeave={() => onTerritoryHover(null)}
      />
      <path
        data-territory="e31"
        d="M55.0603 467C52.8936 468.5 47.6603 469.9 46.0603 465.5C44.4603 461.1 43.3936 460.333 43.0603 460.5L39.0603 465.5L36.0603 468.5V470L32.0603 471L27.5603 474.5L25.0603 473.5H20.5603L15.0603 471L10.0603 468.5L5.5603 469V475.5L8.5603 479.5L7.5603 481.5L5.5603 483V486L8.5603 489V492.5L9.5603 495.5L15.5603 495L20.5603 490L18.5603 487L21.5603 484.5L25.0603 486L30.5603 483L37.5603 480.5L44.5603 475.5L50.0603 473.5L55.0603 467Z"
        fill={territoryFills['e31'] || ORIGINAL_FILLS['e31']}
        stroke={territoryStrokes['e31']?.color || 'black'}
        strokeWidth={territoryStrokes['e31']?.width || 1}
        className="cursor-pointer transition-colors duration-200 hover:brightness-125"
        filter={selectedTerritory === 'e31' ? 'url(#eglow)' : undefined}
        onClick={() => onTerritoryClick('e31')}
        onMouseEnter={() => onTerritoryHover('e31')}
        onMouseLeave={() => onTerritoryHover(null)}
      />
      <path
        data-territory="e32"
        d="M308.06 118C306.56 117.167 303.16 116 301.56 118C299.96 120 298.56 121.833 298.06 122.5L294.56 120.5L289.06 125C284.727 125.667 275.36 128.4 272.56 134C272.56 135.6 270.56 142 269.56 145L262.56 146.5L251.56 158L248.56 166C247.727 164.667 245.56 162.2 243.56 163C241.06 164 238.56 156.5 234.56 156.5C231.36 156.5 228.894 152.167 228.06 150L227.06 144L223.06 141.5C221.394 143.5 217.56 147.5 215.56 147.5C213.06 147.5 206.56 146.5 206.56 147.5C206.56 148.5 202.06 154.5 199.06 155C196.06 155.5 187.56 156.321 187.06 155.5C190.06 160.5 190.56 176 195.06 177.5C195.06 180 200.06 191.5 206.56 192V201L210.56 203.5V210L217.06 214V222.5C215.06 224.167 211.46 228.5 213.06 232.5C211.06 235.3 212.227 243.333 213.06 247L207.56 254.5L208.56 269.5L215.06 274.5L218.56 286L230.56 291.5L234.06 300L238.06 303.5L250.06 309.5L253.56 313.5L267.56 305H285.06L290.06 301.5V299L293.06 291L299.06 283V273L310.56 251L312.56 243.5L314.56 239.5L316.56 225L322.06 217L336.06 208L338.56 203.5L339.56 201V189L340.56 185.5L341.06 180.5L339.56 169.5L340.56 164.5L339.56 158.5L338.56 152V147.5L327.56 136.5H322.56L311.56 127H308.06L306.06 123L308.06 118Z"
        fill={territoryFills['e32'] || ORIGINAL_FILLS['e32']}
        stroke={territoryStrokes['e32']?.color || 'black'}
        strokeWidth={territoryStrokes['e32']?.width || 1}
        className="cursor-pointer transition-colors duration-200 hover:brightness-125"
        filter={selectedTerritory === 'e32' ? 'url(#eglow)' : undefined}
        onClick={() => onTerritoryClick('e32')}
        onMouseEnter={() => onTerritoryHover('e32')}
        onMouseLeave={() => onTerritoryHover(null)}
      />
      <path
        data-territory="e33"
        d="M201.56 295L218.56 286L215.06 274.5L208.56 269.5L207.56 254.5L213.06 247L162.06 225.5H152.06C152.727 222.833 153.06 217.4 149.06 217C144.06 216.5 142.06 212.5 141.06 209C140.06 205.5 134.06 208 131.56 203.5C129.084 199.042 117.285 202.926 113.661 201.055C113.596 201.166 113.56 201.154 113.56 201C113.56 199.4 100.894 190 94.5603 185.5H85.0603C82.5603 185.5 79.5603 194 77.0603 199C75.0603 203 68.8936 200.667 66.0603 199C70.0603 207 75.5603 205.5 77.0603 205.5C79.4603 214.7 85.0603 215.667 87.5603 215C89.5603 222 97.5603 222.5 100.06 222.5C103.56 231 112.56 232.5 115.56 232.5C115.56 236.9 121.894 243 125.06 245.5C124.66 253.9 136.227 261 142.06 263.5H155.56C156.227 266 159.46 271.1 167.06 271.5C169.06 271.5 171.56 286 176.56 286V293.5L180.06 296V302.5C181.06 305.5 183.76 311.9 186.56 313.5L190.06 302.5L194.56 298.5L201.56 295Z"
        fill={territoryFills['e33'] || ORIGINAL_FILLS['e33']}
        stroke={territoryStrokes['e33']?.color || 'black'}
        strokeWidth={territoryStrokes['e33']?.width || 1}
        className="cursor-pointer transition-colors duration-200 hover:brightness-125"
        filter={selectedTerritory === 'e33' ? 'url(#eglow)' : undefined}
        onClick={() => onTerritoryClick('e33')}
        onMouseEnter={() => onTerritoryHover('e33')}
        onMouseLeave={() => onTerritoryHover(null)}
      />
      <path
        data-territory="e34"
        d="M182.56 317L186.56 313.5C183.76 311.9 181.06 305.5 180.06 302.5V296L176.56 293.5V286C171.56 286 169.06 271.5 167.06 271.5C159.46 271.1 156.227 266 155.56 263.5H142.06C142.56 268 129.56 269.5 126.56 269.5C124.56 274.7 120.394 276 118.56 276L101.56 288.5C101.56 293.3 95.8936 302.167 93.0603 306L95.0603 307.5H103.56L107.56 311H115.56L120.56 319L126.56 323L136.06 328.5L139.56 336L144.56 338H158.06L161.56 342.5H165.06V338.5L169.06 338L172.56 339L174.06 343H178.06L182.06 341.5V338.5L184.56 336L185.56 332L182.56 330.5V327.5L184.56 325L182.56 323V317Z"
        fill={territoryFills['e34'] || ORIGINAL_FILLS['e34']}
        stroke={territoryStrokes['e34']?.color || 'black'}
        strokeWidth={territoryStrokes['e34']?.width || 1}
        className="cursor-pointer transition-colors duration-200 hover:brightness-125"
        filter={selectedTerritory === 'e34' ? 'url(#eglow)' : undefined}
        onClick={() => onTerritoryClick('e34')}
        onMouseEnter={() => onTerritoryHover('e34')}
        onMouseLeave={() => onTerritoryHover(null)}
      />
      <path
        data-territory="e35"
        d="M13.5603 174C12.3603 175.2 11.727 180.833 11.5603 183.5L9.0603 187.5L6.0603 192.5L2.5603 195.5V203L0.560303 205.5L2.5603 211.5L9.0603 216L13.5603 219L16.0603 241C23.227 240.167 38.0603 239.6 40.0603 244C42.5603 249.5 43.0603 260.5 37.0603 261C32.2603 261.4 31.3936 258.833 31.5603 257.5H28.0603L26.0603 249.5L22.5603 251.5V257.5L26.0603 265L37.0603 271.5L48.5603 273.5C51.3936 277.333 55.3603 286.7 48.5603 293.5C46.0603 293.5 36.5603 297 35.0603 302C35.0603 303.2 32.0603 304.5 30.5603 305L28.0603 312L22.5603 314L26.0603 319L22.5603 320.5V324.5L26.0603 326L35.0603 327.5H45.0603L48.5603 335L59.5603 341L72.0603 332L75.5603 326C75.227 323.167 75.7603 317.8 80.5603 319C81.727 316.333 84.6603 311 87.0603 311C89.4603 311 92.0603 307.667 93.0603 306C95.8936 302.167 101.56 293.3 101.56 288.5L118.56 276C120.394 276 124.56 274.7 126.56 269.5C129.56 269.5 142.56 268 142.06 263.5C136.227 261 124.66 253.9 125.06 245.5C121.894 243 115.56 236.9 115.56 232.5C112.56 232.5 103.56 231 100.06 222.5C97.5603 222.5 89.5603 222 87.5603 215C85.0603 215.667 79.4603 214.7 77.0603 205.5C75.5603 205.5 70.0603 207 66.0603 199C59.727 197.167 45.6603 190.8 40.0603 180C35.8936 178.81 26.5603 174.187 22.5603 165.215C21.1073 168.147 18.3515 171.218 13.5603 174Z"
        fill={territoryFills['e35'] || ORIGINAL_FILLS['e35']}
        stroke={territoryStrokes['e35']?.color || 'black'}
        strokeWidth={territoryStrokes['e35']?.width || 1}
        className="cursor-pointer transition-colors duration-200 hover:brightness-125"
        filter={selectedTerritory === 'e35' ? 'url(#eglow)' : undefined}
        onClick={() => onTerritoryClick('e35')}
        onMouseEnter={() => onTerritoryHover('e35')}
        onMouseLeave={() => onTerritoryHover(null)}
      />
      <path
        data-territory="e36"
        d="M120.101 146.5C120.958 159.754 117.921 175.263 118.56 177.5C119.483 180.731 114.442 199.723 113.661 201.055C117.285 202.926 129.084 199.042 131.56 203.5C134.06 208 140.06 205.5 141.06 209C142.06 212.5 144.06 216.5 149.06 217C153.06 217.4 152.727 222.833 152.06 225.5H162.06L213.06 247C212.227 243.333 211.06 235.3 213.06 232.5C211.46 228.5 215.06 224.167 217.06 222.5V214L210.56 210V203.5L206.56 201V192C200.06 191.5 195.06 180 195.06 177.5C190.56 176 190.06 160.5 187.06 155.5C184.06 150.5 179.56 144 162.06 137C148.06 131.4 128.254 141 120.101 146.5Z"
        fill={territoryFills['e36'] || ORIGINAL_FILLS['e36']}
        stroke={territoryStrokes['e36']?.color || 'black'}
        strokeWidth={territoryStrokes['e36']?.width || 1}
        className="cursor-pointer transition-colors duration-200 hover:brightness-125"
        filter={selectedTerritory === 'e36' ? 'url(#eglow)' : undefined}
        onClick={() => onTerritoryClick('e36')}
        onMouseEnter={() => onTerritoryHover('e36')}
        onMouseLeave={() => onTerritoryHover(null)}
      />
      <path
        data-territory="e37"
        d="M113.56 129L108.56 134L100.06 129C101.894 124.833 105.16 115.6 103.56 112C101.96 108.4 101.56 103.167 101.56 101L97.5603 91.5L100.06 89L95.5603 87L92.5603 82H88.0603L90.5603 75L92.5603 72.5V68.5H88.0603L83.0603 67.5L65.5603 68.5L63.5603 67.5L60.5603 68.5V63.5L61.5603 57H56.5603V52L54.5603 57L53.0603 59.5L50.0603 61L42.5603 56L44.0603 52H38.5603V56L34.5603 57V63.5L36.0603 79L40.0603 83.5L38.5603 85.5L32.5603 82L30.5603 89L36.0603 97L35.0603 104L38.5603 110.5L35.0603 116L36.0603 120L32.5603 126.5V131L35.0603 135.5L30.5603 139V146.5L22.5603 154C23.8898 156.25 24.8679 160.558 22.5603 165.215C26.5603 174.187 35.8936 178.81 40.0603 180C45.6603 190.8 59.727 197.167 66.0603 199C68.8936 200.667 75.0603 203 77.0603 199C79.5603 194 82.5603 185.5 85.0603 185.5H94.5603C100.894 190 113.56 199.4 113.56 201C113.593 201.019 113.627 201.037 113.661 201.055C114.442 199.723 119.483 180.731 118.56 177.5C117.921 175.263 120.958 159.754 120.101 146.5C119.617 139.014 117.892 132.248 113.56 129Z"
        fill={territoryFills['e37'] || ORIGINAL_FILLS['e37']}
        stroke={territoryStrokes['e37']?.color || 'black'}
        strokeWidth={territoryStrokes['e37']?.width || 1}
        className="cursor-pointer transition-colors duration-200 hover:brightness-125"
        filter={selectedTerritory === 'e37' ? 'url(#eglow)' : undefined}
        onClick={() => onTerritoryClick('e37')}
        onMouseEnter={() => onTerritoryHover('e37')}
        onMouseLeave={() => onTerritoryHover(null)}
      />
      <path
        data-territory="e38"
        d="M223.06 141.5C221.727 138.667 219.86 132.2 223.06 129C223.06 128 226.06 134.5 228.06 132.5C229.66 130.9 231.06 119.833 231.56 114.5L223.06 109.5V103L217.06 101L215.56 109.5H210.56C209.894 113.833 207.76 122.5 204.56 122.5C201.36 122.5 207.227 125.167 210.56 126.5L203.06 134L200.56 131L196.06 130L195.06 122.5L186.56 110.5V105.5L179.56 97L168.06 93L159.56 99.5L158.06 103L153.06 101L149.56 105.5L144.06 107.5L137.06 101L134.56 96H122.56L126.56 103.5L131.06 108.5V112H127.56L122.06 118L123.56 125L120.06 130L113.56 129C117.892 132.248 119.617 139.014 120.101 146.5C128.254 141 148.06 131.4 162.06 137C179.56 144 184.06 150.5 187.06 155.5C187.56 156.321 196.06 155.5 199.06 155C202.06 154.5 206.56 148.5 206.56 147.5C206.56 146.5 213.06 147.5 215.56 147.5C217.56 147.5 221.394 143.5 223.06 141.5Z"
        fill={territoryFills['e38'] || ORIGINAL_FILLS['e38']}
        stroke={territoryStrokes['e38']?.color || 'black'}
        strokeWidth={territoryStrokes['e38']?.width || 1}
        className="cursor-pointer transition-colors duration-200 hover:brightness-125"
        filter={selectedTerritory === 'e38' ? 'url(#eglow)' : undefined}
        onClick={() => onTerritoryClick('e38')}
        onMouseEnter={() => onTerritoryHover('e38')}
        onMouseLeave={() => onTerritoryHover(null)}
      />
      <path
        data-territory="e39"
        d="M556.06 626L550.56 626.5L547.06 618L544.06 615H531.56L531.06 617H527.56L526.56 613.5V610L525.56 606V600.5L531.06 594H536.06L537.06 595.5L544.06 595L547.06 592H550.56L553.06 594L554.56 598.5V605.5C555.06 606.167 556.16 607.6 556.56 608C556.96 608.4 557.727 609.5 558.06 610V619.5L556.06 623V626Z"
        fill={territoryFills['e39'] || ORIGINAL_FILLS['e39']}
        stroke={territoryStrokes['e39']?.color || 'black'}
        strokeWidth={territoryStrokes['e39']?.width || 1}
        className="cursor-pointer transition-colors duration-200 hover:brightness-125"
        filter={selectedTerritory === 'e39' ? 'url(#eglow)' : undefined}
        onClick={() => onTerritoryClick('e39')}
        onMouseEnter={() => onTerritoryHover('e39')}
        onMouseLeave={() => onTerritoryHover(null)}
      />
      <path
        d="M812.56 41.9999L820.56 44.9999L825.06 51.4999L829.06 49.9999L834.06 52.4999L841.06 47.9999L842.06 41.9999L855.06 39.4999C856.227 40.3332 859.36 42.3999 862.56 43.9999C866.56 45.9999 870.06 38.4999 871.56 38.4999C873.06 38.4999 883.56 46.4999 886.56 48.9999C888.96 50.9999 899.227 49.8332 904.06 48.9999L924.06 53.9999L935.06 49.9999L942.06 41.9999L942.06 177H937.56L929.06 179.5H918.06C916.894 180.5 914.56 182.9 914.56 184.5C914.56 186.1 907.227 190.5 903.56 192.5C900.727 192.333 892.96 192.3 884.56 193.5C876.16 194.7 861.394 209.333 855.06 216.5M812.56 41.9999C813.727 38.9999 814.96 32.3999 810.56 29.9999C805.06 26.9999 780.06 23.9999 778.56 24.9999C777.36 25.7999 770.727 27.6666 767.56 28.5C766.56 26 764.16 21 762.56 21C760.56 21 761.56 16 759.06 15.5C757.06 15.1 760.56 12.6667 762.56 11.5L763.56 5.5H759.06L755.56 0.5H753.06L751.56 4H746.06C744.894 3.66667 742.26 3.5 741.06 5.5C739.86 7.5 738.56 11.6667 738.06 13.5C740.894 16.6666 745.06 24.3998 739.06 29.9999C738.06 31 731.06 51.5 693.56 56.5C692.36 56.5 685.394 59.8333 682.06 61.5L656.56 63.5C656.227 61.5 654.16 57.6 648.56 58C648.56 56.5 647.06 52 645.56 52C644.06 52 639.56 56 639.06 58C638.56 60 638.06 69.5 639.06 71.5C639.86 73.1 631.06 80.5 626.56 84H620.56L606.56 96.5L595.56 110.5L583.56 116L578.992 109.147M812.56 41.9999L807.06 47.9999H797.06L798.06 55L795.06 60.5L788.06 62.5L783.56 58.5L780.06 62.5L776.06 64.5L772.56 63.5L767.56 64.5L761.56 67V71.5M545.06 131.5H551.06L555.56 137L559.06 135V131.5L562.06 126.5V119L556.56 110.5L551.06 104V94L564.56 89L571.06 98.5L576.06 101.5L578.56 108.5L578.992 109.147M545.06 131.5L540.56 122.5L541.56 118L526.06 110.5L537.56 96.5V92.5L532.06 90.5L518.56 75L514.06 77L504.06 78L495.06 81L486.56 86L485.06 92.5L474.56 106.5V112L466.06 118L456.56 125M545.06 131.5L543.56 132C545.06 141.333 547.76 160.9 546.56 164.5C545.06 169 561.56 189 561.56 195.5C561.56 200.7 558.227 203.667 556.56 204.5H551.06L548.56 207V211.5L555.56 215.5L561.56 220L559.06 223.5V227.5L564.56 231.5V236L571.56 237L563.06 245.5V252L564.56 255.5L561.56 259L552.06 258L544.06 261L537.56 249L526.06 243.5L521.06 245.5L507.56 241.5L506.56 246M456.56 125L447.06 113L442.56 105L436.06 100V84L428.06 72L425.06 62.5L417.06 54.5L408.56 49L405.06 48L398.56 51L392.06 54.5L387.06 56.5L385.06 61.5V65L380.06 70.5L375.06 78L368.56 82L361.06 86H350.56L348.56 89.5V98.5L347.56 102L342.56 103L340.06 105L337.06 101V98.5L330.56 101L325.06 107.5L317.06 113L313.06 118H308.06M456.56 125V126.5L454.06 138.5V148.5L452.06 151L449.06 162L446.56 168.5L444.56 174L440.06 176.5L434.06 180L430.06 186.5L427.06 188L425.56 192L422.06 192.5L419.56 194.5H412.06M308.06 118C306.56 117.167 303.16 116 301.56 118C299.96 120 298.56 121.833 298.06 122.5L294.56 120.5L289.06 125C284.727 125.667 275.36 128.4 272.56 134C272.56 135.6 270.56 142 269.56 145L262.56 146.5L251.56 158L248.56 166C247.727 164.667 245.56 162.2 243.56 163C241.06 164 238.56 156.5 234.56 156.5C231.36 156.5 228.894 152.167 228.06 150L227.06 144L223.06 141.5M308.06 118L306.06 123L308.06 127H311.56L322.56 136.5H327.56L338.56 147.5V152L339.56 158.5L340.56 164.5L339.56 169.5L341.06 180.5L340.56 185.5L339.56 189V201L338.56 203.5L336.06 208M223.06 141.5C221.727 138.667 219.86 132.2 223.06 129C223.06 128 226.06 134.5 228.06 132.5C229.66 130.9 231.06 119.833 231.56 114.5L223.06 109.5V103L217.06 101L215.56 109.5H210.56C209.894 113.833 207.76 122.5 204.56 122.5C201.36 122.5 207.227 125.167 210.56 126.5L203.06 134L200.56 131L196.06 130L195.06 122.5L186.56 110.5V105.5L179.56 97L168.06 93L159.56 99.5L158.06 103L153.06 101L149.56 105.5L144.06 107.5L137.06 101L134.56 96H122.56L126.56 103.5L131.06 108.5V112H127.56L122.06 118L123.56 125L120.06 130L113.56 129M223.06 141.5C221.394 143.5 217.56 147.5 215.56 147.5C213.06 147.5 206.56 146.5 206.56 147.5C206.56 148.5 202.06 154.5 199.06 155C196.06 155.5 187.56 156.321 187.06 155.5M113.56 129L108.56 134L100.06 129C101.894 124.833 105.16 115.6 103.56 112C101.96 108.4 101.56 103.167 101.56 101L97.5603 91.5L100.06 89L95.5603 87L92.5603 82H88.0603L90.5603 75L92.5603 72.5V68.5H88.0603L83.0603 67.5L65.5603 68.5L63.5603 67.5L60.5603 68.5V63.5L61.5603 57H56.5603V52L54.5603 57L53.0603 59.5L50.0603 61L42.5603 56L44.0603 52H38.5603V56L34.5603 57V63.5L36.0603 79L40.0603 83.5L38.5603 85.5L32.5603 82L30.5603 89L36.0603 97L35.0603 104L38.5603 110.5L35.0603 116L36.0603 120L32.5603 126.5V131L35.0603 135.5L30.5603 139V146.5L22.5603 154C23.8898 156.25 24.8679 160.558 22.5603 165.215M113.56 129C117.892 132.248 119.617 139.014 120.101 146.5M80.5603 319C75.7603 317.8 75.227 323.167 75.5603 326L72.0603 332L59.5603 341L48.5603 335L45.0603 327.5H35.0603L26.0603 326L22.5603 324.5V320.5L26.0603 319L22.5603 314L28.0603 312L30.5603 305C32.0603 304.5 35.0603 303.2 35.0603 302C36.5603 297 46.0603 293.5 48.5603 293.5C55.3603 286.7 51.3936 277.333 48.5603 273.5L37.0603 271.5L26.0603 265L22.5603 257.5V251.5L26.0603 249.5L28.0603 257.5H31.5603C31.3936 258.833 32.2603 261.4 37.0603 261C43.0603 260.5 42.5603 249.5 40.0603 244C38.0603 239.6 23.227 240.167 16.0603 241L13.5603 219L9.0603 216L2.5603 211.5L0.560303 205.5L2.5603 203V195.5L6.0603 192.5L9.0603 187.5L11.5603 183.5C11.727 180.833 12.3603 175.2 13.5603 174C18.3515 171.218 21.1073 168.147 22.5603 165.215M80.5603 319C81.7603 320.2 84.3936 322.167 85.5603 323C81.5603 327.333 75.4603 332.1 77.0603 332.5C78.6603 332.9 70.0603 335.5 81.5603 339.5L85.5603 349.5L80.5603 357L73.5603 362L70.5603 368.5M80.5603 319C81.727 316.333 84.6603 311 87.0603 311C89.4603 311 92.0603 307.667 93.0603 306M70.5603 368.5L65.0603 370L59.5603 367V363.5L54.5603 359.5H45.0603L40.0603 362L35.0603 365H30.5603L28.0603 370L22.5603 365L17.5603 362L14.5603 365L9.0603 367V373L5.0603 377.5V380.5L7.5603 388.5L12.5603 390V396L5.0603 401.5L2.0603 408.5V413L7.5603 408.5L11.0603 405L14.5603 403.5L22.5603 401.5L24.0603 407.5C25.227 408.667 27.8603 411.2 29.0603 412C30.5603 413 29.0603 415 29.0603 416.5C31.5603 418 34.0603 416.5 37.0603 416.5C40.0603 416.5 40.0603 415 42.5603 416.5C44.5603 417.7 45.0603 419.667 45.0603 420.5L54.5603 425M70.5603 368.5L72.0603 371.5L78.0603 374L87.0603 377.5L95.0603 380L101.56 381.5L106.06 380.5H110.06L112.56 381.5V382.5L114.06 383.5L117.06 384.5L117.56 386L114.56 387.5L112.06 390M54.5603 425L57.0603 429.5L65.5603 438L77.5603 439L80.0603 444.5L90.5603 442L101.56 448.5V454.5L108.56 459L115.56 454.5L123.06 453C126.06 452.667 132.26 451.9 133.06 451.5C133.86 451.1 139.394 449.667 142.06 449L152.56 450L148.06 455.5L149.06 458C150.727 458.667 154.26 459.9 155.06 459.5C155.86 459.1 158.727 459 160.06 459L163.06 462C164.56 462 167.76 462.2 168.56 463M54.5603 425L56.0603 419.5L59.5603 417.5L67.0603 416.5L79.0603 416L90.5603 409.5L93.0603 402.5L105.56 397.5H107.56L112.06 390M168.56 463C169.36 463.8 172.56 467 174.06 468.5M168.56 463L174.06 468.5M174.06 468.5C175.06 470 177.26 473.1 178.06 473.5C178.86 473.9 182.727 478.667 184.56 481H192.56L198.06 486.5L210.06 481M210.06 481H219.06V464.5H223.56L229.56 467M210.06 481L205.06 468.5L210.06 461L207.06 450L199.56 445.5L197.56 434.5L192.56 431.5L185.06 425M229.56 467C231.894 467 236.96 467 238.56 467M229.56 467H238.56M238.56 467C240.56 467 243.56 463 245.06 463C246.26 463 255.227 454.333 259.56 450C261.56 449.167 265.76 447.1 266.56 445.5C267.56 443.5 272.06 440 273.06 439.5M273.06 439.5C273.86 439.1 282.227 439.083 286.06 439.25M273.06 439.5L277.06 430V416L274.56 402.5L270.56 399.5V394.5L264.06 386.5M286.06 439.25L294.06 432.25H302.56V445.25C303.227 447.417 305.26 452.45 308.06 455.25C310.86 458.05 309.227 462.417 308.06 464.25L310.56 468.25H318.56V471.75M286.06 439.25L292.56 429.75L300.06 422.25L308.06 425.25H320.56L327.56 422.25L339.06 418.25L336.06 426.75L337.06 438.25H343.56L363.06 425.25L376.06 427.75L384.56 438.75H388.06L391.06 435.25M318.56 471.75C318.56 472.417 318.56 474.05 318.56 475.25M318.56 471.75V475.25M318.56 475.25C318.56 476.45 315.894 480.083 314.56 481.75L312.56 483.25L308.06 480.75L304.56 483.25L302.56 486.25M302.56 486.25C302.56 488.25 302.56 492.55 302.56 493.75M302.56 486.25V493.75M302.56 493.75C302.56 494.95 297.894 501.25 295.56 504.25H291.56L289.06 509.25L284.06 511.25V515.25L289.06 520.75V526.25L294.06 528.75L300.06 526.25L302.56 520.75L308.06 517.25L310.56 520.75H314.56C314.394 522.583 314.16 526.25 314.56 526.25C315.06 526.25 317.06 527.75 318.56 528.75C320.06 529.75 319.56 531.25 320.56 533.75C321.56 536.25 325.06 538.25 326.56 541.75C328.06 545.25 331.06 546.25 334.56 545.25C337.36 544.45 339.06 541.25 339.56 539.75M339.56 539.75L347.06 537L353.56 536.5C354.894 537 358.26 538.4 361.06 540C364.56 542 374.06 542.5 372.06 550.5C370.46 556.9 375.06 553.5 377.56 551C378.727 548.667 381.66 544.4 384.06 546C387.06 548 391.06 555.5 391.56 559.5C391.96 562.7 397.394 562.833 400.06 562.5C402.06 561.333 406.16 558.5 406.56 556.5C406.96 554.5 407.727 533 408.06 522.5L404.06 518.5L402.56 506.5L404.06 496.5L413.56 495V492.5L411.06 487L406.56 485L397.56 479.5L393.06 481C391.894 480 389.36 477.9 388.56 477.5C387.76 477.1 383.227 477.333 381.06 477.5L382.56 470L384.56 461.75M339.56 539.75L339.06 533.75L339.56 523.25L343.06 522.25L347.56 515.25V506.75L361.56 486.75L362.56 471.75L368.06 462.75L384.56 461.75M384.56 461.75L383.06 458.25L384.56 455.75L393.56 452H398.56V445L391.56 440L391.06 435.25M391.06 435.25L405.06 430L413.56 434.5C414.394 437.333 415.56 443 413.56 443C411.06 443 411.56 450 415.56 450C418.76 450 421.56 446.333 422.56 444.5L424.06 440L426.56 435.5L429.56 430L434.56 428C438.227 423.333 446.06 414.3 448.06 415.5C450.06 416.7 449.56 412 449.06 409.5L469.06 393L474.06 390M474.06 390V393C473.727 393.167 472.96 393.7 472.56 394.5C472.16 395.3 472.394 396.833 472.56 397.5C474.394 398.333 478.16 400.4 478.56 402C478.96 403.6 479.394 405.667 479.56 406.5L484.56 402L489.06 399L501.06 391.5H507.06C513.56 387.167 527.16 379.2 529.56 382L545.56 379L549.06 382M474.06 390L476.06 385.5L472.06 378V373L469.06 368.5L470.06 359L472.56 353.5L470.56 349M549.06 382C549.06 383.333 549.06 386.4 549.06 388M549.06 382V388M549.06 388C549.06 389.6 546.727 392 545.56 393V400.5M545.56 400.5L538.06 406.5H526.06L525.06 418.5L529.56 431.5L534.56 441.5M545.56 400.5L557.06 402.5H563.56L569.06 406H582.56L587.56 402.5M534.56 441.5L532.56 447.5L528.06 455C527.394 456.833 526.06 460.8 526.06 462C526.06 463.2 522.06 471.167 520.06 475H510.06L503.06 477L497.56 470L492.06 468L484.56 467L472.56 465.5L467.56 467V485.5L482.06 502L486.56 507L489.06 512.5V513.5M534.56 441.5L545.56 440.5L550.56 438.5L559.56 445.5H572.06L575.56 442.5L579.56 441.5M713.56 560.5L716.56 557.5V552.5L724.56 544.5L720.06 541L716.56 536.5L711.56 535.5L700.06 531.5L692.56 537.25M713.56 560.5C713.56 561.5 713.56 563.8 713.56 565M713.56 560.5V565M713.56 565C713.56 566.2 715.56 568.167 716.56 569L740.56 557.5L745.56 559L753.06 556.5V552.5C753.227 551.833 754.26 550.3 757.06 549.5C759.86 548.7 766.227 545.833 769.06 544.5C768.727 542.167 768.46 537.5 770.06 537.5C771.66 537.5 773.394 536.833 774.06 536.5L772.06 541L775.56 543L778.56 544.5L783.06 537.5L793.06 532.5H799.56L803.06 531.5M803.06 531.5V535.5L807.06 536.5H810.06V544.5L816.06 556.5L811.06 559L808.56 564L803.06 569C803.56 570 804.56 572.4 804.56 574C804.56 575.6 807.227 577.333 808.56 578L831.06 567.5L833.06 562.5L843.56 556.5H853.06L854.56 551L871.56 549.5L877.56 541L868.56 537.5L867.06 531.5L857.06 523L845.56 524.5L844.56 523L837.56 522C833.894 520.333 829.46 513.5 841.06 499.5C841.06 498.7 843.394 497.5 844.56 497L846.56 499.5L857.06 500.5L860.56 507L867.06 511L869.56 514.5L873.06 517.5L876.56 523H881.06L885.06 517.5L898.06 515.5L903.06 511V507L908.06 506L920.56 496L927.06 484L923.06 468.5M803.06 531.5L797.06 527.5L796.06 523L793.56 518.5V509L805.56 498.5L813.56 494.5L822.56 488L825.06 486.5L827.56 484L826.56 480.5M923.06 468.5V462.5L912.56 459V454C909.394 452.167 903.06 447.7 903.06 444.5C903.06 441.3 897.394 439.5 894.56 439L890.06 432L883.56 433V427C881.894 425 878.16 420.7 876.56 419.5C874.96 418.3 872.56 418.333 871.56 418.5L866.06 412.5L862.56 407L857.06 409L859.06 398L861.56 393C860.727 392.167 859.06 390.2 859.06 389M923.06 468.5L918.56 468L906.06 470.5L901.06 473.5C899.894 473.333 897.46 472.9 897.06 472.5C896.66 472.1 892.227 469.667 890.06 468.5L884.56 469.5L878.06 464.5H863.06L857.06 470.5C853.894 471 847.46 472 847.06 472C846.66 472 843.894 470.333 842.56 469.5L838.06 470L834.56 472L831.56 471L829.56 472L826.56 476V480.5M859.06 389C859.06 387.8 859.06 383.5 859.06 381.5M859.06 389V381.5M859.06 381.5L862.56 374L865.06 364.5L863.56 355M863.56 355L861.56 350L865.06 349V343.5L868.56 336L871.56 327L868.56 317L862.56 312L861.56 303.5L855.06 297L857.06 290.5L854.06 289.5L849.06 288.5L847.06 285.5L851.56 278L854.06 266.5L852.56 256L849.06 253.5L850.56 241.5L851.56 231.5H859.06L862.56 226L860.56 222.5L857.06 221.5L855.06 216.5M863.56 355L861.56 357L859.06 354L852.56 348L844.56 347L841.56 350L834.56 345H812.06L807.06 343.5H802.56L796.56 348.5L797.06 354.5L795.56 357L791.56 359L790.06 363L788.56 365.5L783.56 364.5M855.06 216.5L821.06 197.5M358.06 582L355.56 589L357.06 592.5L362.06 584.5L360.56 578L362.06 570.5H368.06L366.56 574.5L366.06 578L368.06 579.5L367.06 589L364.06 592.5L365.56 596.5L365.06 607L362.06 614.5H358.06C357.394 616.5 356.06 620.7 356.06 621.5C356.06 622.3 355.727 625.5 355.56 627L358.56 635L364.06 638L366.06 636.5C367.394 637.333 370.26 639.1 371.06 639.5C372.06 640 369.56 645 369.06 645.5C368.66 645.9 366.227 649.667 365.06 651.5L358.06 648L354.56 644L345.56 650.5L335.06 647.5L320.56 636V617L319.56 609L321.56 606L324.56 595L328.06 593.5L325.56 589C326.227 585 327.66 577 328.06 577M358.06 582C358.06 579.667 358.06 574.8 358.06 574M358.06 582V574M358.06 574C358.06 573.2 354.727 570 353.06 568.5L347.56 569.5L342.56 573L338.56 576L332.56 577M332.56 577C331.227 577 328.46 577 328.06 577M332.56 577H328.06M761.56 71.5L751.06 72L733.56 94.5L721.56 95C720.06 97 716.56 101.2 714.56 102C712.56 102.8 691.394 103 681.06 103L675.06 112L670.06 116H659.06L649.56 112H642.56L626.56 120.5H603.06L598.56 125H585.56C585.227 124.5 584.46 123.5 584.06 123.5M761.56 71.5C765.227 76.5 772.06 88.1 770.06 94.5C769.66 94.9 773.894 104.333 776.06 109C781.227 113 792.16 123.2 794.56 132C794.56 132.8 798.227 134.667 800.06 135.5C802.727 138 808.96 142.9 812.56 142.5C817.06 142 816.06 149.5 820.56 152.5C824.16 154.9 825.727 156.5 826.06 157C827.394 161.5 828.16 171.8 820.56 177C820.56 178.2 820.894 191.167 821.06 197.5M821.06 197.5L818.06 196L813.06 199C809.56 199.5 802.06 200.5 800.06 200.5C792.06 208.5 784.394 205.167 781.56 202.5L763.56 203.5M584.06 123.5C583.66 123.5 580.227 123.5 578.56 123.5M584.06 123.5H578.56M578.56 123.5L576.06 122.5H573.56M573.56 122.5V125.5L561.56 145V157L569.56 177.5H597.06L611.06 171.5H615.06C621.727 176 637.86 184.6 649.06 183C660.26 181.4 678.727 175.667 686.56 173C692.394 176 704.96 182 708.56 182C712.16 182 735.727 182.667 747.06 183L763.56 203.5M573.56 122.5L578.992 109.147M763.56 203.5L774.06 211.5L781.56 216.5L789.56 224.5V233L792.56 241.5V253.5L787.56 263L780.06 275.5L768.06 280.5L763.56 285.5L757.31 286.25M506.56 246V255.5L507.56 261H514.06L515.56 267L511.06 270.5V274.5L515.56 277.5L507.56 289L514.06 309L512.56 323L507.56 329.5L503.06 335.5M506.56 246H501.06L496.56 243.5V238.5L489.56 240V232.5L484.06 231.5L479.56 234H470.56L464.56 231.5H458.06L450.56 237L442.56 231.5V227.5H438.06L430.56 225L425.06 223.5L421.56 225H416.56L415.06 218L413.06 214V207L410.56 205V202L412.06 200V194.5M503.06 335.5H515.56L528.06 333.5H546.56M503.06 335.5L486.56 341.5H481.06L479.56 343L478.56 346.5L470.56 349M546.56 333.5L553.56 335.5L578.06 326L593.06 316L601.56 314L616.06 313C619.727 313.833 629.06 314.1 637.06 308.5C645.06 302.9 669.727 302.833 681.06 303.5L706.06 306.5L723.06 299L737.56 297M546.56 333.5L549.06 345.5L563.56 357.5L578.06 370.5L577.56 378L580.56 379L585.06 382.5L586.06 386.5L590.56 389.5L593.56 393.5C592.727 395.5 590.36 400.1 587.56 402.5M737.56 297L742.06 290.5L751.06 287L757.31 286.25M737.56 297V305L736.56 317L729.56 325L728.56 336.5L719.06 344L706.06 348L693.06 360.5L676.56 369L661.06 364.5L657.56 365L652.06 370.5H646.06L631.56 383.5L626.56 392L618.56 401L598.06 415L587.56 417.5M587.56 417.5V414L591.06 411L590.56 406C588.394 405.833 584.76 404.9 587.56 402.5M587.56 417.5L583.56 421C582.06 420.5 579.76 420.4 582.56 424C585.36 427.6 582.394 432.167 580.56 434L579.56 441.5M470.56 349L464.56 345.5L450.56 348L444.06 353H438.56L435.06 350.5H424.06L422.06 353H415.56C413.56 352.167 409.46 350.5 409.06 350.5C408.56 350.5 400.56 351 399.06 352C397.86 352.8 396.56 355 396.06 356L391.56 354L384.56 356L380.06 358L377.06 362.5L366.56 368C365.894 367.5 364.46 366.4 364.06 366C363.66 365.6 358.894 367.167 356.56 368C356.56 369 355.86 370.7 353.06 369.5C350.26 368.3 347.894 368 347.06 368L342.06 362.5L334.06 359.5L330.06 356L328.06 352L318.06 353L315.06 354L306.56 356L285.06 336L278.56 335M278.56 335L280.56 330.5L283.56 328.5V320L285.06 317L283.56 311L285.06 305M278.56 335L277.06 337L273.06 336L269.56 335L259.56 341.5V359.5L257.56 361M285.06 305L290.06 301.5V299L293.06 291L299.06 283V273L310.56 251L312.56 243.5L314.56 239.5L316.56 225L322.06 217L336.06 208M285.06 305H267.56L253.56 313.5L250.06 309.5L238.06 303.5L234.06 300L230.56 291.5L218.56 286M336.06 208H342.06L346.06 200L351.06 194.5L357.56 191H364.06L368.06 187L376.56 184L379.56 181.5L384.06 180.5L385.06 183L389.56 184L390.56 191L392.06 194.5H399.06L400.56 192H408.06L409.06 194.5H412.06M579.56 441.5H601.06L611.06 438.5L613.56 435.5L618.06 436C620.06 437.167 624.06 440.3 624.06 443.5C624.06 446.7 620.394 447.5 618.56 447.5V452.5L616.56 456L618.06 459L609.56 468L613.56 472V481.5C613.06 481.333 611.86 481.1 611.06 481.5C610.26 481.9 610.727 484.333 611.06 485.5L612.06 495.5L615.56 501V505.5M615.56 505.5L622.06 511L627.06 517.5L647.56 529H663.56L669.56 533.5L675.06 535.5M615.56 505.5L609.56 509.5L604.56 506.5L596.56 509.5L587.56 508L579.56 511L568.06 514.5L558.56 516L546.56 514.5C544.227 515 539.36 516 538.56 516C537.76 516 525.894 514.333 520.06 513.5H508.56L503.06 516H496.06L489.06 513.5M675.06 535.5C675.394 534.833 676.16 533.3 676.56 532.5M675.06 535.5L676.56 532.5M676.56 532.5C676.96 531.7 680.394 532.167 682.06 532.5L688.06 533.5L692.56 537.25M692.56 537.25L685.06 543L682.06 549.5L675.56 556.5L670.06 557.5L667.56 565L666.06 569L663.06 574L661.06 578H657.56V575L653.56 570.5V567.5L649.06 566.5H645.56L643.56 569L645.56 580L642.06 584.5L643.56 590.5L638.06 606L615.56 616L605.06 606H593.56L583.56 601.5L576.56 590.5V584.5L569.56 578L554.56 574L552.56 570.5L549.06 572L530.56 570.5L528.06 561.5L529.56 554L532.56 548L528.06 539.5L520.06 538.5L508.56 525.5L500.06 523.5L496.06 519.5L489.06 518.5V513.5M757.31 286.25L763.56 288.5L765.06 291L768.06 294L770.06 298.5L772.06 299.5V309.5L768.06 313L767.06 318L768.06 325V330L770.56 333L770.06 337L768.06 340M768.06 340C768.06 340.333 768.06 341.2 768.06 342M768.06 340V342M768.06 342C768.06 342.8 772.06 349.667 774.06 353L783.56 361.5V364.5M783.56 364.5L781.06 366.5L782.06 371L777.56 374L768.06 385L764.56 388.5L766.06 391.5V394.5L770.56 395L774.56 395.5C775.06 396.667 776.06 399.1 776.06 399.5C776.06 399.9 775.727 403.667 775.56 405.5L777.56 410L778.56 413.5H785.56L791.06 416.5H793.56L799.56 420V424H796.56L795.06 429L793.06 434L793.56 437C794.727 437.5 797.16 438.5 797.56 438.5C797.96 438.5 801.394 437.5 803.06 437C803.56 437.667 804.66 439.4 805.06 441C805.46 442.6 805.227 447 805.06 449L807.56 450.5L812.56 452.5L815.56 456.5L814.56 462L819.56 465.5V471L821.56 474.5L824.06 480.5H826.56M257.56 361C257.56 362.667 257.56 366.2 257.56 367M257.56 361V367M257.56 367C257.56 367.8 255.56 370 254.56 371V374.5L262.06 378.5L264.06 386.5M264.06 386.5H257.56L248.56 390.5L242.56 394.5V400.5H234.06L225.06 410L214.06 413.5L211.06 418.5L205.06 416L197.56 414.5H190.06L186.56 418.5L185.06 425M185.06 425L182.56 421M218.56 286L201.56 295L194.56 298.5L190.06 302.5L186.56 313.5M218.56 286L215.06 274.5L208.56 269.5L207.56 254.5L213.06 247M186.56 313.5L182.56 317V323L184.56 325L182.56 327.5V330.5L185.56 332L184.56 336L182.06 338.5V341.5L178.06 343M186.56 313.5C183.76 311.9 181.06 305.5 180.06 302.5V296L176.56 293.5M178.06 343L176.56 348.5L178.06 351.5L182.06 352.5L181.56 355.5L174.56 358.5L174.06 361.5L178.06 364.5L175.06 368V374L174.06 380.5L174.56 385.5L179.56 387.5L182.56 390L183.56 392.5L178.06 399.5L183.56 405L185.06 410C184.06 411 181.26 412.3 178.06 409.5M178.06 343H174.06L172.56 339L169.06 338L165.06 338.5V342.5H161.56L158.06 338H144.56L139.56 336L136.06 328.5L126.56 323L120.56 319L115.56 311H107.56L103.56 307.5H95.0603L93.0603 306M178.06 409.5L182.56 421M178.06 409.5C177.489 409 177.175 408.886 177.06 409.064M182.56 421C180.233 416.893 176.533 409.883 177.06 409.064M112.06 390L118.06 389L120.56 393.5L124.56 396L131.06 400.5L149.06 402.5L153.56 400.5H163.06L170.56 405H174.06L177.06 409.064M93.0603 306C95.8936 302.167 101.56 293.3 101.56 288.5L118.56 276C120.394 276 124.56 274.7 126.56 269.5C129.56 269.5 142.56 268 142.06 263.5M142.06 263.5H155.56C156.227 266 159.46 271.1 167.06 271.5C169.06 271.5 171.56 286 176.56 286M142.06 263.5C136.227 261 124.66 253.9 125.06 245.5C121.894 243 115.56 236.9 115.56 232.5C112.56 232.5 103.56 231 100.06 222.5C97.5603 222.5 89.5603 222 87.5603 215C85.0603 215.667 79.4603 214.7 77.0603 205.5C75.5603 205.5 70.0603 207 66.0603 199M176.56 286C176.56 288 176.56 291.833 176.56 293.5M176.56 286V293.5M66.0603 199C59.727 197.167 45.6603 190.8 40.0603 180C35.8936 178.81 26.5603 174.187 22.5603 165.215M66.0603 199C68.8936 200.667 75.0603 203 77.0603 199C79.5603 194 82.5603 185.5 85.0603 185.5M85.0603 185.5C87.0603 185.5 92.227 185.5 94.5603 185.5M85.0603 185.5H94.5603M94.5603 185.5C100.894 190 113.56 199.4 113.56 201M113.56 201C113.56 201.154 113.596 201.166 113.661 201.055M113.56 201C113.593 201.019 113.627 201.037 113.661 201.055M120.101 146.5C120.958 159.754 117.921 175.263 118.56 177.5C119.483 180.731 114.442 199.723 113.661 201.055M120.101 146.5C128.254 141 148.06 131.4 162.06 137C179.56 144 184.06 150.5 187.06 155.5M187.06 155.5C190.06 160.5 190.56 176 195.06 177.5C195.06 180 200.06 191.5 206.56 192M206.56 192C206.56 194.8 206.56 199.167 206.56 201M206.56 192V201M206.56 201L210.56 203.5V210L217.06 214V222.5C215.06 224.167 211.46 228.5 213.06 232.5C211.06 235.3 212.227 243.333 213.06 247M213.06 247L162.06 225.5H152.06C152.727 222.833 153.06 217.4 149.06 217C144.06 216.5 142.06 212.5 141.06 209C140.06 205.5 134.06 208 131.56 203.5C129.084 199.042 117.285 202.926 113.661 201.055M55.0603 467C52.8936 468.5 47.6603 469.9 46.0603 465.5C44.4603 461.1 43.3936 460.333 43.0603 460.5L39.0603 465.5L36.0603 468.5V470L32.0603 471L27.5603 474.5L25.0603 473.5H20.5603L15.0603 471L10.0603 468.5L5.5603 469V475.5L8.5603 479.5L7.5603 481.5L5.5603 483V486L8.5603 489V492.5L9.5603 495.5L15.5603 495L20.5603 490L18.5603 487L21.5603 484.5L25.0603 486L30.5603 483L37.5603 480.5L44.5603 475.5L50.0603 473.5L55.0603 467ZM314.06 600L313.56 604.5H312.06V608.5L308.06 611L305.56 610L307.06 605C306.56 604.167 305.56 602.4 305.56 602C305.56 601.6 308.894 599.833 310.56 599L314.06 600ZM288.56 626.5C287.894 624 287.26 618.9 290.06 618.5C292.86 618.1 291.227 616 290.06 615L285.56 610H282.56L279.06 605L278.06 607.5L279.06 612L281.06 613L285.56 618.5L283.56 623L284.56 626.5L287.56 628.5L288.56 626.5ZM320.06 587L313.56 593.5H308.06V596L303.56 597V602L295.56 610L288.56 608.5V602C287.227 601 284.56 598.8 284.56 598C284.56 597.2 283.227 590.333 282.56 587L284.56 582.5L286.56 577V567L284.56 563.5V558.5L291.06 552.5L299.56 545.5H303.56L310.56 547.5L312.06 558.5H320.06V563.5L318.06 567V571L317.06 574.5L318.06 581.5L320.06 587ZM282.06 561L277.56 564L276.06 561L277.56 555.5L274.56 551.5L277.56 549L274.56 546.5L276.56 537.5L281.06 532H282.56L283.06 539.5L280.56 542.5L280.06 545.5L282.06 542.5L283.56 543L284.56 547.5V552.5L282.06 554L281.06 558.5L282.06 561ZM401.56 570.5L396.56 571L395.56 575L388.56 580.5L386.56 585.5L384.06 587L383.56 598.5L381.06 605.5L383.06 611.5L386.56 612.5L388.56 621.5L392.06 624L396.56 620L397.56 615.5L396.56 611L394.56 609L397.56 605.5L399.56 601V596.5L397.06 593L400.06 588.5L401.56 584.5L401.06 581.5L400.06 578L404.06 574.5L401.56 570.5ZM556.06 626L550.56 626.5L547.06 618L544.06 615H531.56L531.06 617H527.56L526.56 613.5V610L525.56 606V600.5L531.06 594H536.06L537.06 595.5L544.06 595L547.06 592H550.56L553.06 594L554.56 598.5V605.5C555.06 606.167 556.16 607.6 556.56 608C556.96 608.4 557.727 609.5 558.06 610V619.5L556.06 623V626Z"
        stroke="black"
        strokeWidth={1}
        fill="none"
        className="pointer-events-none"
      />

      {/* Overlays (army badges, icons) */}
      {overlays}
    </svg>
  );
}
