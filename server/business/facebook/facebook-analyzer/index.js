const { mappings, actionConnector, actionConnector2 } = require('./word-definitions');
const removeDiacritics = require('./remove-diacritics');
const getMatchMapping = (content) => {
  let matchedMappings = [];
  for (const mapping of mappings) {
    for (const keyword of mapping.keywords) {
      if (content.toLowerCase().includes(keyword)) {
        matchedMappings.push(mapping);
        break;
      }
    }
  }

  return matchedMappings;
};

const getRandomElementFromArray = (array) => {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
};

const buildSubject = (mappings) => {
  let result = '';
  //1 means no starter
  //2 means no middle
  const type = getRandomElementFromArray([1, 2]);

  const { starter, middle } = mappings[0];
  let subjectStarter = '';
  if (type != 1) subjectStarter = getRandomElementFromArray(starter);
  let subjectMiddle = '';
  if (type != 2) subjectMiddle = getRandomElementFromArray(middle);
  if (subjectStarter !== '') result += subjectStarter;
  if (subjectMiddle !== '') result += subjectMiddle;

  return result;
};

const buildActions = (mappings) => {
  let allActions = [];
  for (const mapping of mappings) {
    const { actions } = mapping;
    let realAction = getRandomElementFromArray(actions);
    allActions.push(realAction);
  }
  let contentAction = ' ';
  for (let i = 0; i < allActions.length; i++) {
    let action = allActions[i];
    contentAction += action;
    if (allActions.length == 1) {
    } else if (i == 0) {
      contentAction += ' ' + getRandomElementFromArray(actionConnector) + ' ';
    } else if (i == allActions.length - 1) {
      contentAction += '.';
    } else {
      contentAction += ' ' + getRandomElementFromArray(actionConnector2) + ' ';
    }
  }
  return contentAction;
};

const buildProductDescription = (mappings) => {
  let contentProductDescription = `. ${getRandomElementFromArray(
    mappings[0].productDescription,
  )}. `;
  for (const mapping of mappings) {
    const { productMap } = mapping;
    for (const key of Object.keys(productMap)) {
      contentProductDescription += `${key}: ${productMap[key]} `;
    }
  }
  return contentProductDescription;
};
const buildContentAnswer = (mappings) => {
  // const { description, keywords, starter, middle, productDescription, actions, productMap } = {};
  let answer = '';
  const subject = buildSubject(mappings);
  const action = buildActions(mappings);
  const productDescription = buildProductDescription(mappings);
  answer += `${subject}${action}${productDescription}`;

  return answer;
};

const analyzeContent = (htmlContent) => {
  const content = removeDiacritics(htmlContent.replace(/<[^>]*>/g, ''));
  const mappings = getMatchMapping(content);
  if (mappings.length === 0) {
    return null;
  }
  const answer = buildContentAnswer(mappings);
  return answer;
};

// (() => {
//   const htmlContent =
//     '<div><div class="" dir="auto"><div class="x1iorvi4 x1pi30zi x1swvt13 xjkvuk6" data-ad-comet-preview="message" data-ad-preview="message" id=":r1c:"><div class="x78zum5 xdt5ytf xz62fqu x16ldp7u"><div class="xu06os2 x1ok221b"><span class="x193iq5w xeuugli x13faqbe x1vvkbs x1xmvt09 x1lliihq x1s928wv xhkezso x1gmr53x x1cpjm7i x1fgarty x1943h6x xudqn12 x3x7a5m x6prxxf xvq8zen xo1l8bm xzsf02u x1yc453h" dir="auto"><div class="xdj266r x11i5rnm xat24cr x1mh8g0r x1vvkbs x126k92a"><div dir="auto" style="text-align: start;">Bé nhà mình 9th uống meji từ khi sinh đến giờ</div><div dir="auto" style="text-align: start;">Giờ mình muốn đổi sưac cho bé tại bé hơi còi(được có 7k8</div><div dir="auto" style="text-align: start;">Đổi sang loại nào thì đc các mom nhỉ</div></div></span></div></div></div></div></div>';

//   const content = removeDiacritics(htmlContent.replace(/<[^>]*>/g, ''));
//   console.log('content', content);
// })();
module.exports = analyzeContent;
