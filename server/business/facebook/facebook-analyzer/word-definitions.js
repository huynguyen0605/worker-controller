const defaultStarter = ['M', 'm', 'Mom', 'mom', 'cứ', 'Cứ', 'Chỉ cần'];
const defaultMiddle = ['thử', 'thử cho con', 'cho bé', 'cho con'];
const actionConnector = [
  'kết hợp',
  'kết hợp vs',
  'chung với',
  'cùng vs',
  'sd chung',
  'sd chung vs',
  'vs',
  'sd vs',
  'cùng vs',
  'chung vs',
  'vs cả',
];

const actionConnector2 = ['&', 'và', ','];
const defaultProductDescription = [
  'Dùng các loại này nhé',
  'Dùng loại này nhé',
  'Mom tham khảo loại này nhé',
  'M tham khảo loại này nhé',
  'M dùng loại này xem',
  'Dùng loại này nhé m',
  'Mom dùng loại này',
  'Mom thử loại này',
  'M thử loại này xem',
  'M dùng cái này xem',
  'Mom dùng cái này nhé',
  'Loại này nhé',
  'Loại này này',
];

const mappings = [
  {
    description: 'ăn dặm',
    keywords: ['an dam'],
    starter: defaultStarter,
    middle: defaultMiddle,
    actions: [
      'ăn gạo bt kết hợp diêm mạch',
      'ăn bt kết hợp sd diêm mạch',
      'ăn bình thường vs sd diêm mạch',
      'ăn gạo bt thôi, dùng thêm diêm mạch là đc',
      'sd diêm mạch là ổn nhé',
      'dùng diêm mạch là đc',
      'kết hợp diêm mạch là ổn nhé',
    ],
    productDescription: defaultProductDescription,
    productMap: {
      'Diêm mạch': 'https://shorten.ee/9STYj',
    },
  },
  {
    description: 'tiêu hóa',
    keywords: [
      'an ngon',
      'luoi an',
      'bieng an',
      'phan',
      'de tieu',
      'tieu hoa',
      'tao bon',
      'tao',
      'men',
      'khong chiu an',
      'khong an',
      'khong uong',
      'khong an uong',
      'di ngoai',
      'oc sua',
      'mun sua',
      'bi tro',
      'tro sua',
      'xi xoet',
    ],
    starter: defaultStarter,
    middle: defaultMiddle,
    actions: [
      'sd men tiêu hóa là đc nhé m',
      'dùng men là đc nhé mom',
      'dùng men vi sinh là đc nhé mom',
      'dùng biogaia là đc nhé m',
      'dùng men th là đc mom ak',
      'dùng men là ổn m ak',
      'sd men th là đc mom ak',
      'sd men tiêu hóa là ổn',
      'sd men tiêu hóa là được',
      'dùng men tiêu hóa là ổn',
      'dùng men tiêu hóa là đc',
    ],
    productDescription: defaultProductDescription,
    productMap: {
      'Men biogaia': 'https://shorten.so/Yciou',
    },
  },
  {
    description: 'uống sữa nào',
    keywords: [
      'sct',
      'sua ct',
      'sua cong thuc',
      'tang can',
      'doi sua',
      'len duoc',
      'sut can',
      'phat trien',
      'cay keo',
      'cai keo',
      'de uong',
      'mun sua',
      'sua bot',
      'nan',
      'len can',
    ],
    starter: defaultStarter,
    middle: defaultMiddle,
    productDescription: defaultProductDescription,
    actions: [
      'uống sữa nan vừa tăng cân vừa mát nhé m',
      'dùng sữa nan là tăng cân mom ak',
      'uống Nan là tăng cân đó mom',
      'uống Nan tăng cân, lại mát nữa mom',
      'uống nan tăng cân, mát. ổn áp nhé m',
      'dùng nan tăng cân lại mát ổn nhé m',
      'uống nan tăng cân vs mát lắm',
      'dùng Nan tăng cân lại mát nữa m',
    ],
    productMap: {
      'Sữa Nan': 'https://shorten.so/Yciou',
    },
  },
  {
    description: 'hô hấp',
    keywords: [
      'so mui',
      'phe quan',
      'khut khit',
      'sut sit',
      'nuoc mui',
      'kho tho',
      'viem mui',
      'ho hap',
      'co dom',
      'kho khe',
      'ho dom',
      'viem amidan',
    ],
    starter: defaultStarter,
    middle: defaultMiddle,
    productDescription: defaultProductDescription,
    actions: [
      'vệ sinh mũi bằng nc muối fys. khò khè thì dùng fys vàng. ngạt mũi thì dùng fys xanh, bt thì dùng fys hồng nhé m',
      'vs mũi bằng nc muối fys nhé mom. fys hồng vs hàng ngày, khò khè thì fys vàng, ngạt mũi dùng fys xanh',
      'dùng dầu tràm bôi ngực vs lòng bàn chân sau tắm, vs mũi nc muối fys mom nhé. dùng fys xanh nếu ngạt mũi, fys vàng nếu khò khè, fys hồng thì vệ sinh bt',
      'lấy dầu chàm bôi lòng ban chân, ngực sau tắm, ve sinh mũi dùng nc muối fys mom ak. fys hong vs hàng ngày, fys xanh trị ngạt mũi, fys vàng trị khò khè',
      'bôi lòng bàn chân vs ngực sau tắm, dùng dầu chàm, dùng nc muối fys vs mũi. khò khè thì dùng fys vàng. ngạt mũi thì dùng fys xanh, bt thì dùng fys hồng',
      'sd nc muối fys vệ sinh mũi cho con là đc mom. fys hồng vs hàng ngày, khò khè thì fys vàng, ngạt mũi dùng fys xanh m nhé',
      'dùng nc muối fys vệ sinh mũi nhé. khò khè thì dùng fys vàng. ngạt mũi thì dùng fys xanh, bt thì dùng fys hồng nhé mom',
      'vs mũi bằng nc muối. dùng dầu chàm bôi ngực, lòng bàn chân sau tắm. khò khè thì dùng fys vàng. ngạt mũi thì dùng fys xanh, bt thì dùng fys hồng là đc mom',
    ],
    productMap: {
      'fys xanh': 'https://shorten.so/Vl6Bk',
      'fys hồng': 'https://shorten.so/0tB9x',
      'fys vàng': 'https://shorten.ee/K5Ddx',
    },
  },
  {
    description: 'phát triển trí não',
    keywords: ['tri nao', 'dha', 'thong minh'],
    starter: defaultStarter,
    middle: defaultMiddle,
    productDescription: defaultProductDescription,
    actions: [
      'dùng dha là được nhé nhé',
      'dùng thêm dha nhé',
      'sử dụng dha thêm nhé',
      'sd dha bổ sung nhé',
    ],
    productMap: {
      dha: 'https://shorten.so/65zqI',
    },
  },
  {
    description: 'kích sữa',
    keywords: [
      'co sua',
      'it sua',
      'hut',
      'sua it',
      'khong ve',
      'sua ve',
      've sua',
      'nhieu sua',
      'sua nhieu',
      'kich sua',
      'loi sua',
      'them sua',
      'loj sua',
      'luong sua',
      'sua nhiu',
      'nhiu sua',
      've nhieu',
      'chua ve',
    ],
    starter: defaultStarter,
    middle: ['thử', '', 'cứ'],
    productDescription: defaultProductDescription,
    actions: [
      'kích sữa kết hợp sd ngũ cốc',
      'kích sữa bằng máy hút & sd thêm ngũ cốc',
      'kích sữa bằng máy, sd ngũ cốc',
      'sd ngũ cốc nhé',
      'kích sữa bằng máy hút vs sử dụng ngũ cốc',
      'kích sữa bằng máy hút & sử dụng ngũ cốc',
      'kích sữa bằng máy hút vs sử dụng ngũ cốc là đc',
      'kích sữa bằng máy hút vs sử dụng ngũ cốc là ổn',
      'kích sữa bằng máy hút vs sử dụng ngũ cốc là sữa về ầm ầm',
      'kích sữa bằng máy hút vs sử dụng ngũ cốc là sữa về nhé',
      'kích sữa bằng máy hút vs sử dụng ngũ cốc là đc nhé',
    ],
    productMap: {
      'ngũ cốc lợi sữa': 'https://shorten.so/Rc6VK',
    },
  },
  {
    description: 'đề kháng d3k2',
    keywords: ['de khang', 'om vat'],
    starter: defaultStarter,
    middle: defaultMiddle,
    productDescription: defaultProductDescription,
    actions: [
      'dùng d3k2 là tăng đề kháng',
      'sử dụng d3k2 là tăng đề kháng',
      'dùng thêm d3k2 là được',
      'dùng thêm d3k2 là ổn',
      'sd d3k2 là được nhé',
      'sd thêm d3k2 là tăng đề kháng',
    ],
    productMap: {
      'ngũ cốc lợi sữa': 'https://shorten.so/Rc6VK',
    },
  },
  {
    description: 'đề kháng ildong',
    keywords: ['de khang', 'om vat'],
    starter: defaultStarter,
    middle: defaultMiddle,
    productDescription: defaultProductDescription,
    actions: [
      'sd sữa non ildong hỗ trợ tăng đk & pt',
      'dùng sữa non ildong tăng đk & pt',
      'sd ildong tăng đk & pt',
    ],
    productMap: {
      'sữa non ildong': 'https://shorten.so/gNcK5',
    },
  },
  {
    description: 'viêm da cơ địa',
    keywords: ['co dia'],
    starter: [''],
    middle: [''],
    productDescription: defaultProductDescription,
    actions: [
      'đã gọi là cơ địa thì k dứt điểm hẳn đc. sd thêm',
      'sử dụng d3k2 là tăng đề kháng',
      'dùng thêm d3k2 là được',
      'dùng thêm d3k2 là ổn',
      'sd d3k2 là được nhé',
      'sd thêm d3k2 là tăng đề kháng',
    ],
    productMap: {
      'ngũ cốc lợi sữa': 'https://shorten.so/Rc6VK',
    },
  },
];

module.exports = {
  defaultStarter,
  defaultMiddle,
  actionConnector,
  actionConnector2,
  defaultProductDescription,
  mappings,
};
