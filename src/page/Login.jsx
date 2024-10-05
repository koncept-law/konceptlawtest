import React from "react";
import { toastify } from "../components/toast";
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate } from "react-router-dom";
import { loginSchema } from "../common/constant/validation";
import { jwtDecode } from "jwt-decode";
import logo from "./../assets/konceptLogo.png";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/features/user";
import { setAuth } from "../redux/features/auth";
import { setLoader } from "../redux/features/loaders";
import Spinner from "../components/common/Spinner";
import { toastifyError } from "../constants/errors";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loginLoader } = useSelector((state) => state.loaders);

  const submitHandler = async (data) => {
    try {
      dispatch(setLoader({ loginLoader: true }));
      const response = await axios.post(`https://t.kcptl.in/api/login`, data);
      const { token } = response.data;
      localStorage.setItem("konceptLawToken", token);
      const user = await jwtDecode(localStorage.getItem("konceptLawToken"))
        .foundUser;
      dispatch(setUser({ user }));
      localStorage.setItem("role", user.profile);
      dispatch(
        setAuth({ role: user.profile, isAuthenticated: true, token: token })
      );
      if (user.profile === "superAdmin") navigate("/dashboard");
      else navigate("/document");
      toastify({ msg: response.data.message, type: "success" });
    } catch (error) {
      // if (error.response?.data) {
      //   // toastify({ msg: error.response.data, type: "error" });
      //   toastify({ msg: error.response.data.message, type: "error" });
      // } else {
      //   toastify({ msg: error.message, type: "error" });
      // }
      toastifyError(error, (call) => {
        if(call){
          navigate("/login");
        }
      })
    } finally {
      dispatch(setLoader({ loginLoader: false }));
    }
  };

  return (
    <>
      <div className="flex h-screen flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-lg shadow-2xl rounded-xl">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm p-10">
            <div className="w-full flex flex-col items-center gap-2">
              <div className=" w-[5rem] h-[3rem] flex">
                <img src={logo} alt="logo" className=" w-full h-full" />
              </div>
              <div>
                <p className=" text-2xl font-bold logo-color text-center ">
                  Koncept Law Associates
                </p>
              </div>
            </div>
            <p className="mt-5 text-center text-xl font-semibold leading-9 tracking-tight text-gray-900">
              Sign in to your account
            </p>
            <form
              onSubmit={handleSubmit(submitHandler)}
              className="space-y-6 mt-10"
              action="#"
              method="POST"
            >
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  User Name
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    autoComplete="email"
                    {...register("email")}
                    className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  <p className="text-red-500">{errors.email?.message}</p>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Password
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    {...register("password")}
                    className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  <p className="text-red-500">{errors.password?.message}</p>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loginLoader}
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  {loginLoader ? <Spinner /> : "Log In"}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="absolute bottom-0 w-full">
          <div className="p-6 rounded px-10 flex items-center justify-center">
            <p>
              Copyright ©{" "}
              <Link to={"/"} className="text-gray-700 font-bold">
                Koncept Law Associates
              </Link>
              . All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
