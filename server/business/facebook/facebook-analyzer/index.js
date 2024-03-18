const { mappings, actionConnector, actionConnector2 } = require('./word-definitions');
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
      contentAction += getRandomElementFromArray(actionConnector);
    } else if (i == allActions.length - 1) {
      contentAction += '.';
    } else {
      contentAction += getRandomElementFromArray(actionConnector2);
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

function removeDiacritics(text) {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

const analyzeContent = (htmlContent) => {
  const content = removeDiacritics(htmlContent.replace(/<[^>]*>/g, '')).toLowerCase();
  const mappings = getMatchMapping(content);
  if (mappings.length === 0) {
    return null;
  }
  const answer = buildContentAnswer(mappings);
  return answer;
};

module.exports = analyzeContent;
