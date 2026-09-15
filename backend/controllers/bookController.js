import Book from "../models/Book.js";


// GET ALL BOOKS
export const getBooks = async (req, res) => {

    try {

        const books = await Book.find({
            createdBy: req.user.id
        });

        res.json(books);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};


// GET ONE BOOK
export const getBook = async (req, res) => {

    try {

        const book = await Book.findOne({
            _id: req.params.id,
            createdBy: req.user.id
        });

        if (!book) {

            return res.status(404).json({
                message: "Book not found"
            });
        }

        res.json(book);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};


// CREATE BOOK
export const createBook = async (req, res) => {

    try {

        const {
            title,
            author,
            genre,
            publishedYear,
            price,
            isbn
        } = req.body;

        const book = await Book.create({

            title,
            author,
            genre,
            publishedYear,
            price,
            isbn,

            createdBy: req.user.id
        });

        res.status(201).json(book);

    } catch (error) {

        res.status(400).json({
            message: error.message
        });
    }
};


// UPDATE BOOK
export const updateBook = async (req, res) => {

    try {

        const book = await Book.findOneAndUpdate(

            {
                _id: req.params.id,
                createdBy: req.user.id
            },

            req.body,

            {
                new: true,
                runValidators: true
            }
        );

        if (!book) {

            return res.status(404).json({
                message: "Book not found"
            });
        }

        res.json(book);

    } catch (error) {

        res.status(400).json({
            message: error.message
        });
    }
};


// DELETE BOOK
export const deleteBook = async (req, res) => {

    try {

        const book = await Book.findOneAndDelete({

            _id: req.params.id,

            createdBy: req.user.id
        });

        if (!book) {

            return res.status(404).json({
                message: "Book not found"
            });
        }

        res.json({
            message: "Book deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};