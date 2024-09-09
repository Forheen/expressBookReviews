const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req,res) => {
    const username=req.body.username;
    const password=req.body.password;
    if(!username || !password){
         return res.status(400).json({message: "Please enter username and password"});
    }
    // Check if the username is already taken
    if (isValid(username)) {
        return res.status(400).json({ message: "User already registered" });
    }

    // Register the new user
    users.push({ username, password });

    return res.status(200).json({ message: "Customer successfully registered. Now you can log in!" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    // Create a Promise to simulate fetching books from a local source
    let fetchBooksPromise = new Promise((resolve, reject) => {
        // Simulate asynchronous operation
        setTimeout(() => {
            resolve(books); // Resolve the promise with the local books data
        }, 1000); // 1 second delay to mimic async behavior
    });

    // Handle the Promise
    fetchBooksPromise
        .then(booksData => {
            // Send the list of books as a JSON response
            res.status(200).json(booksData);
        })
        .catch(error => {
            // Send an error response if the promise was rejected
            res.status(500).json({ message: "Error fetching books", error: error.message });
        });  

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;

    // Create a Promise to simulate fetching the book from the local data source
    let fetchBookPromise = new Promise((resolve, reject) => {
        // Simulate asynchronous operation
        setTimeout(() => {
            const book = books[isbn];
            if (book) {
                resolve(book); // Resolve the promise with the book data
            } else {
                reject(new Error("Book not found")); // Reject the promise if the book is not found
            }
        }, 1000); // 1 second delay to mimic async behavior
    });

    // Handle the Promise
    fetchBookPromise
        .then(bookData => {
            // Send the book data as a JSON response
            res.status(200).json(bookData);
        })
        .catch(error => {
            // Send an error response if the promise was rejected
            res.status(404).json({ message: error.message });
        });
});
  
// Get book details based on author
public_users.get('/author/:author', (req, res) => {
    const author = req.params.author;

    // Create a Promise to simulate fetching books by author from the local data source
    let fetchBooksByAuthorPromise = new Promise((resolve, reject) => {
        // Simulate asynchronous operation
        setTimeout(() => {
            let booksByAuthor = [];
            for (let key in books) {
                if (books[key].author === author) {
                    booksByAuthor.push(books[key]);
                }
            }

            if (booksByAuthor.length > 0) {
                resolve(booksByAuthor); // Resolve the promise with the books by author
            } else {
                reject(new Error("No books found by this author")); // Reject the promise if no books are found
            }
        }, 5000); // 1 second delay to mimic async behavior
    });

    // Handle the Promise
    fetchBooksByAuthorPromise
        .then(booksByAuthor => {
            // Send the list of books by the author as a JSON response
            res.status(200).json({ booksByAuthor });
        })
        .catch(error => {
            // Send an error response if the promise was rejected
            res.status(404).json({ message: error.message });
        });
});


// Get all books based on title
public_users.get('/title/:title', (req, res) => {
    const title = req.params.title;

    // Create a Promise to simulate fetching books by title from the local data source
    let fetchBooksByTitlePromise = new Promise((resolve, reject) => {
        // Simulate asynchronous operation
        setTimeout(() => {
            let booksByTitle = [];
            for (let key in books) {
                if (books[key].title === title) {
                    booksByTitle.push(books[key]);
                }
            }

            if (booksByTitle.length > 0) {
                resolve(booksByTitle); // Resolve the promise with the books by title
            } else {
                reject(new Error("No books found with this title")); // Reject the promise if no books are found
            }
        }, 1000); // 1 second delay to mimic async behavior
    });

    // Handle the Promise
    fetchBooksByTitlePromise
        .then(booksByTitle => {
            // Send the list of books by the title as a JSON response
            res.status(200).json({ booksByTitle });
        })
        .catch(error => {
            // Send an error response if the promise was rejected
            res.status(404).json({ message: error.message });
        });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn= req.params.isbn;
  const book= books[isbn];
      if(book){
           return res.status(200).json({review:book.review});
      }
      else{
      return res.status(404).json({message: "Book not found"});
      }});

module.exports.general = public_users;
