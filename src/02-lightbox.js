import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { galleryItems } from './gallery-items.js';
// Change code below this line
const galleryElement = document.querySelector('.gallery');
  const allGalleryItems = galleryItems.map(image => 
    `<li class = "gallery_item">
    <a class="gallery__item" href="${image.original}">
    <img
        class="gallery__image"
        src="${image.preview}" 
        alt="${image.description}"
        data-source="${image.original}"
    >
    </img>
    </a>
    </li>`
  ).join('');

galleryElement.insertAdjacentHTML('afterbegin', allGalleryItems); 

  document.addEventListener('DOMContentLoaded', function () {
      const gallery = new SimpleLightbox('.gallery a', { /* opcje konfiguracji */
 captionsData: 'alt',
    captionDelay: 250,
      });
  });
console.log(galleryItems);
