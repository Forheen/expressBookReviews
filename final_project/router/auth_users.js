const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
    
    let userswithsamename = users.filter((user) => {
    return user.username === username;
});
// Return true if any user with the same username is found, otherwise false
if (userswithsamename.length > 0) {
    return true;
} else {
    return false;
}
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });
        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
   const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization?.username;

    // Check if the user is logged in
    if (!username) {
        return res.status(401).json({ message: "User not logged in" });
    }
        // Check if the isbn is provided

    if (!isbn) {
        return res.status(401).json({ message: "Give ISBN" });
    }
    // Check if the review is provided
    if (!review) {
        return res.status(400).json({ message: "Please provide a review" });
    }

    // Find the book by ISBN
    const book = books[isbn];
    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Initialize reviews if not already present
    if (!book.reviews) {
        book.reviews = {};
    }

    // Add or update the review
    book.reviews[username] = review;

    return res.status(200).json({ message: "Review successfully added/updated", reviews: book.reviews });
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization?.username;

    // Check if the user is logged in
    if (!username) {
        return res.status(401).json({ message: "User not logged in" });
    }
    if (!isbn) {
        return res.status(401).json({ message: "Give ISBN" });
    }
    
    
    // Find the book by ISBN
    const book = books[isbn];
    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

   // Check if the review by the logged-in user exists
   if (!book.reviews || !book.reviews[username]) {
    return res.status(404).json({ message: "Review not found for the user" });
}
delete book.reviews[username];

return res.status(200).json({ message: "Review successfully deleted", reviews: book.reviews });


});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
