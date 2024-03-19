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
];

function removeDiacritics(text) {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

const isIgnore = (htmlContent) => {
  const content = removeDiacritics(htmlContent.replace(/<[^>]*>/g, '')).toLowerCase();
  for (const keyword of ignoreKeywords) {
    if (content.includes(keyword)) {
      return keyword;
    }
  }
  return null;
};

module.exports = isIgnore;
