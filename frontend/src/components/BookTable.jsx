const BookTable = ({ books, onEdit, onDelete }) => {

    return (
        <div className="bg-white rounded-xl shadow overflow-hidden">

            {/* Header */}
            <div className="px-6 py-5 border-b">
                <h2 className="text-2xl font-bold">
                    Books ({books.length})
                </h2>
            </div>


            {/* No Books */}
            {books.length === 0 ? (

                <div className="text-center py-16 text-gray-500">

                    <p className="text-lg">
                        No books available.
                    </p>

                    <p className="mt-2">
                        Add your first book above.
                    </p>

                </div>

            ) : (

                /* Table */
                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead className="bg-gray-100">

                            <tr>

                                <th className="px-6 py-3 text-left">
                                    #
                                </th>

                                <th className="px-6 py-3 text-left">
                                    Title
                                </th>

                                <th className="px-6 py-3 text-left">
                                    Author
                                </th>
                                <th className="px-6 py-3 text-left">
                                    ISBN
                                </th>

                                <th className="px-6 py-3 text-left">
                                    Genre
                                </th>

                                <th className="px-6 py-3 text-left">
                                    Year
                                </th>

                                <th className="px-6 py-3 text-left">
                                    Price
                                </th>

                                <th className="px-6 py-3 text-center">
                                    Actions
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {books.map((book, index) => (

                                <tr
                                    key={book._id}
                                    className="border-t hover:bg-gray-50"
                                >

                                    {/* Number */}

                                    <td className="px-6 py-4">
                                        {index + 1}
                                    </td>


                                    {/* Title */}

                                    <td className="px-6 py-4 font-medium">
                                        {book.title}
                                    </td>


                                    {/* Author */}

                                    <td className="px-6 py-4">
                                        {book.author}
                                    </td>

                                    <td className="px-6 py-4">
    {book.isbn}
</td>


                                    {/* Genre */}

                                    <td className="px-6 py-4">

                                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                                            {book.genre}
                                        </span>

                                    </td>


                                    {/* Year */}

                                    <td className="px-6 py-4">
                                        {book.publishedYear}
                                    </td>


                                    {/* Price */}

                                    <td className="px-6 py-4">
                                        ₹{book.price}
                                    </td>


                                    {/* Actions */}

                                    <td className="px-6 py-4">

                                        <div className="flex justify-center gap-2">

                                            <button
                                                onClick={() => onEdit(book)}
                                                className="bg-yellow-500 text-white px-3 py-1.5 rounded-lg hover:bg-yellow-600"
                                            >
                                                Edit
                                            </button>


                                            <button
                                                onClick={() => onDelete(book._id)}
                                                className="bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600"
                                            >
                                                Delete
                                            </button>

                                        </div>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            )}

        </div>
    );
};

export default BookTable;