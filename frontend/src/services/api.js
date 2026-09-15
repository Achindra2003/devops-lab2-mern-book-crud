const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";


const request = async (endpoint, options = {}) => {

    const token = localStorage.getItem("token");


    const headers = {

        "Content-Type": "application/json",

        ...(options.headers || {})
    };


    if (token) {

        headers.Authorization = `Bearer ${token}`;
    }


    const response = await fetch(

        `${API_URL}${endpoint}`,

        {
            ...options,
            headers
        }
    );


    const data = await response.json();


    if (!response.ok) {

        throw new Error(
            data.message || "Something went wrong"
        );
    }


    return data;
};


// REGISTER
export const registerUser = (data) =>

    request("/auth/register", {

        method: "POST",

        body: JSON.stringify(data)

    });


// LOGIN
export const loginUser = (data) =>

    request("/auth/login", {

        method: "POST",

        body: JSON.stringify(data)

    });


// GET BOOKS
export const getBooks = () =>

    request("/books");


// CREATE
export const createBook = (data) =>

    request("/books", {

        method: "POST",

        body: JSON.stringify(data)

    });


// UPDATE
export const updateBook = (id, data) =>

    request(`/books/${id}`, {

        method: "PUT",

        body: JSON.stringify(data)

    });


// DELETE
export const deleteBook = (id) =>

    request(`/books/${id}`, {

        method: "DELETE"

    });