import express from "express";

import protect from "../middleware/authMiddleware.js";

import {
    getBooks,
    getBook,
    createBook,
    updateBook,
    deleteBook
} from "../controllers/bookController.js";

const router = express.Router();


// All routes below require JWT
router.use(protect);


router.get("/", getBooks);

router.get("/:id", getBook);

router.post("/", createBook);

router.put("/:id", updateBook);

router.delete("/:id", deleteBook);


export default router;