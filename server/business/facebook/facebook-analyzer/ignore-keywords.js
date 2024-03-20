const removeDiacritics = require('./remove-diacritics');
const ignoreKeywords = [
  'ib',
  'trao doi',
  'thanh ly',
  'lam tai nha',
  'lau dai',
  'thoi vu',
  'tieng buoi chieu',
  'tieng buoi toi',
  'lam them',
  'lm them',
  'zalo',
  'ca sang',
  'ca chieu',
  'ca toi',
  'xa kho',
  'chi tieu',
  'lh',
  'phu cap',
  'xa not',
  'xa hang',
  'nhan viec',
  'pass',
  'gia sua',
  'phau thuat',
  'ddvs',
  'lien he',
  'xa lo',
  'kiem tien',
  'sale',
  'shop',
  'ghep anh',
  'mien ship',
  'mien sip',
  'album',
  'can tuyen',
  'thanh toan',
  'kiem hang',
  'de lai',
  'tranh thai',
];

const isIgnore = (htmlContent) => {
  const content = removeDiacritics(htmlContent.replace(/<[^>]*>/g, ''));
  for (const keyword of ignoreKeywords) {
    if (content.includes(keyword)) {
      return keyword;
    }
  }
  return null;
};

// (() => {
//   const content =
//     '<div><div class="x5yr21d xyqdw3p" dir="auto"><div class="xh8yej3"><div class="x1cy8zhl x78zum5 x1nhvcw1 x1n2onr6 xh8yej3" style="background-color: rgb(198, 0, 255); background-image: linear-gradient(rgb(198, 0, 255), rgb(198, 0, 255));"><div aria-hidden="true" class="xh8yej3"><div class="xrbpyxo x1p5jlgq"></div><div class="xlshs6z"><div class="x1yx25j4 x13crsa5 x6x52a7 x1rxj1xn xxpdul3" style="color: rgb(255, 255, 255); font-size: 30px; font-style: normal; font-weight: bold; text-align: center;"><div class="xdj266r x11i5rnm xat24cr x1mh8g0r x1vvkbs">𝐂ầ𝐧 𝐧𝐠ườ𝐢 𝐩𝐡ụ 𝟐 𝐭𝐢ế𝐧𝐠 𝐛𝐮ổ𝐢 𝐜𝐡𝐢ề𝐮 𝐡𝐨ặ𝐜 𝟐 𝐭𝐢ế𝐧𝐠 𝐛𝐮ổ𝐢 𝐭ố𝐢. 𝐂ô𝐧𝐠 𝟏2𝟎-18𝟎</div></div></div></div><div class="x6s0dn4 x78zum5 xdt5ytf x5yr21d xl56j7k x10l6tqk x17qophe x13vifvy xh8yej3"><div class="x1yx25j4 x13crsa5 x6x52a7 x1rxj1xn xxpdul3" id=":r1r:" style="color: rgb(255, 255, 255); font-size: 30px; font-style: normal; font-weight: bold; text-align: center;"><div class="xdj266r x11i5rnm xat24cr x1mh8g0r x1vvkbs">𝐂ầ𝐧 𝐧𝐠ườ𝐢 𝐩𝐡ụ 𝟐 𝐭𝐢ế𝐧𝐠 𝐛𝐮ổ𝐢 𝐜𝐡𝐢ề𝐮 𝐡𝐨ặ𝐜 𝟐 𝐭𝐢ế𝐧𝐠 𝐛𝐮ổ𝐢 𝐭ố𝐢. 𝐂ô𝐧𝐠 𝟏2𝟎-18𝟎</div></div></div><div class="x1nb4dca x1q0q8m5 xso031l x1exxf4d x13fuv20 x178xt8z x1ey2m1c x9f619 xds687c x47corl x10l6tqk x17qophe x13vifvy"></div></div></div></div></div>';
//   console.log(isIgnore(content));
// })();
module.exports = isIgnore;
