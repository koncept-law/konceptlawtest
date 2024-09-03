import { toast } from "react-toastify";

export const toastify = ({ msg, type = "success" }) => {
    return toast[type](msg, {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
    });
};