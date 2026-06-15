const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req, res) => {

  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {

    if (!isValid(username)) {

      users.push({
        username: username,
        password: password
      });

      return res.status(200).json({
        message: "User successfully registered. Now you can login"
      });

    } else {

      return res.status(404).json({
        message: "User already exists!"
      });

    }

  }

  return res.status(404).json({
    message: "Unable to register user."
  });

});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    return res.send(JSON.stringify(books[isbn], null, 4));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  const bookKeys = Object.keys(books);
  let authorBooks = {};

  bookKeys.forEach(key => {
    if (books[key].author === author) {
      authorBooks[key] = books[key];
    }
  });

  return res.send(JSON.stringify(authorBooks, null, 4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const bookKeys = Object.keys(books);
    let titleBooks = {};

    bookKeys.forEach(key => {
        if (books[key].title === title) {
            titleBooks[key] = books[key];
        }
    });

    return res.send(JSON.stringify(titleBooks, null, 4));

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    return res.send(JSON.stringify(books[isbn].reviews, null, 4));

});

// Get all books using async-await with Axios
public_users.get('/asyncbooks', async function (req, res) {

    try {
        const response = await axios.get('http://localhost:5000/');
        return res.send(response.data);
    }
    catch (error) {
        return res.status(500).json({
            message: "Error fetching books"
        });
    }

});

// Get book details based on ISBN using Axios and Async-Await
public_users.get('/asyncisbn/:isbn', async function (req, res) {

    try {
        const isbn = req.params.isbn;

        const response = await axios.get(
            `http://localhost:5000/isbn/${isbn}`
        );

        return res.send(response.data);

    } catch (error) {

        return res.status(500).json({
            message: "Error fetching book by ISBN"
        });

    }

});

// Get book details based on Author using Axios and Async-Await
public_users.get('/asyncauthor/:author', async function (req, res) {

    try {

        const author = req.params.author;

        const response = await axios.get(
            `http://localhost:5000/author/${author}`
        );

        return res.send(response.data);

    } catch (error) {

        return res.status(500).json({
            message: "Error fetching books by author"
        });

    }

});

// Get book details based on Title using Axios and Async-Await
public_users.get('/asynctitle/:title', async function (req, res) {

    try {

        const title = req.params.title;

        const response = await axios.get(
            `http://localhost:5000/title/${title}`
        );

        return res.send(response.data);

    } catch (error) {

        return res.status(500).json({
            message: "Error fetching books by title"
        });

    }

});

module.exports.general = public_users;
