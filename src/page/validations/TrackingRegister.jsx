import React from "react";

// logo
import logo from "../../assets/konceptLogo.png";
import { useForm } from "react-hook-form";
import InputField from "../../common/fields/InputField";
import MyButton from "../../components/common/Buttons/MyButton";
import { yupResolver } from "@hookform/resolvers/yup";
import { trackingLoginSchema } from "./validations";
import handleTrackingPasswords from "../../constants/handleTrackingPasswords";
import { toastify } from "../../components/toast";
import { Spinner } from "@material-tailwind/react";
import usePath from "../../hooks/usePath";

const TrackingRegister = () => {
    const {
        control,
        formState: {
            errors,
        },
        handleSubmit,
    } = useForm({
        resolver: yupResolver(trackingLoginSchema),
        defaultValues: {
            userName: "",
            password: "",
        }
    });

    const path = usePath();
    const [loading, setLoading] = React.useState(false);

    const onLogin = (data) => {
        console.log("login", data);
        const isAuth = handleTrackingPasswords(data);
        if (isAuth) {
            toastify({ msg: "Your tracking account has been successfully registered.", position: "top-center" });
            setLoading(true);
            path.navigate("/tracking-login");
        } else {
            toastify({ msg: "Invalid login credentials. Please check your username and password and try again.", position: "top-center", type: "error" });
        }
        console.log("isAuth", isAuth);
    }

    return <>
        <main className="koncept-background h-screen flex justify-center items-center w-full">
            <div className="bg-white/15 p-3 flex flex-col items-center gap-y-8 py-8 w-[90%] sm:w-3/4 lg:w-[40%] rounded-md">
                <div className="flex justify-center gap-x-5 items-center">
                    {/* <img src={logo} className="w-16" />
                    <div className="flex flex-col justify-start items-start font-poppins not-italic leading-normal">
                        <h2 className="font-semibold logo-color text-[24px] text-shadow">
                            Koncept Law Associates
                        </h2>
                        <h2 className="text-gray-200">
                            - Register for a Tracking Account
                        </h2>
                    </div> */}
                    <h2 className="font-semibold logo-color text-[42px] text-shadow">
                        Koncept
                    </h2>
                </div>

                <form onSubmit={handleSubmit(onLogin)} className="flex justify-center w-3/4 items-center flex-col gap-y-6">
                    <InputField
                        control={control}
                        errors={errors}
                        label="Username"
                        name="userName"
                        labelClass="text-white"
                        className="text-white"
                    />

                    <InputField
                        control={control}
                        errors={errors}
                        label="Password"
                        name="password"
                        type="password"
                        labelClass="text-white"
                        className="text-white"
                    />

                    <MyButton className="w-full koncept-background flex justify-center gap-x-3 items-center text-[14px]" type="submit">
                        {loading ? <Spinner className="w-4" /> : null}
                        Register
                    </MyButton>
                </form>
            </div>
        </main>
    </>
}

export default TrackingRegister;