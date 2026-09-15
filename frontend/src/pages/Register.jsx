import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import { registerUser } from "../services/api";

const Register = () => {

    const navigate = useNavigate();

    const [serverError, setServerError] = useState("");

    const {
        register,
        handleSubmit,
        watch,
        formState: {
            errors,
            isSubmitting
        }
    } = useForm();


    const password = watch("password");


    const onSubmit = async (data) => {

        try {

            setServerError("");

            const response = await registerUser({

                name: data.name,

                email: data.email,

                password: data.password

            });


            localStorage.setItem(
                "token",
                response.token
            );


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
                    Create Account
                </h1>

                <p className="text-center text-gray-500 mb-6">
                    Register to manage your books
                </p>


                {serverError && (

                    <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
                        {serverError}
                    </div>

                )}


                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4"
                >

                    {/* NAME */}

                    <div>

                        <label className="block font-medium mb-1">
                            Name
                        </label>

                        <input
                            type="text"
                            placeholder="Enter your name"

                            className="w-full border rounded-lg px-4 py-2"

                            {...register("name", {

                                required: "Name is required",

                                minLength: {
                                    value: 3,
                                    message:
                                        "Name must contain at least 3 characters"
                                }

                            })}
                        />

                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.name.message}
                            </p>
                        )}

                    </div>


                    {/* EMAIL */}

                    <div>

                        <label className="block font-medium mb-1">
                            Email
                        </label>

                        <input
                            type="email"
                            placeholder="Enter your email"

                            className="w-full border rounded-lg px-4 py-2"

                            {...register("email", {

                                required:
                                    "Email is required",

                                pattern: {

                                    value:
                                        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

                                    message:
                                        "Enter a valid email"

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
                            placeholder="Enter password"

                            className="w-full border rounded-lg px-4 py-2"

                            {...register("password", {

                                required:
                                    "Password is required",

                                minLength: {

                                    value: 6,

                                    message:
                                        "Password must be at least 6 characters"

                                }

                            })}
                        />

                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.password.message}
                            </p>
                        )}

                    </div>


                    {/* CONFIRM PASSWORD */}

                    <div>

                        <label className="block font-medium mb-1">
                            Confirm Password
                        </label>

                        <input
                            type="password"
                            placeholder="Confirm password"

                            className="w-full border rounded-lg px-4 py-2"

                            {...register("confirmPassword", {

                                required:
                                    "Please confirm password",

                                validate: (value) =>
                                    value === password ||
                                    "Passwords do not match"

                            })}
                        />

                        {errors.confirmPassword && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.confirmPassword.message}
                            </p>
                        )}

                    </div>


                    {/* SUBMIT */}

                    <button
                        type="submit"
                        disabled={isSubmitting}

                        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
                    >

                        {isSubmitting
                            ? "Creating Account..."
                            : "Register"}

                    </button>

                </form>


                <p className="text-center mt-6">

                    Already have an account?{" "}

                    <Link
                        to="/login"
                        className="text-blue-600 font-semibold hover:underline"
                    >
                        Login
                    </Link>

                </p>

            </div>

        </div>
    );
};

export default Register;