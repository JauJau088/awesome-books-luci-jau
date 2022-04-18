const title = document.querySelector('#book-title');
const author = document.querySelector('#book-author');
const form = document.querySelector('#form-add-book');
const bookList = document.querySelector('.book-list');

let books = [];

form.onsubmit = (e) => {
  let book = {
    'title': title.value,
    'author': author.value,
  };

  e.preventDefault();

  console.log(book);
};