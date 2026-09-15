import { Link } from "react-router-dom";

const NotFound = () => {

    return (

        <div className="min-h-[80vh] flex items-center justify-center">

            <div className="text-center">

                <h1 className="text-7xl font-bold text-red-500">
                    404
                </h1>

                <h2 className="text-2xl font-bold mt-4">
                    Page Not Found
                </h2>

                <p className="text-gray-500 mt-2 mb-6">
                    The page you are looking for does not exist.
                </p>

                <Link
                    to="/"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg"
                >
                    Go Home
                </Link>

            </div>

        </div>
    );
};

export default NotFound;