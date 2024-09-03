import * as yup from "yup";

export const loginSchema = yup.object().shape({
  // Basic Login Info
  email: yup.string().required("Username is required"),
  // email: yup.string().required("Email is required"),
  password: yup.string().required("Password is required"),
});

// changes made by abhyanshu
export const registerSchema = yup.object().shape({
  // Basic Login Info
  firstname: yup.string().required("First Name is required"),
  lastname: yup.string().required("Last Name is required"),
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  // password: yup.string().required("Password is required"),
});

export const passwordChangeSchema = yup.object().shape({
  // Old and New Passwords
  currentPassword: yup.string().required("Current password is required"),
  newPassword: yup
    .string()
    .required("New password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
  confirmPassword: yup
    .string()
    .required("Confirm password is required")
    .oneOf([yup.ref("newPassword"), null], "Passwords must match"),
});
