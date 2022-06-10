const INCOMPLETE_BOOK = "incompleteBookshelfList";
const COMPLETE_BOOK = "completeBookshelfList";

function addBook() {
  const idBook = +new Date();
  const inputBookTitle = document.getElementById("inputBookTitle").value;
  const inputBookAuthor = document.getElementById("inputBookAuthor").value;
  const inputBookYear = document.getElementById("inputBookYear").value;
  const inputBookIsComplete = document.getElementById(
    "inputBookIsComplete"
  ).checked;

  const book = createBook(
    idBook,
    inputBookTitle,
    inputBookAuthor,
    inputBookYear,
    inputBookIsComplete
  );
  const bookObject = composeBookObject(
    idBook,
    inputBookTitle,
    inputBookAuthor,
    inputBookYear,
    inputBookIsComplete
  );

  books.push(bookObject);

  if (inputBookIsComplete) {
    document.getElementById(COMPLETE_BOOK).append(book);
  } else {
    document.getElementById(INCOMPLETE_BOOK).append(book);
  }

  updateJson();
}

const checkbox = document.querySelector("#inputBookIsComplete");
const button = document.querySelector("#bookSubmit span");
checkbox.addEventListener("change", function () {
  if (checkbox.checked) {
    button.innerText = "selesai dibaca";
  } else {
    button.innerText = "belum selesai dibaca";
  }
});

function createBook(
  idBook,
  inputBookTitle,
  inputBookAuthor,
  inputBookYear,
  inputBookIsComplete
) {
  const book = document.createElement("article");
  book.setAttribute("id", idBook);
  book.classList.add("card", "my-2");

  const image = document.createElement("img");
  image.classList.add("w-100");
  image.src = "./assets/images/book-img.png";

  const thumbnail = document.createElement("div");
  thumbnail.classList.add("thumb", "w-25");

  thumbnail.append(image);

  const bookTitle = document.createElement("h4");
  bookTitle.classList.add("my-0");
  bookTitle.innerText = inputBookTitle;

  const bookAuthor = document.createElement("p");
  bookAuthor.classList.add("my-0");
  bookAuthor.innerText = inputBookAuthor;

  const bookYear = document.createElement("p");
  bookYear.innerText = inputBookYear;

  const cardContainer = document.createElement("div");
  cardContainer.classList.add("card-body", "d-flex", "align-items-center");

  const bookContent = document.createElement("div");
  bookContent.classList.add("book-desc", "w-50");

  const buttonAction = addButton(inputBookIsComplete, idBook);
  buttonAction.classList.add("ms-auto");

  bookContent.append(bookTitle, bookAuthor, bookYear);
  cardContainer.append(thumbnail);
  cardContainer.append(bookContent);
  cardContainer.append(buttonAction);
  book.append(cardContainer);

  return book;
}

function addButton(inputBookIsComplete, idBook) {
  const buttonActions = document.createElement("div");

  const buttonDelete = createButtonDelete(idBook);
  const buttonRead = createButtonRead(idBook);
  const buttonUndo = createButtonUndo(idBook);

  buttonActions.append(buttonDelete);

  if (inputBookIsComplete) {
    buttonActions.append(buttonUndo);
  } else {
    buttonActions.append(buttonRead);
  }

  return buttonActions;
}

function createButtonDelete(idBook) {
  const buttonDelete = document.createElement("button");
  buttonDelete.classList.add("btn", "btn-sm", "btn-outline-danger", "mx-1");
  buttonDelete.innerHTML = '<i class="fa-solid fa-trash-can"></i>';

  buttonDelete.addEventListener("click", function () {
    const cardParent = document.getElementById(idBook);
    const bookTitle = cardParent.querySelector(
      ".book-desc.w-50 > h4"
    ).innerText;
    let confirmation = confirm(`Hapus buku "${bookTitle}" ?`);

    if (confirmation) {
      const cardParent = document.getElementById(idBook);
      cardParent.addEventListener("eventDelete", function (event) {
        event.target.remove();
      });
      cardParent.dispatchEvent(new Event("eventDelete"));

      deleteBookFromJson(idBook);
      updateJson();
    }
  });

  return buttonDelete;
}

function createButtonRead(idBook) {
  const action = document.createElement("button");
  action.classList.add("btn", "btn-sm", "btn-outline-success");
  action.innerHTML = '<i class="fa-solid fa-check"></i>';

  action.addEventListener("click", function () {
    const cardParent = document.getElementById(idBook);

    const bookTitle = cardParent.querySelector(
      ".book-desc.w-50 > h4"
    ).innerText;
    const bookAuthor = cardParent.querySelectorAll(".book-desc.w-50 > p")[0]
      .innerText;
    const bookYear = cardParent.querySelectorAll(".book-desc.w-50 > p")[1]
      .innerText;

    cardParent.remove();

    const book = createBook(idBook, bookTitle, bookAuthor, bookYear, true);
    document.getElementById(COMPLETE_BOOK).append(book);

    deleteBookFromJson(idBook);
    const bookObject = composeBookObject(
      idBook,
      bookTitle,
      bookAuthor,
      bookYear,
      true
    );

    books.push(bookObject);
    updateJson();
  });

  return action;
}

function createButtonUndo(idBook) {
  const action = document.createElement("button");
  action.classList.add("btn", "btn-sm", "btn-outline-secondary");
  action.innerHTML = '<i class="fa-solid fa-arrow-rotate-right"></i>';

  action.addEventListener("click", function () {
    const cardParent = document.getElementById(idBook);

    const bookTitle = cardParent.querySelector(
      ".book-desc.w-50 > h4"
    ).innerText;
    const bookAuthor = cardParent.querySelectorAll(".book-desc.w-50 > p")[0]
      .innerText;
    const bookYear = cardParent.querySelectorAll(".book-desc.w-50 > p")[1]
      .innerText;

    cardParent.remove();

    const book = createBook(idBook, bookTitle, bookAuthor, bookYear, false);
    document.getElementById(INCOMPLETE_BOOK).append(book);

    deleteBookFromJson(idBook);
    const bookObject = composeBookObject(
      idBook,
      bookTitle,
      bookAuthor,
      bookYear,
      false
    );

    books.push(bookObject);
    updateJson();
  });

  return action;
}

function bookSearch(keyword) {
  const filter = keyword.toUpperCase();
  const titles = document.getElementsByTagName("h4");

  for (let i = 0; i < titles.length; i++) {
    const titlesText = titles[i].textContent || titles[i].innerText;

    if (titlesText.toUpperCase().indexOf(filter) > -1) {
      titles[i].closest(".card").style.display = "";
    } else {
      titles[i].closest(".card").style.display = "none";
    }
  }
}
