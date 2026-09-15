import { Link } from "react-router-dom";

const Home = () => {
    const token = localStorage.getItem("token");

    return (
        <div className="min-h-[90vh] flex items-center justify-center bg-slate-100">

            <div className="text-center max-w-2xl px-6">

                <h1 className="text-5xl font-bold text-slate-800 mb-6">
                    📚 Book Management System
                </h1>

                <p className="text-lg text-gray-600 mb-8">
                    A complete MERN Stack CRUD application with
                    React Hook Form, JWT Authentication,
                    MongoDB and Tailwind CSS.
                </p>

                <div className="flex justify-center gap-4">

                    {token ? (

                        <Link
                            to="/books"
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                        >
                            Manage Books
                        </Link>

                    ) : (

                        <>
                            <Link
                                to="/login"
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                            >
                                Login
                            </Link>

                            <Link
                                to="/register"
                                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
                            >
                                Register
                            </Link>
                        </>

                    )}

                </div>

            </div>

        </div>
    );
};

export default Home;