import { Modal, Select } from "antd";
import { Controller, useForm } from "react-hook-form";
import { MdOutlineClose } from "react-icons/md";
import { createDocumentTemplateFileThunkMiddleware, getAllCategoriesThunkMiddleware, getAllTemplateFilesThunkMiddleware } from "../../../../../redux/features/campaigns";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setLoader } from "../../../../../redux/features/loaders";
import { toastify } from "../../../../toast";
import MoonLoader from "react-spinners/MoonLoader";
import Spinner from "../../../../common/Spinner";

export const TemplateModal = ({ templateModal, setTemplateModal }) => {
    const dispatch = useDispatch();
    const { documentTemplateCategories, singleUser } = useSelector((state) => state.campaigns);
    const [activeInputMethod, setActiveInputMethod] = useState("")

    // console.log(documentTemplateFiles);

    // const handleCancel = () => {
    //     setTemplateModal(false);
    // };

    const { addLoader } = useSelector((state) => state.loaders)

    const handleCloseBtn = () => {
        setTemplateModal(false);
    }

    const { register, handleSubmit, control, formState: { errors }, reset } = useForm();

    const handleTemplateSubmit = async (data) => {
        // console.log("Form data:", data); // Log form data for debugging
        // console.log(data.file[0])
        // console.log("create template data", data);
        try {
            dispatch(setLoader({ addLoader: true }));
            const formData = new FormData();
            formData.append('folderName', data.foldername);
            formData.append('docsName', data.name);
            formData.append("accountId", singleUser?.accountId);
            if (data.category !== "select") formData.append('category', data.category);
            if (data.file && data.file.length > 0) {
                formData.append('file', data.file[0]); // Get the first file
            }
            // Log the FormData content to verify
            // for (let [key, value] of formData.entries()) {
            //     console.log(`${key}: ${value}`);
            // }
            // Dispatch your thunk or action with the form data
            await dispatch(createDocumentTemplateFileThunkMiddleware(formData));
            // reset();
        } catch (error) {
            console.log("template modal error", error)
        } finally {
            dispatch(setLoader({ addLoader: false }));
            reset();
        }
        // const formData = new FormData();
        // formData.append('folderName', data.foldername);
        // formData.append('docsName', data.name);
        // if (data.category !== "select") formData.append('category', data.category);
        // if (data.file && data.file.length > 0) {
        //     formData.append('file', data.file[0]); // Get the first file
        // }
        // // Log the FormData content to verify
        // for (let [key, value] of formData.entries()) {
        //     console.log(`${key}: ${value}`);
        // }
        // // Dispatch your thunk or action with the form data
        // dispatch(createDocumentTemplateFileThunkMiddleware(formData));
        // reset();
    };

    // const dummySendCall = async (data) => {
    //     const formData = new FormData();
    //     formData.append('folderName', data.foldername);
    //     formData.append('docsName', data.name);
    //     if (data.category !== "select") formData.append('category', data.category);
    //     if (data.file && data.file.length > 0) {
    //         formData.append('file', data.file[0]); // Get the first file
    //     }

    //     try {
    //         dispatch(setLoader({ loader: true }));
    //         const response = await axios.post(
    //             `http://192.168.1.50:3000/docs/docsTempUpload`,
    //             formData,
    //             {
    //                 headers: {
    //                     "Content-Type": "multipart/form-data",
    //                 },
    //             }
    //         );


    //         console.log(response)

    //         if (response.status === 200) {
    //             const { message } = response.data;
    //             toastify({
    //                 msg: message,
    //                 type: "success",
    //             });
    //             await dispatch(getAllTemplateFilesThunkMiddleware());
    //         }

    //     } catch (error) {
    //         console.log(error);
    //         if (error.response?.data) {
    //             toastify({ msg: error.response.data.message, type: "error" });
    //         } else {
    //             toastify({ msg: error.message, type: "error" });
    //         }
    //     } finally {
    //         dispatch(setLoader({ loader: false }));
    //     }
    // }

    useEffect(() => {
        const getCategories = async () => {
            dispatch(getAllCategoriesThunkMiddleware());
        };
        getCategories();

        // const getDocumentTemplates = async () => {
        //     dispatch(getAllTemplateFilesThunkMiddleware());
        // };
        // getDocumentTemplates();
    }, [dispatch]);


    const handleActiveInputMethod = (method, value) => {
        // if()
        setActiveInputMethod("")
        // console.log("method send into the function", method)
        // console.log("value send into the function", value)
        // console.log("active input method send into the function", activeInputMethod)
        if (method === "input" && value !== "") {
            setActiveInputMethod("input");
        }
        else if (method === "dropdown" && (value !== "select")) {
            setActiveInputMethod("dropdown");
        }
    }

    return (
        <>
            <div className="absolute w-[90%] h-[90%]  bg-black opacity-25"></div>
            <Modal
                width={"90%"}
                centered
                open={templateModal}
                // onCancel={handleCancel}
                cancelButtonProps={{ hidden: true }}
                okButtonProps={{ hidden: true }}
                closable={false}
            >
                    <div className="relative modelHeadingBackground p-3 border-blue-800 rounded flex items-center justify-center">
                        <h1 className="text-white text-xl font-semibold">Create Template</h1>
                        <span
                            className="absolute right-4 text-white text-xl cursor-pointer"
                            onClick={handleCloseBtn}
                        >
                            <MdOutlineClose />
                        </span>
                    </div>
                    <div className='bg-white rounded-lg w-[100%] mx-auto h-[80vh] overflow-y-scroll table-container'>
                        {/* <p>Template Create Form</p> */}
                        <div className="flex min-h-fit flex-col justify-center sm:px-6 py-12 lg:px-8">
                            <div className="sm:mx-auto sm:w-full sm:max-w-lg all-side-box-shadow rounded-xl">
                                <div className="sm:mx-auto sm:w-full sm:max-w-sm p-6 sm:p-10">
                                    <form
                                        onSubmit={handleSubmit(handleTemplateSubmit)}
                                        // onSubmit={handleSubmit(dummySendCall)}
                                        className="space-y-6 mt-10"
                                        action="#"
                                        method="POST"
                                    >

                                        <div>
                                            <label
                                                htmlFor="name"
                                                className="block text-sm font-medium leading-6 text-gray-900"
                                            >
                                                Folder Name
                                            </label>
                                            <div className="flex flex-col gap-y-4 w-full">
                                                <div className="mt-2">
                                                    <input
                                                        id="name"
                                                        name="foldername"
                                                        autoComplete="foldername"
                                                        {...register("foldername", activeInputMethod === "input" ? { required: true } : { required: false })}
                                                        className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                        onChange={(e) => handleActiveInputMethod("input", e.target.value)}
                                                        disabled={activeInputMethod === "dropdown" ? true : false}
                                                    />
                                                    {errors.name && <span className="text-red-500">This field is required</span>}
                                                </div>

                                                <span className="text-lg flex w-full justify-center">OR</span>

                                                <Controller
                                                    name="foldername"
                                                    control={control}
                                                    rules={activeInputMethod === "dropdown" ? { required: true } : { required: false }}
                                                    render={({ field }) => (
                                                        <Select
                                                            showSearch
                                                            placeholder="Select an Option"
                                                            // defaultValue={{label : "Select An Option" , value : "Some Option"}}
                                                            className="w-full h-[40px] block rounded-md border-0  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                            {...field}
                                                            options={[
                                                                { label: "Select an Option", value: "select" },
                                                                ...(documentTemplateCategories?.map((option) => ({ label: option.name, value: option.name })) || [])
                                                            ]}
                                                            onChange={(value) => handleActiveInputMethod("dropdown", value)}
                                                            disabled={activeInputMethod === "input" ? true : false}
                                                        />
                                                    )}
                                                />
                                                {errors.name && <span className="text-red-500">This field is required</span>}
                                            </div>
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="name"
                                                className="block text-sm font-medium leading-6 text-gray-900"
                                            >
                                                Template Name
                                            </label>
                                            <div className="mt-2">
                                                <input
                                                    id="name"
                                                    name="name"
                                                    autoComplete="name"
                                                    {...register("name", { required: true })}
                                                    className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                />
                                                {errors.name && <span className="text-red-500">This field is required</span>}
                                            </div>
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="file"
                                                className="block text-sm font-medium leading-6 text-gray-900"
                                            >
                                                Document Upload
                                            </label>
                                            <div className="mt-2">
                                                <input
                                                    id="file"
                                                    name="file"
                                                    type="file"
                                                    {...register("file", { required: true })}
                                                    className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                />
                                                {errors.file && <span className="text-red-500">This field is required</span>}
                                            </div>
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="category"
                                                className="block text-sm font-medium leading-6 text-gray-900 my-2"
                                            >
                                                Select Category
                                            </label>
                                            <Controller
                                                name="category"
                                                control={control}
                                                rules={{ required: true }}
                                                render={({ field }) => (
                                                    <Select
                                                        showSearch
                                                        placeholder="Select an Option"
                                                        // defaultValue={{label : "Select An Option" , value : "Some Option"}}
                                                        className="w-full h-[40px] block rounded-md border-0  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                        {...field}
                                                        options={[
                                                            { label: "Select an Option", value: "select" },
                                                            ...(documentTemplateCategories?.map((option) => ({ label: option.name, value: option.name })) || [])
                                                        ]}
                                                    />
                                                )}
                                            />
                                            {errors.category && <span className="text-red-500">This field is required</span>}
                                        </div>

                                        <div>
                                            <button
                                                type="submit"
                                                disabled={addLoader}
                                                className={`flex w-full justify-center rounded-md ${addLoader ? "bg-indigo-400" : "bg-indigo-600"}  min-h-fit 
                                            h-[40px] sm:px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm 
                                            hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 
                                            focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
                                            >
                                                {addLoader ? <span className="flex justify-center items-center"><Spinner /></span> : "Create Template"}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
            </Modal>
        </>
    );
};
