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

let localData = JSON.parse(localStorage.getItem('bookList'))

form.onsubmit = (e) => {
  //e.preventDefault();
  
  setData();
  localData = JSON.parse(localStorage.getItem('bookList'))
  addBooks()
};

let addBooks =()=>{
  localData.forEach(el => {
    bookList.innerHTML += `<div>
    <p>${el.author}</p>
    <p>${el.title}</p>
    <button>Remove</button>
    </div>`
    
  });
}
addBooks()
console.log(localData)