import { BASE_URL } from "../constants/app-const";

export const buildPostUrl = (slug, isAbsolute = false) => {
  return `${isAbsolute ? BASE_URL : ''}/article?id=${slug}`;
}

export const buildTourUrl = (slug, isAbsolute = false) => {
  return `${isAbsolute ? BASE_URL : ''}/tour/${slug}`;
}