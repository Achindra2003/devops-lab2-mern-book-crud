import { useEffect, useState } from "react";

import BookForm from "../components/BookForm";

import {
    getBooks,
    createBook,
    updateBook,
    deleteBook
} from "../services/api";


const Books = () => {

    const [books, setBooks] = useState([]);

    const [selectedBook, setSelectedBook] =
        useState(null);

    const [message, setMessage] =
        useState("");

    const [error, setError] =
        useState("");


    // GET BOOKS
    const loadBooks = async () => {

        try {

            const data = await getBooks();

            setBooks(data);

        } catch (error) {

            setError(error.message);
        }
    };


    useEffect(() => {

        getBooks()
            .then((data) => {
                setBooks(data);
            })
            .catch((err) => {
                setError(err.message);
            });

    }, []);


    // CREATE / UPDATE
    const handleSave = async (bookData) => {

        try {

            setError("");

            setMessage("");


            if (selectedBook) {

                await updateBook(
                    selectedBook._id,
                    bookData
                );

                setMessage(
                    "Book updated successfully"
                );

                setSelectedBook(null);

            } else {

                await createBook(bookData);

                setMessage(
                    "Book added successfully"
                );
            }


            await loadBooks();

        } catch (error) {

            setError(error.message);

            throw error;
        }
    };


    // DELETE
    const handleDelete = async (id) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this book?"
            );


        if (!confirmDelete) {
            return;
        }


        try {

            await deleteBook(id);

            setBooks(
                books.filter(
                    book => book._id !== id
                )
            );

            setMessage(
                "Book deleted successfully"
            );

        } catch (error) {

            setError(error.message);
        }
    };


    return (

        <div className="min-h-screen bg-slate-100">

            <div className="max-w-7xl mx-auto p-6">

                <div className="mb-6">

                    <h1 className="text-3xl font-bold">
                        Book Management
                    </h1>

                    <p className="text-gray-500">
                        Add, view, update and delete books
                    </p>

                </div>


                {/* SUCCESS MESSAGE */}

                {message && (

                    <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-5">
                        {message}
                    </div>

                )}


                {/* ERROR MESSAGE */}

                {error && (

                    <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-5">
                        {error}
                    </div>

                )}


                {/* BOOK FORM */}

                <BookForm

                    selectedBook={selectedBook}

                    onSave={handleSave}

                    onCancel={() =>
                        setSelectedBook(null)
                    }

                />


                {/* BOOK TABLE */}

                <div className="bg-white rounded-xl shadow overflow-hidden">

                    <div className="p-5 border-b">

                        <h2 className="text-xl font-bold">
                            Books ({books.length})
                        </h2>

                    </div>


                    {books.length === 0 ? (

                        <div className="p-10 text-center text-gray-500">

                            No books available.

                            <br />

                            Add your first book above.

                        </div>

                    ) : (

                        <div className="overflow-x-auto">

                            <table className="w-full">

                                <thead className="bg-slate-800 text-white">

                                    <tr>

                                        <th className="p-4 text-left">
                                            #
                                        </th>

                                        <th className="p-4 text-left">
                                            Title
                                        </th>

                                        <th className="p-4 text-left">
                                            Author
                                        </th>

                                        <th className="p-4 text-left">
                                            Genre
                                        </th>

                                        <th className="p-4 text-left">
                                            Year
                                        </th>

                                        <th className="p-4 text-left">
                                            Price
                                        </th>

                                        <th className="p-4 text-left">
                                            Actions
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {books.map(
                                        (book, index) => (

                                            <tr
                                                key={book._id}
                                                className="border-b hover:bg-gray-50"
                                            >

                                                <td className="p-4">
                                                    {index + 1}
                                                </td>

                                                <td className="p-4 font-medium">
                                                    {book.title}
                                                </td>

                                                <td className="p-4">
                                                    {book.author}
                                                </td>

                                                <td className="p-4">
                                                    {book.genre}
                                                </td>

                                                <td className="p-4">
                                                    {book.publishedYear}
                                                </td>

                                                <td className="p-4">
                                                    ₹{book.price}
                                                </td>

                                                <td className="p-4">

                                                    <div className="flex gap-2">

                                                        <button

                                                            onClick={() =>
                                                                setSelectedBook(
                                                                    book
                                                                )
                                                            }

                                                            className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                                                        >

                                                            Edit

                                                        </button>


                                                        <button

                                                            onClick={() =>
                                                                handleDelete(
                                                                    book._id
                                                                )
                                                            }

                                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                                        >

                                                            Delete

                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            </div>

        </div>
    );
};


export default Books;