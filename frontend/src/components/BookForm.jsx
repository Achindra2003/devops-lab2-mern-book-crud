import { useEffect } from "react";
import { useForm } from "react-hook-form";

const BookForm = ({
    selectedBook,
    onSave,
    onCancel
}) => {

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues: {
            title: "",
            author: "",
            isbn:"",
            genre: "",
            publishedYear: "",
            price: ""
        }
    });


    // When Edit button is clicked
    useEffect(() => {

        if (selectedBook) {

            reset({
                title: selectedBook.title,
                author: selectedBook.author,
                isbn:selectedBook.isbn,
                genre: selectedBook.genre,
                publishedYear: selectedBook.publishedYear,
                price: selectedBook.price
            });

        } else {

            reset({
                title: "",
                author: "",
                isbn:"",
                genre: "",
                publishedYear: "",
                price: ""
            });

        }

    }, [selectedBook, reset]);


    const submitHandler = async (data) => {

        await onSave({
            ...data,
            publishedYear: Number(data.publishedYear),
            price: Number(data.price)
        });

        reset();

    };


    return (

        <div className="bg-white rounded-xl shadow p-6 mb-8">

            <h2 className="text-2xl font-bold mb-5">

                {selectedBook
                    ? "✏️ Edit Book"
                    : "➕ Add New Book"}

            </h2>


            <form
                onSubmit={handleSubmit(submitHandler)}
                className="grid grid-cols-1 md:grid-cols-2 gap-5"
            >

                {/* TITLE */}

                <div>

                    <label className="block font-medium mb-1">
                        Book Title
                    </label>

                    <input
                        type="text"
                        placeholder="Enter book title"

                        {...register("title", {
                            required: "Title is required"
                        })}

                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    {errors.title && (

                        <p className="text-red-500 text-sm mt-1">
                            {errors.title.message}
                        </p>

                    )}

                </div>


                {/* AUTHOR */}

                <div>

                    <label className="block font-medium mb-1">
                        Author
                    </label>

                    <input
                        type="text"
                        placeholder="Enter author name"

                        {...register("author", {
                            required: "Author is required"
                        })}

                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    {errors.author && (

                        <p className="text-red-500 text-sm mt-1">
                            {errors.author.message}
                        </p>

                    )}

                </div>

                <div>

    <label className="block font-medium mb-1">
        ISBN
    </label>

    <input
        type="text"
        placeholder="Enter ISBN"
        {...register("isbn", {
            required: "ISBN is required",
            minLength: {
                value: 10,
                message: "ISBN must be at least 10 characters"
            }
        })}
        className="w-full border border-gray-300 rounded-lg px-4 py-2"
    />

    {errors.isbn && (
        <p className="text-red-500 text-sm mt-1">
            {errors.isbn.message}
        </p>
    )}

</div>


                {/* GENRE */}

                <div>

                    <label className="block font-medium mb-1">
                        Genre
                    </label>

                    <select
                        {...register("genre", {
                            required: "Genre is required"
                        })}

                        className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    >

                        <option value="">
                            Select Genre
                        </option>

                        <option value="Fiction">
                            Fiction
                        </option>

                        <option value="Science">
                            Science
                        </option>

                        <option value="Technology">
                            Technology
                        </option>

                        <option value="Biography">
                            Biography
                        </option>

                        <option value="History">
                            History
                        </option>

                        <option value="Fantasy">
                            Fantasy
                        </option>

                    </select>

                    {errors.genre && (

                        <p className="text-red-500 text-sm mt-1">
                            {errors.genre.message}
                        </p>

                    )}

                </div>


                {/* YEAR */}

                <div>

                    <label className="block font-medium mb-1">
                        Published Year
                    </label>

                    <input
                        type="number"
                        placeholder="2026"

                        {...register("publishedYear", {
                            required: "Published year is required",
                            min: {
                                value: 1000,
                                message: "Enter a valid year"
                            },
                            max: {
                                value: 2100,
                                message: "Enter a valid year"
                            }
                        })}

                        className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    />

                    {errors.publishedYear && (

                        <p className="text-red-500 text-sm mt-1">
                            {errors.publishedYear.message}
                        </p>

                    )}

                </div>


                {/* PRICE */}

                <div>

                    <label className="block font-medium mb-1">
                        Price (₹)
                    </label>

                    <input
                        type="number"
                        step="0.01"
                        placeholder="499"

                        {...register("price", {
                            required: "Price is required",
                            min: {
                                value: 0,
                                message: "Price cannot be negative"
                            }
                        })}

                        className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    />

                    {errors.price && (

                        <p className="text-red-500 text-sm mt-1">
                            {errors.price.message}
                        </p>

                    )}

                </div>


                {/* BUTTONS */}

                <div className="md:col-span-2 flex gap-3">

                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >

                        {selectedBook
                            ? "Update Book"
                            : "Add Book"}

                    </button>


                    {selectedBook && (

                        <button
                            type="button"
                            onClick={onCancel}
                            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
                        >
                            Cancel
                        </button>

                    )}

                </div>

            </form>

        </div>
    );
};

export default BookForm;