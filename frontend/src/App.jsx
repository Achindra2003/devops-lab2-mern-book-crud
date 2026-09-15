import {
    Routes,
    Route
} from "react-router-dom";

import Navbar from "./components/Navbar";

import ProtectedRoute
    from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Books from "./pages/Books";
import NotFound from "./pages/NotFound";


const App = () => {

    return (

        <>

            <Navbar />

            <Routes>

                {/* HOME */}

                <Route
                    path="/"
                    element={<Home />}
                />


                {/* AUTHENTICATION */}

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />


                {/* PROTECTED BOOK PAGE */}

                <Route

                    path="/books"

                    element={

                        <ProtectedRoute>

                            <Books />

                        </ProtectedRoute>

                    }

                />


                {/* 404 */}

                <Route
                    path="*"
                    element={<NotFound />}
                />

            </Routes>

        </>

    );
};

export default App;