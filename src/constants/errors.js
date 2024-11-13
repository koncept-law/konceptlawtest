import { toastify } from "../components/toast"

export const toastifyError = (error, callback = function(){}, position = "bottom-right") => {
    if (error.response?.status === 403) {
        localStorage.clear();
        // navigate("/login");
        callback("logout");
    } else if (error.response?.data?.error) {
        toastify({ msg: error.response.data.error, type: "error", position: position })
        callback("data");
    } else if (error.response?.data?.message) {
        toastify({ msg: error.response.data.message, type: "error", position: position })
        callback("data");
    } else if (error.response?.data) {
        toastify({ msg: error.response.data, type: "error", position: position })
        callback("data");
    } else {
        toastify({ msg: error.message, type: "error", position: position });
        callback("message");
    }
}