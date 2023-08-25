import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { getIMGByQuery } from './js/helper.js';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

// ===========CONST==================
const refs = {
  form: document.querySelector('#search-form'),
  input: document.querySelector('input'),
  btn: document.querySelector('button'),
  gallery: document.querySelector('.gallery'),
  targetElem: document.querySelector('.js-target'),
};

const observerOptions = {
  threshold: 0,
};

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
});

let query = '';
let perPageNum = 40;
let pageNum;
let maxPage;

// =========================================================

refs.form.addEventListener('submit', onFormSubmit);

async function onFormSubmit(evt) {
  evt.preventDefault();

  query = refs.input.value.trim();
  if (!query) return;

  pageNum = 1;

  try {
    const data = await getIMGByQuery(query, pageNum, perPageNum);
    const dataArr = data.data.hits;

    if (dataArr.length !== 0) {
      Notify.success(
        `Hooray! We found ${data.data.totalHits} images for current conditions.`
      );
      setTimeout(() => {
        Notify.success(
          `We have ${data.data.total} total amount of images on this query.`
        );
      }, 500);

      refs.gallery.innerHTML = '';

      renderGallery(dataArr);

      lightbox.refresh();

      maxPage = Math.ceil(data.data.totalHits / perPageNum);

      observer.observe(refs.targetElem);
      updateStatusObserver();
    } else {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
  } catch {
    Notify.failure('Oops! Something went wrong! Try reloading the page!');
  }
  evt.target.reset();
}

function renderGallery(dataArr) {
  const cardMarkup = dataArr
    .map(el => {
      return templateCard(
        el.largeImageURL,
        el.webformatURL,
        el.tags,
        el.likes,
        el.views,
        el.comments,
        el.downloads
      );
    })
    .join('');

  refs.gallery.insertAdjacentHTML('beforeend', cardMarkup);
}

function templateCard(
  tmpLargeImageURL,
  tmpWebformatURL,
  tmpTags,
  tmpLikes,
  tmpViews,
  tmpComments,
  tmpDownloads
) {
  const markUp = `<a class="img-card" href="${tmpLargeImageURL}">
                <img class="img-preview" src="${tmpWebformatURL}" alt="${tmpTags}" 
                title="" width=300px height=200px loading="lazy"/>
                  <div class="photo-card">
                  <div class="info">
                  <p class="info-item">
                      <b><span style="color:darkred">${tmpLikes}</span> Likes</b>
                  </p>
                  <p class="info-item">
                      <b><span style="color:darkred">${tmpViews}</span> Views</b>
                  </p>
                  <p class="info-item">
                      <b><span style="color:darkred">${tmpComments}</span> Comments</b>
                  </p>
                  <p class="info-item">
                      <b><span style="color:darkred">${tmpDownloads}</span> Downloads</b>
                  </p>
                  </div>
              </div></a>`;
  return markUp;
}

async function loadMore() {
  pageNum += 1;
  try {
    const data = await getIMGByQuery(query, pageNum, perPageNum);
    const dataArr = data.data.hits;

    renderGallery(dataArr);

    lightbox.refresh();
  } catch {
    Notify.failure('Oops! Something went wrong! Try reloading the page!');
  }
  window.scrollBy({
    top: 700,
    behavior: 'smooth',
  });
  updateStatusObserver();
}

const observer = new IntersectionObserver(callback, observerOptions);

function callback(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      loadMore();
    }
  });
}

function updateStatusObserver() {
  if (pageNum === maxPage + 1) {
    observer.unobserve(refs.targetElem);
    Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
  }
}
