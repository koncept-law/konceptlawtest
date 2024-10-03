import { createSlice } from "@reduxjs/toolkit";
import { getFormattedDateTime } from "../../../functions/getFormattedDateTime";
import createAxiosInstance from "../../../config/axiosConfig";
import { toastify } from "../../../components/toast";
import { toastifyError } from "../../../constants/errors";

const initialState = {
    trackingDetails: null,
};

const axios = createAxiosInstance();

const toolsSlice = createSlice({
    name: "tools",
    initialState: initialState,
    reducers: {
        setTools(state, action) {
            Object.keys(action.payload).forEach((key) => {
                state[key] = action.payload[key];
            });
        },
    },
});

export const { setTools } = toolsSlice.actions;
export default toolsSlice.reducer;


export const getTrackingDetailsThunkMiddleware = () => {
    return async (dispatch) => {
        try {
            const response = await axios.get(`/campaign/notifications/`);
            if(response.status === 200){
                dispatch(setTools({ trackingDetails: response.data }));
            }
        } catch (error) {
            toastifyError(error);
        } finally {
            // dispatch(setLoader({ loader: false }));
        }
    };
}

export const downloadTrackingFilesThunkMiddleware = () => {
    return async (dispatch) => {
        try {
            console.log("download tracking files....!");
        } catch (error) {
            toastifyError(error);
        } finally {
            // dispatch(setLoader({ loader: false }));
        }
    }
}

export const filteredOldTrackingFilesThunkMiddleware = () => {
    return async (dispatch) => {
        try {
            console.log("filtered old tracking files....!");
        } catch (error) {
            toastifyError(error);
        } finally {
            // dispatch(setLoader({ loader: false }));
        }
    }
}

export const stopAndResetTrackingFilesThunkMiddleware = () => {
    return async (dispatch) => {
        try {
            console.log("stop and reset tracking files....!");
        } catch (error) {
            toastifyError(error);
        } finally {
            // dispatch(setLoader({ loader: false }));
        }
    }
}