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

// Book add and remove
const title = document.querySelector('#book-title');
const author = document.querySelector('#book-author');
const form = document.querySelector('#form-add-book');
const bookList = document.querySelector('.book-list');

// Create classes
class Bookshelf {
  constructor(books) {
    this.books = books;
  }

  addBook(title, author) {
    const book = {
      id: Math.floor(Math.random() * 1000000),
      title: title.value,
      author: author.value,
    };

    this.books.push(book);

    if (isStorageAvailable('localStorage')) {
      localStorage.setItem('bookList', JSON.stringify(this.books));
    }
  }

  remove(id) {
    this.books = this.books.filter((book) => book.id !== parseInt(id, 10));
    localStorage.setItem('bookList', JSON.stringify(this.books));
    this.updateBookList();
  }

  updateBookList() {
    bookList.innerHTML = '';

    this.books.forEach((el) => {
      bookList.innerHTML += `<div>
      <p>"${el.title}" by ${el.author}</p>
      <button id="${el.title}" onclick="remove('${el.id}')">Remove</button>
      </div>`;
    });
  }
}

// Create a variable to contain local data
let books = [];
// If there's local data available,
if (isStorageAvailable('localStorage')) {
  const data = JSON.parse(localStorage.getItem('bookList'));
  // and if it's not empty, update it
  if (data) {
    books = JSON.parse(localStorage.getItem('bookList'));
  }
}

const newbook = new Bookshelf(books);
// On submit
form.onsubmit = () => {
  // Add the book
  newbook.addBook(title, author);
  // Update the html
  newbook.updateBookList();
  // Reset form
  form.reset();
};

// Don't forget to call the function when the page loads as well
newbook.updateBookList();

const remove = (id) => {
  newbook.remove(id);
};
