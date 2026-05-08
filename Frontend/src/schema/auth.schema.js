import * as yup from "yup";

export const loginFormValidation = yup.object({
  email: yup.string().email().required("Email is required!"),
  password: yup.string().required("Password is required!"),
});

export const registerFormValidation = yup.object({
  username: yup.string().required("Username is required!"),
  email: yup.string().email("Email must be a valid email!").required("Email is required!"),
  password: yup.string().required("Password is required!"),
});
