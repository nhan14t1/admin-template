import { BASE_URL } from "../../../shared/constants/app-const";
import { countWords, toSlug } from "../../../shared/utils/stringUtils";

const isIncludes = ({ keywords, text }) => {
  const passed = !!keywords.find(_ => text.includes(_));
  return { passed };
}

const get10PercentsContent = (content) => {
  if (content.length < 120) {
    return content;
  }

  const length10Percenter = Math.floor(content.length * 0.1);
  return content.substr(0, length10Percenter);
}

const calculateContentCount = ({ textContent }) => {
  const length = countWords(textContent);
  const passed = length >= 1000;
  const title = `Số lượng từ: ${length}`;
  return { passed, title };
}

const findHeadings = (html) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const headingElements = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
  return Array.from(headingElements).map(_ => _.textContent);
}

const calculateKeywordSubHeading = ({ keywords, content }) => {
  const headings = findHeadings(content).join(', ');
  const { passed } = isIncludes({ keywords, text: headings });
  return { passed };
}

const calculateKeywordAltText = ({ keywords, imgUrlAlts }) => {
  const alts = Object.values(imgUrlAlts);
  const passedAlts = alts.filter(altText => isIncludes({ keywords, text: altText }).passed);
  const passed = !!passedAlts.length;
  const title = `Từ khóa ở thẻ alt của ảnh${passed ? `: Xuất hiện ${passedAlts.length} thẻ` : ''}`
  return { passed, title };
}

const calculateUrlCount = ({ slug }) => {
  const passed = slug.length <= 80;
  const title = `${ADDITION_SEO.UrlCount.title}: ${slug.length} ký tự`;
  return { passed, title };
}

const calculateInternalLink = ({ links }) => {
  const webUrl = BASE_URL.replace('https', '').replace('http', '').replace('://', '');
  const internalLink = links.filter(_ => _.includes(webUrl));
  const passed = !!internalLink.length;
  const title = `${ADDITION_SEO.InternalLink.title}: ${internalLink.length} link`;
  return { passed, title };
}

const calculateExernalLink = ({ links }) => {
  const webUrl = BASE_URL.replace('https', '').replace('http', '').replace('://', '');
  const internalLink = links.filter(_ => !_.includes(webUrl));
  const passed = !!internalLink.length;
  const title = `${ADDITION_SEO.ExternalLink.title}: ${internalLink.length} link`;
  return { passed, title };
}

export const BASIC_SEO = {
  KeywordTitle: { id: 1, title: 'Từ khóa ở tiêu đề', calculator: ({ keywords, title }) => isIncludes({ keywords, text: title }) },
  KeywordDescription: { id: 2, title: 'Từ khóa ở meta description', calculator: ({ keywords, introText }) => isIncludes({ keywords, text: introText }) },
  KeywordUrl: { id: 3, title: 'Từ khóa ở URL', calculator: ({ keywords, slug }) => isIncludes({ keywords: keywords.map(keyword => toSlug(keyword)), text: slug }) },
  Keyword10Percent: { id: 4, title: 'Từ khóa ở 10% đầu tiên của bài viết', calculator: ({ keywords, textContent }) => isIncludes({ keywords, text: get10PercentsContent(textContent) }) },
  KeywordContent: { id: 5, title: 'Từ khóa xuất hiện trong bài viết', calculator: ({ keywords, textContent }) => isIncludes({ keywords, text: textContent }) },
  KeywordCount: { id: 6, title: 'Số lượng từ:', calculator: calculateContentCount },
}

export const ADDITION_SEO = {
  KeywordSubHeading: { id: 101, title: 'Từ khóa ở thẻ sub heading', calculator: calculateKeywordSubHeading },
  KeywordAltText: { id: 102, title: 'Từ khóa ở thẻ alt của ảnh', calculator: calculateKeywordAltText },
  // KeywordDensity: { id: 103, title: 'Mật độ từ khóa (Chưa có chức năng này)', ignore: true },
  UrlCount: { id: 104, title: 'Độ dài URL (slug)', calculator: calculateUrlCount },
  InternalLink: { id: 105, title: 'Sử dụng internal link', calculator: calculateInternalLink },
  ExternalLink: { id: 106, title: 'Sử dụng external link', calculator: calculateExernalLink },
}

const calculateSeoItem = (item, data) => {
  if (!item.calculator) {
    return item;
  }

  const rest = item.calculator(data);
  return { ...item, ...rest };
}

// Remove image tags from content
const getPlanTextContent = (html) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  return doc?.children?.[0]?.textContent || '';
}

const findLinks = (html) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const links = doc.querySelectorAll('a');
  return Array.from(links).map(_ => _.href);
}

export const calculateSeo = ({ keywords: originalKeywords, title, slug, introText, content, imgUrlAlts }) => {
  const keywords = originalKeywords.map(_ => _.toLowerCase());
  title = (title || '').toLowerCase();
  slug = slug || '';
  introText = (introText || '').toLowerCase();
  content = (content || '').toLowerCase();
  const textContent = getPlanTextContent(content); // content without image
  Object.keys(imgUrlAlts).forEach(key => imgUrlAlts[key] = (imgUrlAlts[key] || '').toLowerCase());
  const links = findLinks(content);

  const data = { keywords, slug, title, introText, content, imgUrlAlts, textContent, links };
  const basicSeo = Object.values(BASIC_SEO).map(item => calculateSeoItem(item, data));
  const additionalSeo = Object.values(ADDITION_SEO).map(item => calculateSeoItem(item, data));
  return { basicSeo, additionalSeo };
}