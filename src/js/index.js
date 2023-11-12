import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { QueryAPI } from './query-api';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  form: document.querySelector('.search-form'),
  searchInput: document.querySelector('input'),
  galleryList: document.querySelector('.gallery'),
  targetEl: document.querySelector('.js-target'),
};

const objObserver = {
  options: {
    rootMargin: '400px',
    threshold: 0,
  },
  options2: {
    rootMargin: '0px',
    threshold: 1.0,
  },

  callbackObserv(entries, observer) {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      queryAPI.page++;
      updateStatusObserver();
      queryAPI
        .searchingQuery()
        .then(data => {
          renderQuery(data.hits);
          lightbox.refresh();
        })
        .catch(er => console.log(er));
    });
  },

  callbackObservNotify(entries, observer) {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      Notify.info("We're sorry,but you've reached the end of search results.");
    });
  },
};

refs.form.addEventListener('submit', onSubmit);

const queryAPI = new QueryAPI();
const observer = new IntersectionObserver(
  objObserver.callbackObserv,
  objObserver.options
);
const observForNotify = new IntersectionObserver(
  objObserver.callbackObservNotify,
  objObserver.options2
);

function onSubmit(e) {
  e.preventDefault();

  if (refs.searchInput.value === '') {
    refs.galleryList.innerHTML = '';
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  queryAPI.q = refs.searchInput.value;
  queryAPI.page = 1;

  queryAPI
    .searchingQuery()
    .then(data => {
      if (data.hits.length === 0) {
        throw newError(data.status);
      }
      refs.galleryList.innerHTML = '';
      renderQuery(data.hits);
      queryAPI.totalPage = Math.ceil(data.totalHits / 40);
      observer.observe(refs.targetEl);
      updateStatusObserver();
    })
    .catch(() => {
      refs.galleryList.innerHTML = '';
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    });
}

function queryTemplate(obj) {
  const {
    tags,
    webformatURL,
    largeImageURL,
    likes,
    views,
    comments,
    downloads,
  } = obj;

  return `<li class="photo-card">
            <a class="gallery_link" href=${largeImageURL}><img src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
            <div class="info">
              <p class="info-item">
                <b>Likes <span class ="descr">${likes}</span></b>
              </p>
              <p class="info-item">
                <b>Views <span class ="descr">${views}</span></b>
              </p>
              <p class="info-item">
                <b>Comments <span class ="descr">${comments}</span></b>
              </p>
              <p class="info-item">
                <b>Downloads <span class ="descr">${downloads}</span></b>
              </p>
            </div>
          </li>`;
}

function renderQuery(arr) {
  const markup = arr.map(queryTemplate).join('');
  refs.galleryList.insertAdjacentHTML('beforeend', markup);
}

function updateStatusObserver() {
  const isLastPage = queryAPI.page >= queryAPI.totalPage;
  if (isLastPage) {
    observer.unobserve(refs.targetEl);
    observForNotify.observe(refs.targetEl);
  }
}

const lightbox = new SimpleLightbox('.photo-card a', {
  captionsData: 'alt',
  captionDelay: 250,
});
