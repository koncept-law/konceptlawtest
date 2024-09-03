import { toastify } from "../components/toast"

export const toastifyError = (error, callback = function(){}) => {
    if (error.response?.status === 403) {
        localStorage.clear();
        // navigate("/login");
        callback("logout");
    } else if (error.response?.data) {
        toastify({ msg: error.response.data.message, type: "error" })
        callback("data");
    } else {
        toastify({ msg: error.message, type: "error" });
        callback("message");
    }
}