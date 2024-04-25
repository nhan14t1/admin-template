export const BASE_API_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}/api`;
export const BASE_IMAGE_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}/images/posts`;
export const BASE_THUMBNAIL_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}/images/thumbnails`;
export const BASE_TOUR_PHOTO_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}/images/tours`;
export const WEB_NAME = 'yoursite';
export const WEB_NAME_WITH_SPACE = 'Your Site';
export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
export const ROLES = {
  Admin: { id: 1, name: 'Admin'},
  User: { id: 2, name: 'User'},
  Editor: { id: 3, name: 'Editor'},
};

export const CATEGORIES_POST = {
  VietNam: {id: 1, name: 'Du lịch trong nước', slug: 'du-lich-trong-nuoc'},
  Chinese: {id: 2, name: 'Du lịch Trung Quốc', slug: 'du-lich-trung-quoc'},
  Korea: {id: 3, name: 'Du lịch Hàn Quốc', slug: 'du-lich-han-quoc'},
  ThaiLand: {id: 4, name: 'Du lịch Thái Lan', slug: 'du-lich-thai-lan'},
  Taiwan: {id: 5, name: 'Du lịch Đài Loan', slug: 'du-lich-dai-loan'},
  HongKong: {id: 6, name: 'Du lịch Hồng Kông', slug: 'du-lich-hong-kong'},
  Tip: {id: 7, name: 'Cẩm nang du lịch', slug: 'cam-nang-du-lich'},
};

export const CATEGORIES_TOUR = {
  VietNam: {id: 8, name: 'Tour trong nước', slug: 'tour-trong-nuoc'},
  Chinese: {id: 9, name: 'Tour Trung Quốc', slug: 'tour-trung-quoc'},
  Korea: {id: 10, name: 'Tour Hàn Quốc', slug: 'tour-han-quoc'},
  ThaiLand: {id: 11, name: 'Tour Thái Lan', slug: 'tour-thai-lan'},
  Taiwan: {id: 12, name: 'Tour Đài Loan', slug: 'tour-dai-loan'},
  HongKong: {id: 13, name: 'Tour Hồng Kông', slug: 'tour-hong-kong'},
  Asean: {id: 14, name: 'Tour Đông Nam Á khác', slug: 'tour-dong-nam-a-khac'},
};

export const POST_STATUS = {
  Active : { id: 1, name: 'Hoạt động'},
  Schedule : { id: 2, name: 'Lên lịch'},
  Draft : { id: 3, name: 'Nháp'},
  Deleted : { id: 4, name: 'Đã xóa'},
}

export const TEST_IMAGE_URL = '/assets/images/default.svg';
export const IMAGE_POST_PREFIX = 'tqim-';

export const IMAGE_EXTENSIONS_ALLOWED = ['jpg', 'png', 'jpeg', 'bmp', 'svg', 'webp'];

export const DEFAULT_PAGE_SIZE = 10;

export const TOUR_PRICE_UNITS = {
  DONG: {id: 1, name: 'Đồng', rate: 1, symbol: '₫'},
  THOUSAND_DONG: {id: 2, name: 'Nghìn đồng', rate: 1000, symbol: 'K₫'},
  MILLION_DONG: {id: 3, name: 'Triệu đồng', rate: 1000000, symbol: 'M₫'},
  USD: {id: 4, name: 'USD', rate: 1, symbol: '$'},
};

export const TAG_TYPES = {
  Post : 1,
  Tour: 2,
}

export const SALE_COMMISSION_RATE = 0.75;
export const GENERAL_COMMISSION_RATE = 0.2;

