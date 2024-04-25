import { VIEW_HISTORY_KEYS } from "../constants/storage-key-const";

const MILISECONDS_OF_MINUTE = 60000;

export const getPostHistory = () => {
  const posts = localStorage.getItem(VIEW_HISTORY_KEYS.posts);
  return JSON.parse(posts || '[]');
}

export const addPostHistory = ({ id, date }) => {
  const posts = getPostHistory();
  if (posts.length && posts[0].id == id
    && date - posts[0].date < 10 * MILISECONDS_OF_MINUTE) {
    return;
  }
  
  posts.unshift({ id, date });
  localStorage.setItem(VIEW_HISTORY_KEYS.posts, JSON.stringify(posts));
}