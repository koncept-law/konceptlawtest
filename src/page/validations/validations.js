import * as yup from 'yup';

export const trackingLoginSchema = yup.object().shape({
  userName: yup
    .string()
    .required('Username is required'),
  password: yup
    .string()
    .required('Password is required'),
});
