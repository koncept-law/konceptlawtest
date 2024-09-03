import { Modal } from "antd";
import { useEffect, useRef, useState } from "react";
import DataTable from "react-data-table-component";
import { FaMinusCircle } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { MdDeleteOutline, MdOutlineClose } from "react-icons/md";
import ConfirmMessage from "../../../../common/ConfirmMessage";
import { createDocumentTemplateCategoryThunkMiddleware, deleteDocumentTemplateCategoryThunkMiddleware, getAllCategoriesThunkMiddleware } from "../../../../../redux/features/campaigns";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../../../../common/Spinner";
import { setLoader } from "../../../../../redux/features/loaders";
import MoonLoader from "react-spinners/MoonLoader"
import { RxCross2 } from "react-icons/rx";

export const CategoriesModal = ({ categoriesModal, setCategoriesModal }) => {

    // const navigate = useNavigate();
    const [selectedRow, setSelectedRow] = useState(null);
    const searchRef = useRef(null);

    const dispatch = useDispatch();

    const { documentTemplateCategories } = useSelector((state) => state.campaigns);
    // console.log(documentTemplateCategories);
    const { addLoader } = useSelector((state) => state.loaders)

    const handleModalClose = () => {
        setCategoriesModal(false)
    }

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        // resolver: yupResolver(loginSchema),
        defaultValues: {
            category: ""
        }
    });

    useEffect(() => {
        const getCategories = () => {
            dispatch(getAllCategoriesThunkMiddleware());
        }
        getCategories();
    }, [dispatch]);




    const handleCategorySubmit = async (data) => {
        // console.log(data.category)
        // dispatch(createDocumentTemplateCategoryThunkMiddleware({ categoryName: data.category }));
        // reset();

        try {
            await dispatch(setLoader({ addLoader: true }));
            await dispatch(createDocumentTemplateCategoryThunkMiddleware({ categoryName: data.category }));
        } catch (error) {
            console.log("error", error)
        }
        finally {
            dispatch(setLoader({ addLoader: false }));
            reset();
        }
        // reset();
        // dispatch(setLoader({ addLoader: false }))
    }

    // console.log(addCategoryLoader)
    // console.log(data.category)

    const handleDeleteCategory = (name) => {
        // console.log("delete category")
        // console.log("delete category index ", index)
        // console.log("delete category name", name);
        dispatch(deleteDocumentTemplateCategoryThunkMiddleware({ categoryName: name }));
    }

    const columns = [
        {
            name: "All Categories",
            selector: (row) => row.name,
            width: "65vw",
        },
        {
            name: "Delete",
            cell: (row) => {

                // const handleDeleteCategory = (name) => {
                //     dispatch(deleteDocumentTemplateCategoryThunkMiddleware({ categoryName: name }));
                // }

                return (
                    <div>
                        {
                            selectedRow === row ? <>
                                < ConfirmMessage yes="Yes, I am sure" deleteBtn={true} saveOrsend="" className="flex-col" no="No, I'm not sure!" value={(e) => {
                                    if (e) {
                                        // e.preventDefault();
                                        handleDeleteCategory(row.name)
                                    }
                                    setSelectedRow(false);
                                }}>
                                    <MdDeleteOutline size={"50px"} className="mb-3 text-slate-700" />
                                    <h2 className="text-lg w-full text-center text-slate-700 font-normal">Do You Want to Delete This Category? <br />
                                        <span className="font-semibold text-lg capitalize">
                                            {row.firstName} &nbsp;{row.lastName}
                                        </span>
                                    </h2>
                                </ConfirmMessage >
                            </> : null
                        }
                        <button
                            // onClick={() => handleDeleteCategory(row.name)}
                            onClick={(e) => {
                                e.preventDefault();
                                setSelectedRow(row)
                            }}
                        ><FaMinusCircle size={"20px"} color='red' />
                        </button>
                    </div>
                )
            },
            width: "100px",
        }
    ];

    // console.log(addCategoryLoader);

    const tableCustomStyles = {
        headRow: {
            style: {
                background: "linear-gradient(90deg, #359FF3 0%, #8256FF 100%)",
                // background: "#34201F",
                color: "white",
                fontWeight: "38px",
                fontSize: "14px",
                borderRadius: "5px",
                minHeight: "41px",
            },
        },
        rows: {
            style: {
                borderBottomStyle: "solid",
                borderBottomWidth: "1px",
                borderBottomColor: "#42bbff",
                cursor: "pointer",
                "&:not(:last-of-type)": {
                    borderBottomStyle: "solid",
                    borderBottomWidth: "1px",
                    borderBottomColor: "#42bbff",
                },
            },
        },
    };

    const handleCloseBtn = () => {
        setCategoriesModal(false);
    }

    const [searchInput, setSearchInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const handleInputChange = (event) => {
        // setSearchInput(event.target.value);
        setSearchQuery(event.target.value);
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            handleSearch();
        }
    }

    const handleSearch = () => {
        setSearchQuery(searchInput);
    };

    const filteredData = documentTemplateCategories?.filter(item => {
        return (
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
            // ||
            // item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            // item.id.toString().includes(searchQuery)
        );
    });


    return (
        <>
            <div className="absolute w-[90%] h-[90%] bg-black opacity-25"></div>
            <Modal
                width={"90%"} centered open={categoriesModal}
                // onCancel={handleModalClose}
                cancelButtonProps={{ hidden: true }}
                okButtonProps={{ hidden: true }}
                closable={false}
            >
                <div className='bg-white rounded-lg w-[100%] mx-auto min-h-[80vh]'>
                    <div className="modelHeadingBackground p-3 border-blue-800 rounded flex items-center justify-between">
                        <h1 className="text-white  text-xl font-semibold">Categories</h1>
                        <span
                            className=" text-white text-xl cursor-pointer"
                            onClick={handleCloseBtn}
                        >
                            <MdOutlineClose />
                        </span>
                    </div>
                    {/* <div className='bg-gray-200 flex gap-x-4 p-2 my-2 rounded-md sm:h-[60px] h-fit flex-wrap gap-y-2'
                        onKeyDown={handleKeyDown}
                        tabIndex={0}
                    >
                        <input
                            type="text"
                            className="border-2 rounded p-1 flex-1 focus:ring-2 focus:ring-purple-800 outline-none"
                            placeholder="Search Now"
                            onChange={handleInputChange}
                        // onKeyDown={handleSearch}  
                        />
                        <button
                            type="submit"
                            className=" flex items-center gap-1 buttonBackground px-2 py-1 rounded-md text-white font-semibold"
                            onClick={() => handleSearch()}
                        // onChange={handleSearch}
                        // onKeyDown={handleSearch}  
                        >
                            <IoSearch size={26} /> Search
                        </button>
                    </div> */}
                    <div className="px-2">
                        <div className="overflow-hidden flex justify-center items-center border border-solid border-slate-500 my-2 rounded-md">
                            <input ref={searchRef} type="text" placeholder="Search Categories" className="outline-none p-2 w-full" onChange={handleInputChange} />
                            <button className="cursor-pointer hover:text-red-600 active:text-red-900 transition-all flex justify-center items-center mx-2" onClick={()=> {
                                searchRef.current.value = "";
                                setSearchQuery("");
                            }}>
                                <RxCross2 size={20} />
                            </button>
                        </div>
                    </div>
                    <div className="relative h-[70vh] w-[100%] mx-auto my-2">
                        <div className='flex w-full flex-wrap justify-center mb-2'>
                            <form
                                onSubmit={handleSubmit(handleCategorySubmit)}
                                className='w-full flex sm:flex-row flex-col flex-wrap bg-gray-200 p-2 sm:gap-y-0 gap-y-2 justify-around  rounded-md'
                            >
                                <div className='flex sm:flex-row flex-col w-full sm:w-4/6'>
                                    <label
                                        htmlFor="email"
                                        className="text-sm w-full sm:w-1/4 font-medium leading-6 p-2 text-gray-600"
                                    >
                                        Category Name:
                                    </label>
                                    <input
                                        type="text"
                                        id="category"
                                        name="category"
                                        autoComplete="category"
                                        className='text-gray-900 w-full sm:w-3/4 h-[40px] border p-1 sm:p-2 bg-white border-gray-600 rounded-md'
                                        {...register("category")}
                                    />
                                </div>
                                <div className='w-full sm:w-2/6 h-[40px] flex sm:justify-center justify-start'>
                                    <button disabled={addLoader} type='submit' 
                                    className={`flex justify-center text-white w-[150px] min-h-fit h-[40px] font-semibold p-2 px-4 sm:p-2 sm:px-8 
                                    ${ addLoader ? "bg-green-400" : "bg-green-600"} rounded-md`}>
                                        {addLoader ? <span className="flex justify-center items-center"><Spinner/></span> : "Add"}
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div className='w-[100%] table-container horizontal-container mx-auto py-2 rounded-md overflow-scroll'>
                            <div className="md:h-[60vh] h-[40vh]">
                                <DataTable
                                    columns={columns}
                                    // data={documentTemplateCategories ? documentTemplateCategories.slice().reverse() : []}
                                    data={filteredData ? filteredData.slice().reverse() : []}
                                    // pagination
                                    // selectableRows
                                    // onSelectedRowsChange={handleSelectedRowsChange}
                                    // noHeader={true}
                                    customStyles={tableCustomStyles}
                                    // progressPending={getLoader}
                                    // onRowClicked={rowClickHandler}
                                    responsive={true}
                                    noDataComponent={<CustomNoDataComponenet />}
                                    progressComponent={<CustomProgressComponenet />}
                                />
                            </div>
                        </div>
                    </div >
                    <div className="flex justify-end absolute right-0 p-4 bottom-0">
                        <button onClick={() => handleModalClose()} className="p-2 rounded-md w-fit cursor-pointer
                            font-semibold bg-gray-200 text-black px-4" >Close</button>
                    </div>
                </div>
            </Modal >
        </>
    )
}


const CustomNoDataComponenet = () => {
    return (
        <div className="w-full p-10 text-center">
            There are no records to displays
        </div>
    );
};

const CustomProgressComponenet = () => {
    return <div className="w-full p-10 text-center">Loading...</div>;
};
