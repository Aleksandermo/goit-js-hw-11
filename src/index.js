import axios from "axios";
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('search-form');
  const gallery = document.querySelector('.gallery');
  const loadMoreBtn = document.querySelector('.load-more');
  let currentPage = 1;
  const perPage = 40; 

  const lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
  });

  form.addEventListener('submit', async function(event) {
    event.preventDefault(); 

    const searchQuery = this.elements.searchQuery.value.trim(); 

    if (searchQuery === '') {
      return;
    }

    try {
      currentPage = 1;

      const response = await axios.get('https://pixabay.com/api/', {
        params: {
          key: '42532362-ad0f7478c7dcbf41d5bb43b25',
          q: searchQuery,
          image_type: 'photo',
          orientation: 'horizontal',
          safesearch: true,
          page: currentPage, 
          per_page: perPage 
        }
      });
      const totalHits = response.data.totalHits; 

      if (totalHits === 0) {
        Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
        return;
      }
      
      renderImages(response.data.hits); 
      /*
      showLoadMoreButton(); 
      if (response.data.hits.length < perPage) {
        hideLoadMoreButton();
      }
      */
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);

      smoothScrollToTop();

    } catch (error) {
      console.error('Error fetching images:', error);
      Notiflix.Notify.failure('An error occurred while fetching images. Please try again later.');
    }
  });
 
  loadMoreBtn.addEventListener('click', async function() {
    currentPage++; 

    const searchQuery = form.elements.searchQuery.value.trim();

    try {
      const response = await axios.get('https://pixabay.com/api/', {
        params: {
          key: '42532362-ad0f7478c7dcbf41d5bb43b25',
          q: searchQuery,
          image_type: 'photo',
          orientation: 'horizontal',
          safesearch: true,
          page: currentPage, 
          per_page: perPage 
        }
      });

      renderImages(response.data.hits);
      /*
      if (currentPage * perPage >= response.data.totalHits) {
        hideLoadMoreButton();
        Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
      }
      */
    } catch (error) {
      console.error('Error fetching images:', error);
      Notiflix.Notify.failure('An error occurred while fetching more images. Please try again later.');
    }
  });

  function renderImages(images) {
  images.forEach(image => {
    const link = document.createElement('a'); 
    link.href = image.largeImageURL;
    link.dataset.lightbox = 'gallery'; 

    const card = document.createElement('div');
    card.classList.add('photo-card');

    const img = document.createElement('img');
    img.src = image.webformatURL;
    img.alt = image.tags;
    img.loading = 'lazy';

    const info = document.createElement('div');
    info.classList.add('info');

    const likes = document.createElement('p');
    likes.classList.add('info-item');
    likes.innerHTML = `<b>Likes:</b> ${image.likes}`;

    const views = document.createElement('p');
    views.classList.add('info-item');
    views.innerHTML = `<b>Views:</b> ${image.views}`;

    const comments = document.createElement('p');
    comments.classList.add('info-item');
    comments.innerHTML = `<b>Comments:</b> ${image.comments}`;

    const downloads = document.createElement('p');
    downloads.classList.add('info-item');
    downloads.innerHTML = `<b>Downloads:</b> ${image.downloads}`;

    info.appendChild(likes);
    info.appendChild(views);
    info.appendChild(comments);
    info.appendChild(downloads);

    card.appendChild(img);
    card.appendChild(info);

    link.appendChild(card);

    gallery.appendChild(link);
  });

  lightbox.refresh();
}

  function smoothScrollToTop() {
    const { height: cardHeight } = document.querySelector(".gallery").firstElementChild.getBoundingClientRect();
    window.scrollBy({
      top: cardHeight * 2,
      behavior: "smooth",
    });
  }
   // Obsługa nieskończonego przewijania
  window.addEventListener('scroll', async function() {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      currentPage++; 

      const searchQuery = form.elements.searchQuery.value.trim();

      try {
        const response = await axios.get('https://pixabay.com/api/', {
          params: {
            key: '42532362-ad0f7478c7dcbf41d5bb43b25',
            q: searchQuery,
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: true,
            page: currentPage, 
            per_page: perPage 
          }
        });

        renderImages(response.data.hits);

        if (currentPage * perPage >= response.data.totalHits) {
          //hideLoadMoreButton();
          Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
        }
      } catch (error) {
        console.error('Error fetching images:', error);
        Notiflix.Notify.failure('An error occurred while fetching more images. Please try again later.');
      }
    }
  });
  /*
  function showLoadMoreButton() {
    loadMoreBtn.style.display = 'block';
  }
  function hideLoadMoreButton() {
    loadMoreBtn.style.display = 'none';
  }
*/
});
