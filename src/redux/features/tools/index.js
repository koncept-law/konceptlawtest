import { createSlice } from "@reduxjs/toolkit";
import { getFormattedDateTime } from "../../../functions/getFormattedDateTime";
import createAxiosInstance from "../../../config/axiosConfig";
import { toastify } from "../../../components/toast";
import { toastifyError } from "../../../constants/errors";
import { setProgress } from "../progress";
import { setCampaignLoader } from "../loaders";

const initialState = {
    trackingDetails: null,
    pdfToExcelData: null,
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
            if (response.status === 200) {
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
            if (response.status === 200) {
                toastify({ msg: response.data?.message });
            }
        } catch (error) {
            toastifyError(error);
        } finally {
            // ...
        }
    }
}

export const getPdfCountsThunkMiddleware = (callback = () => { }) => {
    return async (dispatch) => {
        try {
            const response = await axios.get("/tools/getPdfCounts");
            if (response.status === 200) {
                dispatch(setTools({ total: response.data?.total, current: response.data?.current }));
                callback(true);
            }
        } catch (error) {
            toastifyError(error);
        } finally {
            callback(true);
        }
    }
}

export const mergeExcelFilesThunkMiddleware = (callback = () => { }) => {
    return async (dispatch) => {
        try {
            try {
                const response = await axios.get("/tools/mergeExcelFiles", {
                    responseType: "blob"
                });
                if (response.status === 200) {
                    callback(response.data);
                }
            } catch (err) {
                throw new Error("File Not Fetch");
            }
        } catch (error) {
            toastifyError(error);
        } finally {
            callback(false);
        }
    }
}

export const listAllPdfsThunkMiddleware = (callback = () => { }) => {
    return async (dispatch) => {
        try {
            try {
                const response = await axios.get("/tools/list-all-pdfs");
                if (response.status === 200) {
                    callback(response.data?.pdfFiles);
                }
            } catch (err) {
                throw new Error("File Not Fetch");
            }
        } catch (error) {
            toastifyError(error);
        } finally {
            callback(false);
        }
    }
}

export const getChildFoldersThunkMiddleware = (parentFolder, callback = () => {}) => {
    return async (dispatch) => {
        try {
            try {
                const response = await axios.get(`/tools/getChildFolders/${parentFolder}`);
                if (response.status === 200) {
                    dispatch(setTools({ pdfToExcelData: response.data }));
                    callback(false);
                }
            } catch (err) {
                throw new Error("File Not Fetch");
            }
        } catch (error) {
            toastifyError(error);
        } finally {
            callback(false);
        }
    }
}


export const pdfToExcelLinkThunkMiddleware = ({
    // campaignName,
    files = [],
    uniqueId = null,
    campaignType,
    callback = () => { },
    complete = () => { },
}) => {
    return async (dispatch) => {
        try {
            // dispatch(setProgress({ progressView: true }));
            // dispatch(
            //     setProgress({ uploadCampaignFileStatus: true, progressTab: "upload" })
            // );

            let totalFiles = files.length;
            let totalUploaded = 0;

            // dispatch(
            //     setCampaignLoader({
            //         // campaignName,
            //         status: true,
            //         totalFiles: files ? totalFiles : 0,
            //         totalUpload: totalUploaded,
            //     })
            // );

            toastify({
                msg: "Uploading Started!",
                type: "success",
                position: "top-center"
            });

            // dispatch(setNotificationThunkMiddleware({
            //   message: "Uploading Started!",
            //   type: "success"
            // }));

            for (let i = 0; i < totalFiles; i++) {
                // const currentFileNumber = i + 1 ;
                const formData = new FormData();
                // const fileName = `file${i + 1}`
                // formData.append("pdf", files[i]);
                formData.append("files", files[i]);
                formData.append("currentFile", i + 1);
                formData.append("uniqueId", uniqueId);
                // formData.append("campaignName", campaignName);
                formData.append("totalFiles", totalFiles);
                // formData.append("type", campaignType);

                const response = await axios.post(
                    // `/campaign/uploadMultiplePdf`,
                    `/tools/uploadMultiplePdfsWithExcelDownload`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );

                if (response.status === 200) {
                    // console.log(response.data);
                    totalUploaded++;
                    // dispatch(
                    //     setCampaignLoader({
                    //         // campaignName,
                    //         status: true,
                    //         totalFiles: files ? totalFiles : 0,
                    //         totalUpload: totalUploaded,
                    //     })
                    // );
                    callback({
                        upload: true,
                        totalFiles: files ? totalFiles : 0,
                        totalUpload: totalUploaded,
                    });
                }
            }

            // await dispatch(getCampaignByNameThunkMiddleware({ campaignName }));
            // toastify({
            //     msg: "All files uploaded successfully",
            //     type: "success",
            // });

            // dispatch(setNotificationThunkMiddleware({
            //   message: "All files uploaded successfully",
            //   type: "success"
            // }));

            // dispatch(
            //     setProgress({ uploadCampaignFileStatus: false, progressTab: "upload", progressView: false })
            // );
            callback({ upload: false });
        } catch (error) {
            // console.log(error);
            // if (error.response?.data) {
            //   toastify({ msg: error.response.data.message, type: "error" });
            // } else {
            //   toastify({ msg: error.message, type: "error" });
            // }
            toastifyError(error);
        } finally {
            // dispatch(
            //   removeCampaignLoader({
            //     campaignName,
            //   })
            // );
            complete({ upload: false });
        }
    };
};