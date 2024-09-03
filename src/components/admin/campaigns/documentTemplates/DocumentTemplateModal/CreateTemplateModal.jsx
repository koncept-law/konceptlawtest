import React, { useEffect, useState } from 'react';
import { Modal, Select } from 'antd';
import { MdOutlineClose } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { setLoader } from '../../../../../redux/features/loaders';
import { createDocumentTemplateFileThunkMiddleware, getAllCategoriesThunkMiddleware } from '../../../../../redux/features/campaigns';
import { Button } from '@material-tailwind/react';
import OptionalField from '../../../../../common/fields/OptionalField';
import { toastify } from '../../../../toast';
import Spinner from '../../../../common/Spinner';

const CreateTemplateModal = ({ open, setOpen }) => {
    const { allFolders, documentTemplateCategories, singleUser } = useSelector((state) => state.campaigns);

    const handleCancel = () => {
        setOpen(false); // Close the modal when 'Cancel' is clicked
    };

    const dispatch = useDispatch();

    const { addLoader } = useSelector((state) => state.loaders)

    const { register, handleSubmit, control, formState: { errors }, reset } = useForm({
        defaultValues: {
            name: "",
            selectfoldername: "",
            file: null,
            category: "",
            foldername: "",
        }
    });

    const handleTemplateSubmit = (data) => {
        let {
            selectfoldername,
            foldername,
            name,
            file,
            category
        } = data;

        if (selectfoldername && selectfoldername !== "select") {
            foldername = selectfoldername;
        }

        if (foldername && foldername !== "") {
            // console.log("send folder data", { foldername, file, name, category });
            try {
                dispatch(setLoader({ addLoader: true }));
                const formData = new FormData();
                formData.append('folderName', foldername);
                formData.append('docsName', name);
                formData.append("accountId", singleUser?.accountId);
                if (category !== "select") formData.append('category', category);
                if (file && file.length > 0) {
                    formData.append('file', file[0]); // Get the first file
                }
                dispatch(createDocumentTemplateFileThunkMiddleware({formData: formData, folder: foldername, accountId: singleUser?.accountId}));
                reset();
                handleCancel();
            } catch (error) {
                console.log("template modal error", error)
            } finally {
                dispatch(setLoader({ addLoader: false }));
                reset();
            }
        } else {
            toastify({ msg: "Please Fill Folder Name", type: "error" })
        }
        // try {
        //     dispatch(setLoader({ addLoader: true }));
        //     const formData = new FormData();
        //     formData.append('folderName', data.foldername);
        //     formData.append('docsName', data.name);
        //     if (data.category !== "select") formData.append('category', data.category);
        //     if (data.file && data.file.length > 0) {
        //         formData.append('file', data.file[0]); // Get the first file
        //     }
        //     await dispatch(createDocumentTemplateFileThunkMiddleware(formData));
        //     // reset();
        // } catch (error) {
        //     console.log("template modal error", error)
        // } finally {
        //     dispatch(setLoader({ addLoader: false }));
        //     reset();
        // }
    };

    useEffect(() => {
        const getCategories = async () => {
            dispatch(getAllCategoriesThunkMiddleware());
        };
        getCategories();
    }, [dispatch]);

    return (
        <Modal
            open={open} // Control visibility with the 'open' prop
            onCancel={handleCancel}
            footer={[]}
            centered
            closable={false}
            width={800}
        >
            <div className="w-full flex flex-col">
                <div className="relative modelHeadingBackground p-3 border-blue-800 rounded flex items-center justify-between">
                    <h1 className="text-white text-lg font-poppins not-italic leading-normal font-semibold">Create Template</h1>
                    <span
                        className="absolute right-4 text-white text-xl cursor-pointer"
                        onClick={handleCancel}
                    >
                        <MdOutlineClose />
                    </span>
                </div>
                <div className="bg-white px-4 gap-y-2 flex flex-col py-2 w-full">
                    <div className="">
                        {/* <label
                            htmlFor="name"
                            className="block text-sm font-medium leading-6 text-gray-900"
                        >
                            Folder Name
                        </label> */}
                        <OptionalField
                            documentTemplateCategories={allFolders ? allFolders : []}
                            control={control}
                            errors={errors}
                        />
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
                                className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset outline-none focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                        <Button
                            // type="submit"
                            onClick={handleSubmit(handleTemplateSubmit)}
                            disabled={addLoader}
                            className={`flex w-full justify-center rounded-md ${addLoader ? "bg-indigo-400" : "bg-indigo-600"} flex justify-center items-center 
                                            h-[40px] sm:px-3 py-1.5 text-sm font-medium font-poppins capitalize not-italic leading-normal text-white shadow-sm 
                                            hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 
                                            focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
                        >
                            {addLoader ? <span className="flex justify-center items-center"><Spinner /></span> : "Create Template"}
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default CreateTemplateModal;
