import React from "react";
import { registerFormValidation } from "../../../schema/auth.schema";
import { useFormik } from "formik";
import { Link } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { useSelector } from "react-redux";

const Register = () => {
  const { handleRegister } = useAuth();
  const loading = useSelector((state) => state.auth.loading);
  const initialState = {
    username: "",
    email: "",
    password: "",
  };

  const {
    handleBlur,
    handleSubmit,
    handleChange,
    resetForm,
    errors,
    touched,
    values,
  } = useFormik({
    initialValues: initialState,
    validationSchema: registerFormValidation,
    onSubmit: (values) => {
      handleRegister(values);
      console.log(values);
    },
  });
  return (
    <section className="bg-zinc-950 min-h-screen flex justify-center items-center ">
      <div className="flex flex-col gap-8 p-8 border border-gray-700 rounded-2xl min-w-85 bg-zinc-900/70">
        <div className="">
          <h3 className="text-cyan-500 text-2xl font-extrabold">Sign up</h3>
          <p className="text-gray-400 text-sm w-60 md:w-full wrap-break-word">
            Sign up with your username, email and password.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="username" className="text-white">
              Username
            </label>
            <input
              className="text-white bg-mist-950 border border-gray-700 rounded-md py-2 px-3"
              type="text"
              id="username"
              name="username"
              placeholder="you@example.com"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.username}
            />
            {touched.username && (
              <p className="text-red-600 text-sm">{errors.username}</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-white">
              Email
            </label>
            <input
              className="text-white bg-mist-950 border border-gray-700 rounded-md py-2 px-3"
              type="text"
              id="email"
              name="email"
              placeholder="you@example.com"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.email}
            />
            {touched.email && (
              <p className="text-red-600 text-sm">{errors.email}</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-white">
              Password
            </label>
            <input
              className="text-white bg-mist-950 border border-gray-700 rounded-md py-2 px-3"
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.password && (
              <p className="text-red-600 text-sm">{errors.password}</p>
            )}
          </div>
          <button
            type="submit"
            className="py-2 px-3 w-full mx-auto bg-cyan-500 font-semibold rounded-md cursor-pointer"
          >
            {loading ? (
              <p className="animate-spin w-6 h-6 relative mx-auto border-2 border-r-cyan-500 rounded-full border-black"></p>
            ) : (
              "Register"
            )}
          </button>
          <p className="text-gray-300 text-sm">
            Already have an account?{" "}
            <Link className="text-cyan-500" to={"/login"}>
              Login here
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default Register;
