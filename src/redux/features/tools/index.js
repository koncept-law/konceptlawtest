import { createSlice } from "@reduxjs/toolkit";
import { getFormattedDateTime } from "../../../functions/getFormattedDateTime";
import createAxiosInstance from "../../../config/axiosConfig";
import { toastify } from "../../../components/toast";
import { toastifyError } from "../../../constants/errors";

const initialState = {
    trackingDetails: null,
    total: 0,
    current: 0,
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

export const resetAndrestartServerThunkMiddleware = () => {
    return async (dispatch) => {
        try {
            const response = await axios.get("/tools/resetTheServer");
            if(response.status === 200){
                toastify({ msg: response.data?.message });
            }
        } catch(error) {
            toastifyError(error);
        } finally {
            // ...
        }
    }
}

export const getPdfCountsThunkMiddleware = () => {
    return async (dispatch) => {
        try {
            const response = await axios.get("/tools/getPdfCounts");
            if(response.status === 200){
                dispatch(setTools({ total: response.data?.total, current: response.data?.current }));
            }
        } catch(error) {
            toastifyError(error);
        } finally {
            // ...
        }
    }
}