import { fetchImages } from '../js/fetchImages.js';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const input = document.querySelector('.search-form-input');
const btnSearch = document.querySelector('.search-form-button');
const gallery = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.load-more');
let gallerySimpleLightbox = new SimpleLightbox('.gallery a');

//за замовчуванням LoadMore - повинен бути схований
btnLoadMore.style.display = 'none';

//кількість сторінок за замовченням
let pageNumber = 1;

btnSearch.addEventListener('click', e => {
  e.preventDefault();
  cleanGallery();
  const trimmedValue = input.value.trim();
  if (trimmedValue !== '') {
    fetchImages(trimmedValue, pageNumber).then(foundDate => {
      console.log('foundDate', foundDate);
      console.log('foundDate.hits.length', foundDate.hits.length);

      if (foundDate.hits.length === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        renderImageList(foundDate.hits);
        Notiflix.Notify.success(
          `Congratulation!We found ${foundDate.totalHits} images`
        );
        if (foundDate.hits.length === foundDate.totalHits) {
          Notiflix.Notify.info(
            "We're sorry, but you've reached the end of search results."
          );
          btnLoadMore.style.display = 'none';
        } else {
          btnLoadMore.style.display = 'block';
        }
        gallerySimpleLightbox.refresh();
      }
    });
  }
});

btnLoadMore.addEventListener('click', () => {
  pageNumber += 1;
  const trimmedValue = input.value.trim();
  btnLoadMore.style.display = 'none';
  fetchImages(trimmedValue, pageNumber).then(foundDate => {
    if (foundDate.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    // if (foundDate.hits.length <= foundDate.totalHits) {
    //   Notiflix.Notify.info(
    //     "We're sorry, but you've reached the end of search results."
    //   );
    // }
    else {
      renderImageList(foundDate.hits);
      Notiflix.Notify.success(`Hooray!We found ${foundDate.totalHits} images`);
      btnLoadMore.style.display = 'block';
    }
  });
});

function renderImageList(images) {
  console.log(images, 'images');
  const markup = images
    .map(image => {
      console.log('img', image);
      return `<div class="photo-card">
    <a href="${image.largeImageURL}">
  <img class="photo" src="${image.webformatURL}" alt="${image.tags}" title="${image.tags}" loading="lazy" /></a>

  <div class="info">
    <p class="info-item">
    <b>Likes</b> <span class="info-item-api">${image.likes}</span>
    </p>

    <p class="info-item">
    <b>Views</b> <span class="info-item-api">${image.views}</span>
    </p>

    <p class="info-item">
      <b>Comments</b> <span class="info-item-api">${image.comments}</span>
    </p>

    <p class="info-item">
      <b>Downloads</b> <span class="info-item-api">${image.downloads}</span>
    </p>
  </div>
</div>`;
    })
    .join('');
  gallery.innerHTML += markup;
}

function cleanGallery() {
  gallery.innerHTML = '';
  pageNumber = 1;
  btnLoadMore.style.display = 'none';
}
