import { toast } from "react-toastify";

/**
 * 
 * @param {Object} props
 * @param {'default' | 'error' | 'info' | 'success' | 'warning'} props.type default success
 * @param {'top-center' | 'top-left' | 'top-right' | 'bottom-center' | 'bottom-left' | 'bottom-right'} props.position default bottom-right
 */
export const toastify = ({ msg, type = "success", position = "bottom-right" }) => {
    return toast[type](msg, {
        position: position,
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
    });
};