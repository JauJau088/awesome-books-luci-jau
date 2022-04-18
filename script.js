// Form local storage availability checker function
function isStorageAvailable(type) {
  let storage;
  try {
    storage = window[type];
    const x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return e instanceof DOMException && (
      // 1) everything except Firefox
      // 2) Firefox
      // test name field too, because code might not be present
      // 3) everything except Firefox
      // 4) Firefox
      // 5) acknowledge QuotaExceededError only if there's something already stored
      e.code === 22 || e.code === 1014 || e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') && (storage && storage.length !== 0);
  }
}

//
const title = document.querySelector('#book-title');
const author = document.querySelector('#book-author');
const form = document.querySelector('#form-add-book');
const bookList = document.querySelector('.book-list');

let books = [];

// Function: save data to local storage
const setData = () => {
  let book = {
    'title': title.value,
    'author': author.value,
  };

  books.push(book);

  if (isStorageAvailable('localStorage')) {
    localStorage.setItem('bookList', JSON.stringify(books));
  }
};

// Get local data
let localData = JSON.parse(localStorage.getItem('bookList'));

// On submit
form.onsubmit = (e) => {
  //e.preventDefault();
  
  setData();
  localData = JSON.parse(localStorage.getItem('bookList'));
  addBooks();
  console.log(localData);
};

// Function: Add books to html
let addBooks = () => {
  bookList.innerHTML = ``;

  localData.forEach(el => {
    bookList.innerHTML += `<div>
    <p>${el.title}</p>
    <p>${el.author}</p>
    <button id="${el.title}" class="remove">Remove</button>
    </div>`
  });
}

addBooks();

const button = document.querySelectorAll('.remove');

button.forEach((el) => el.addEventListener('click', (e) => {
  // localData = localData.filter(book => book.title === e.target.id);

  if (isStorageAvailable('localStorage')) {
    localStorage.setItem('bookList', JSON.stringify(books.filter(book => book.title === e.target.id)));
  }

  console.log(localData);
  // location.reload();
  addBooks();
}));