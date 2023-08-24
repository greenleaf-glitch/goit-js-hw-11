import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const axios = require('axios');

export async function getIMGByQuery(query, pageNum, perPageNum) {
  try {
    const response = await axios('https://pixabay.com/api/', {
      params: {
        method: 'get',
        key: '15414198-72fccac02b5eb93f67efa29c9',
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: pageNum,
        per_page: perPageNum,
      },
    });
    return response;
  } catch (err) {
    Notify.failure('Oops! Something went wrong! Try reloading the page!');
  }
}
