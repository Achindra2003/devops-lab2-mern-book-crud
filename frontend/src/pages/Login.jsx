import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import { loginUser } from "../services/api";

const Login = () => {

    const navigate = useNavigate();

    const [serverError, setServerError] = useState("");

    const {
        register,
        handleSubmit,
        formState: {
            errors,
            isSubmitting
        }
    } = useForm();


    const onSubmit = async (data) => {

        try {

            setServerError("");

            const response = await loginUser(data);

            // Store JWT
            localStorage.setItem(
                "token",
                response.token
            );

            // Store user
            localStorage.setItem(
                "user",
                JSON.stringify(response.user)
            );

            navigate("/books");

        } catch (error) {

            setServerError(error.message);
        }
    };


    return (

        <div className="min-h-[90vh] flex items-center justify-center bg-slate-100 p-5">

            <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-lg">

                <h1 className="text-3xl font-bold text-center mb-2">
                    Login
                </h1>

                <p className="text-center text-gray-500 mb-6">
                    Login to manage your books
                </p>


                {serverError && (

                    <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
                        {serverError}
                    </div>

                )}


                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-5"
                >

                    {/* EMAIL */}

                    <div>

                        <label className="block font-medium mb-1">
                            Email
                        </label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"

                            {...register("email", {
                                required: "Email is required",

                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "Enter a valid email"
                                }
                            })}
                        />

                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.email.message}
                            </p>
                        )}

                    </div>


                    {/* PASSWORD */}

                    <div>

                        <label className="block font-medium mb-1">
                            Password
                        </label>

                        <input
                            type="password"
                            placeholder="Enter your password"

                            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"

                            {...register("password", {
                                required: "Password is required"
                            })}
                        />

                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.password.message}
                            </p>
                        )}

                    </div>


                    {/* SUBMIT */}

                    <button
                        type="submit"
                        disabled={isSubmitting}

                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                    >

                        {isSubmitting
                            ? "Logging in..."
                            : "Login"}

                    </button>

                </form>


                <p className="text-center mt-6">

                    Don't have an account?{" "}

                    <Link
                        to="/register"
                        className="text-blue-600 font-semibold hover:underline"
                    >
                        Register
                    </Link>

                </p>

            </div>

        </div>
    );
};

export default Login;