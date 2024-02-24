import axios from "axios";
import Notiflix from 'notiflix';
import "simplelightbox/dist/simple-lightbox.min.css";


document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('search-form');
  const gallery = document.querySelector('.gallery');
  const loadMoreBtn = document.querySelector('.load-more');
  let currentPage = 1; // Początkowa wartość strony
  const perPage = 40; // Liczba obiektów na stronie

  form.addEventListener('submit', async function(event) {
    event.preventDefault(); // Zapobiegamy domyślnej akcji przesyłania formularza

    const searchQuery = this.elements.searchQuery.value.trim(); // Pobieramy treść wyszukiwania

    if (searchQuery === '') {
      // Jeśli pole wyszukiwania jest puste, nie wykonujemy żądania
      return;
    }

    try {
      // Resetujemy wartość strony przy każdym nowym wyszukiwaniu
      currentPage = 1;

      const response = await axios.get('https://pixabay.com/api/', {
        params: {
          key: '42532362-ad0f7478c7dcbf41d5bb43b25',
          q: searchQuery,
          image_type: 'photo',
          orientation: 'horizontal',
          safesearch: true,
          page: currentPage, // Ustawiamy wartość strony
          per_page: perPage // Ustawiamy liczbę obiektów na stronie
        }
      });

      const totalHits = response.data.totalHits; // Całkowita liczba obrazków pasujących do kryteriów wyszukiwania

      if (totalHits === 0) {
        // Jeśli nie znaleziono obrazów, wyświetlamy odpowiednie powiadomienie
        Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
        return;
      }

      renderImages(response.data.hits); // Wyświetlamy obrazy w galerii
      showLoadMoreButton(); // Pokazujemy przycisk "Load more"

      if (response.data.hits.length < perPage) {
        // Jeśli liczba obiektów jest mniejsza niż liczba na stronie, ukrywamy przycisk "Load more"
        hideLoadMoreButton();
      }

   // Pokaż powiadomienie z liczbą znalezionych obrazków
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);

    } catch (error) {
      console.error('Error fetching images:', error);
      Notiflix.Notify.failure('An error occurred while fetching images. Please try again later.');
    }
  });
 
  loadMoreBtn.addEventListener('click', async function() {
    currentPage++; // Zwiększamy wartość strony

    const searchQuery = form.elements.searchQuery.value.trim(); // Pobieramy treść wyszukiwania

    try {
      const response = await axios.get('https://pixabay.com/api/', {
        params: {
          key: '42532362-ad0f7478c7dcbf41d5bb43b25',
          q: searchQuery,
          image_type: 'photo',
          orientation: 'horizontal',
          safesearch: true,
          page: currentPage, // Ustawiamy aktualną wartość strony
          per_page: perPage // Ustawiamy liczbę obiektów na stronie
        }
      });

      renderImages(response.data.hits); // Wyświetlamy nowe obrazy w galerii

      if (currentPage * perPage >= response.data.totalHits) {
        // Jeśli doszliśmy do końca wyników, ukrywamy przycisk "Load more"
        hideLoadMoreButton();
        Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
      }

    } catch (error) {
      console.error('Error fetching images:', error);
      Notiflix.Notify.failure('An error occurred while fetching more images. Please try again later.');
    }
  });

  function renderImages(images) {
    gallery.innerHTML = ''; // Wyczyść zawartość galerii przed dodaniem nowych obrazów

    images.forEach(image => {
      const card = document.createElement('div');
      card.classList.add('photo-card');

      const img = document.createElement('img');
      img.src = image.largeImageURL;
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

      gallery.appendChild(card);
    });
  }

  function showLoadMoreButton() {
    loadMoreBtn.style.display = 'block';
  }

  function hideLoadMoreButton() {
    loadMoreBtn.style.display = 'none';
  }
});
document.addEventListener('DOMContentLoaded', function () {
  const lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
  });
});