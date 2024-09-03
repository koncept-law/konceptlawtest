import { createSlice } from "@reduxjs/toolkit";
import { getFormattedDateTime } from "../../../functions/getFormattedDateTime";
import createAxiosInstance from "../../../config/axiosConfig";
import { toastify } from "../../../components/toast";
import { toastifyError } from "../../../constants/errors";

const initialState = {
    notification: null,
    allNotification: [],
};

const axios = createAxiosInstance();

const userSlice = createSlice({
    name: "notification",
    initialState: initialState,
    reducers: {
        setNotification(state, action) {
            Object.keys(action.payload).forEach((key) => {
                state[key] = action.payload[key];
            });
        },
        setAllNotification(state, action) {
            let obj = { ...action.payload, time: getFormattedDateTime(), id: Date.now() };
            state.allNotification.push(obj);
        },
        deleteNotification(state, { payload }) {
            let allNotification = state.allNotification;
            let array = [];

            allNotification.map((item)=> {
                if(item.id !== payload){
                    array.push(item);
                }
            })

            state.allNotification = array;
        }
    },
});

export const { setNotification, setAllNotification, deleteNotification } = userSlice.actions;
export default userSlice.reducer;


export const setNotificationThunkMiddleware = (payload) => {
    return async (dispatch) => {
        try {
            dispatch(setNotification({
                notification: true,
            }));

            dispatch(setAllNotification(payload));
        } catch (error) {
            // console.log(error);
        } finally {
            // dispatch(setLoader({ loader: false }));
        }
    };
};

export const getNotificationThunkMiddleware = (payload) => {
    return async (dispatch) => {
        try {
            const response = await axios.get(`/campaign/notifications/${payload}`);
            if(response.status === 200){
                if(response.data?.notifications){
                    dispatch(setNotification({ allNotification: response.data?.notifications }));
                }else {
                    dispatch(setNotification({ allNotification: [] }));
                }
            }
        } catch (error) {
            console.error(error);
            // toastifyError(error);
        } finally {
            // dispatch(setLoader({ loader: false }));
        }
    };
}

export const getGlobalNotificationThunkMiddleware = () => {
    return async (dispatch) => {
        try {
            const response = await axios.get(`/campaign/notificationsG2`);
            if(response.status === 200){
                dispatch(setNotification({ allNotification: response.data?.notifications }));
            }
        } catch (error) {
            console.error(error);
            // toastifyError(error);
            dispatch(setNotification({ allNotification: [] }));
        } finally {
            // dispatch(setLoader({ loader: false }));
        }
    };
}

export const deleteNotificationThunkMiddleware = (payload) => {
    return async (dispatch) => {
        try {
            const response = await axios.post(`/campaign/notifications/${payload?.id}`);
            if(response.status === 200){
                toastify({ msg: response.data?.message });
                dispatch(getNotificationThunkMiddleware(payload?.name));
            }
        } catch (error) {
            // console.log(error);
            toastifyError(error);
        } finally {
            // dispatch(setLoader({ loader: false }));
        }
    };
}