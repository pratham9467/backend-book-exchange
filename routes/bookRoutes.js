const express = require("express");
const fs = require("fs");
const path = require("path");

const bookRoutes = express.Router();

const BOOKS_FILE = path.join(__dirname, "../data/books.json");

bookRoutes.post("/books", (req, res) => {
  const { title, author, genre, location, contact, ownerEmail, bookURL } = req.body;

  if (!title || !author || !location || !contact || !ownerEmail || !bookURL) {
    throw new Error("Missing required fields.");
  }

  // Read existing books
  const books = JSON.parse(fs.readFileSync(BOOKS_FILE, "utf-8"));

  const newBook = {
    id: Date.now(),
    title,
    author,
    genre: genre || "",
    location,
    contact,
    ownerEmail,
    bookURL,
    status: "available",
  };

  books.push(newBook);

  fs.writeFileSync(BOOKS_FILE, JSON.stringify(books, null, 2));

  res.status(201).json({ message: "Book listed successfully!", book: newBook });
});

// GET /books — Fetch all listed books
bookRoutes.get("/books", (req, res) => {
  try {
    const { title, location } = req.query;

    let books = JSON.parse(fs.readFileSync(BOOKS_FILE, "utf-8"));

    if (title) {
      books = books.filter((book) => book.title.toLowerCase().includes(title.toLowerCase()));
    }

    if (location) {
      books = books.filter((book) => book.location.toLowerCase().includes(location.toLowerCase()));
    }

    res.json(books);
  } catch (err) {
    console.error("Error reading books:", err);
    res.status(500).json({ message: "Failed to fetch books." });
  }
});

module.exports = bookRoutes;
