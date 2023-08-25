import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const PIXABAY_API_URL = 'https://pixabay.com/api/';

// =========================== N E W ========================

export async function getIMGByQuery(query, pageNum, perPageNum) {
  const params = new URLSearchParams({
    key: '15414198-72fccac02b5eb93f67efa29c9',
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: pageNum,
    per_page: perPageNum,
  });

  try {
    const response = await axios.get(`${PIXABAY_API_URL}?${params}`);
    return response;
  } catch (err) {
    Notify.failure('Oops! Something went wrong! Try reloading the page!');
  }
}

// ===================== O L D =======================
// export async function getIMGByQuery(query, pageNum, perPageNum) {
//   try {
//     const response = await axios.get(PIXABAY_API_URL, {
//       params: {
//         key: '15414198-72fccac02b5eb93f67efa29c9',
//         q: query,
//         image_type: 'photo',
//         orientation: 'horizontal',
//         safesearch: true,
//         page: pageNum,
//         per_page: perPageNum,
//       },
//     });
//     return response;
//   } catch (err) {
//     Notify.failure('Oops! Something went wrong! Try reloading the page!');
//   }
// }
