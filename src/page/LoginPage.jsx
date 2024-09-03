import { toastify } from "../components/toast";
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate } from "react-router-dom";
import { loginSchema, registerSchema } from "../common/constant/validation";
import { jwtDecode } from "jwt-decode";
import logo from "./../assets/konceptLogo.png";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/features/user";
import { setAuth } from "../redux/features/auth";
import { setLoader } from "../redux/features/loaders";
import Spinner from "../components/common/Spinner";
import { useState } from "react";
import { toastifyError } from "../constants/errors";

const LoginPage = () => {

    const [loginPage, setLoginPage] = useState(true);
    const [registerPage, setRegisterPage] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        resolver: yupResolver(registerPage === true ? registerSchema : loginSchema),
    });

    // changes made by abhyanshu

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loginLoader , registerLoader} = useSelector((state) => state.loaders);

    const submitHandler = async (data) => {
        try {
            const schema = loginPage ? loginSchema : registerSchema;
            const validData = schema.validateSync(data, { stripUnknown: true });

            if (loginPage === true) {
                dispatch(setLoader({ loginLoader: true }));
                const response = await axios.post(`https://m.konceptlaw.in/api/login`, validData);
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
            }
            else
                if (registerPage === true) {
                    dispatch(setLoader({ registerLoader: true }));
                    const response = await axios.post(`https://m.konceptlaw.in/account/post`, validData);
                    // console.log(response)
                    navigate("/login")
                    toastify({ msg: response.data.message, type: "success" });
                    reset();
                }
        } catch (error) {
            // if (error.response?.data) {
            //     toastify({ msg: error.response.data.message, type: "error" });
            // } else {
            //     toastify({ msg: error.message, type: "error" });
            // }
            toastifyError(error, (call) => {
                if(call){
                  navigate("/login");
                }
              })
        } finally {
            dispatch(setLoader({ loginLoader: false }));
            dispatch(setLoader({ registerLoader: false }));
        }
    };

    return (
        <>
            <div className="flex min-h-screen h-fit flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-lg all-side-box-shadow rounded-xl">
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
                            {registerPage === true ?
                                (<div>
                                    <label
                                        htmlFor="firstname"
                                        className="block text-sm font-medium leading-6 text-gray-900"
                                    >
                                        First Name
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="firstname"
                                            name="firstname"
                                            autoComplete="firstname"
                                            {...register("firstname")}
                                            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                        <p className="text-red-500">{errors.firstname?.message}</p>
                                    </div>
                                </div>)
                                :
                                ""
                            }

                            {registerPage === true ?
                                (<div>
                                    <label
                                        htmlFor="lastname"
                                        className="block text-sm font-medium leading-6 text-gray-900"
                                    >
                                        Last Name
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="lastname"
                                            name="lastname"
                                            autoComplete="lastname"
                                            {...register("lastname")}
                                            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                        <p className="text-red-500">{errors.lastname?.message}</p>
                                    </div>
                                </div>)
                                :
                                ""
                            }

                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    Email
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

                            {loginPage === true ? (<div>
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
                            </div>) : ""}

                            {loginPage === true ? (<div>
                                <button
                                    type="submit"
                                    disabled={loginLoader}
                                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    {loginLoader ? <Spinner /> : "Log In"}
                                </button>
                            </div>) :
                                registerPage === true ?
                                    (<div>
                                        <button
                                            type="submit"
                                            disabled={registerLoader}
                                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                        >
                                            {registerLoader ? <Spinner /> : "Register"}
                                        </button>
                                    </div>) :
                                    ""
                            }
                            {/* <div>
                                <span>Don`t Have an Account ? </span>
                                <button className="underline text-blue-600 text-md" onClick={() => { setLoginPage(false); setRegisterPage(true) }}>Register</button>
                                </div> */}
                        </form>
                        {/* // changes made by abhyanshu */}
                        <div className="my-2">
                            {
                                loginPage === true ? (
                                    <div>
                                        <span>Don`t Have an Account ? </span>
                                        <button className="underline cursor-pointer text-blue-600 text-md mx-1" onClick={(e) => { e.preventDefault(); setLoginPage(false); setRegisterPage(true); navigate("/register") }}>Register</button>
                                    </div>
                                ) :
                                    registerPage === true ?
                                        (
                                            <div>
                                                <span>Already Have an Account ? </span>
                                                <button className="underline cursor-pointer text-blue-600 text-md mx-1" onClick={() => { setLoginPage(true); setRegisterPage(false); navigate("/login") }}>Login</button>
                                            </div>
                                        )
                                        : ""
                            }
                        </div>
                    </div>
                </div>

                {/* changes made by abhyanshu */}
                {/* <div className="absolute bottom-0 w-full"> */}
                <div className="bottom-0 w-full my-4">
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

export default LoginPage;
