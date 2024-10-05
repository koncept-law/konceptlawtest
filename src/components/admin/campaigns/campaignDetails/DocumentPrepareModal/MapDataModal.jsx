import { Modal, Select } from "antd";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { MdOutlineClose } from "react-icons/md";
import MoonLoader from "react-spinners/MoonLoader";
import { setLoader } from "../../../../../redux/features/loaders";
import { sendDocumentVaribleValuesThunkMiddleware } from "../../../../../redux/features/campaigns";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../../../../common/Spinner";
import { Button } from "@material-tailwind/react";
import { toastifyError } from "../../../../../constants/errors";
import { useNavigate } from "react-router-dom";

const MapDataModal = ({ isMapDataModal, setIsMapDataModal, campaignType }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [saveButton, setSaveButton] = useState(false);
    const [dropDownList, setDropDownList] = useState(null);
    const [documentVariables, setDocumentVariables] = useState(null);
    const [selectedOptionList, setSelectedOptionList] = useState([]);

    // const { documentTemplateCategories } = useSelector((state) => state.campaigns);
    // console.log(documentTemplateCategories);
    // const [document]

    // const { documentVariables } = useSelector((state)=> state.campaigns)

    const {
        // documentVariables,
        campaignDetails
    } = useSelector((state) => state.campaigns);

    const { loader, addLoader } = useSelector((state) => state.loaders)

    // console.log("loaders display start")
    // console.log("loader normal ", loader)
    // console.log("loader add loader ", addLoader)
    // console.log("loader get loader  ", getLoader)
    // console.log("loader login loader ", loginLoader)
    // console.log("loader register loader ", registerLoader)
    // console.log("loaders display end ")


    // console.log(dropDownList)

    useEffect(() => {

        const abortController = new AbortController();
        const getDocumentVariables = async () => {
            try {
                dispatch(setLoader({ loader: true }))
                const response = await axios.post("https://t.kcptl.in/docs/getPlaceholders", { campaignName: campaignDetails.name },
                    { signal: abortController.signal }
                );

                if (response.status === 200) {
                    setDocumentVariables(response?.data.uniqueArray)
                    setDropDownList(response?.data.headers);
                }
            }

            // catch (error) {
            //   console.log(error)
            // }
            catch (error) {
                // if (axios.isCancel(error)) {
                //     console.error('Request canceled', error.message);
                // } else {
                //     console.error('Error fetching data', error);
                // }
                toastifyError(error, (call)=> {
                    if(call === "logout"){
                      navigate("/login");
                    }
                  })
                dispatch(setLoader({ loader: false }));
            }
            finally {
                dispatch(setLoader({ loader: false }))
            }
        }

        getDocumentVariables();

        return () => {
            abortController.abort();
        };

    }, []);

    const handleModalClose = () => {
        setIsMapDataModal(false)
    }

    const handleDropDownListChange = async (item, value) => {

        try {
            setSelectedOptionList((prevValues) => {
                // Check if the variable already exists in the array
                const existingVariableIndex = prevValues.findIndex(
                    (exData) => exData.variableName === item
                );

                // console.log(existingVariableIndex)

                // Create a new array to avoid mutating the previous state directly
                const updatedValues = [...prevValues];

                if (value === "" || value === "select") {
                    // If the value is empty or "select", remove the variable from the array
                    if (existingVariableIndex !== -1) {
                        updatedValues.splice(existingVariableIndex, 1);
                    }
                } else {
                    // If the variable exists, update its value
                    if (existingVariableIndex !== -1) {
                        updatedValues[existingVariableIndex].variableExcelValue = value;
                    } else {
                        // If the variable does not exist, add a new object to the array
                        updatedValues.push({
                            variableName: item,
                            variableExcelValue: value,
                            // variableExcelValue: `row[${value}]`,
                        });
                    }
                }

                return updatedValues;
            });
        } catch (error) {
            console.error(error);
        }

        // try {
        //   const variableName = item;
        //   setSelectedOptionList((prevValues) => {
        //     const updatedValues = {
        //       ...prevValues,
        //       [`"${variableName}"`]: `row['${value}']`,
        //     };
        //     if (value === "" || value === "select") {
        //       delete updatedValues[variableName];
        //     }
        //     return updatedValues;
        //   });
        // } catch (error) {
        //   console.log(error);
        // }
    };


    // console.log("selected option list array of objects type data", selectedOptionList);

    const handleMappedVariableValuesSend = async () => {
        let i = 0

        if (saveButton !== true) {
            return;
        }
        if (saveButton) {
            try {
                dispatch(setLoader({ addLoader: true }));
                // console.log(addLoader)
                await dispatch(sendDocumentVaribleValuesThunkMiddleware({
                    selectedVariablesValues: selectedOptionList,
                    campaignName: campaignDetails.name, campaignType
                }, (error) => {
                    if (!error) {
                        setIsMapDataModal(false);
                        // dispatch(getUserAllCampaignThunkMiddleware({ accountId : singleUser.accountId }));
                    }
                }));
            } catch (error) {
                console.error("error", error)
                // dispatch(setLoader({ addLoader: false }));
            } finally {
                dispatch(setLoader({ addLoader: false }))
            }
            // dispatch(sendDocumentVaribleValuesThunkMiddleware({
            //   selectedVariablesValues: selectedOptionList,
            //   campaignName: campaignDetails.name, campaignType
            // }, (error) => {
            //   if (!error) {
            //     setIsMapDataModal(false);
            //     // dispatch(getUserAllCampaignThunkMiddleware({ accountId : singleUser.accountId }));
            //   }
            // }));
        }
    }

    // const handleClose = () => {
    //   setIsMapDataModal(false)
    // }

    useEffect(() => {
        const setListLength = Object.keys(selectedOptionList);
        // console.log("length of all the selected options", setListLength.length);
        // console.log("list of all the selected option , check if the values are of varaible or the dropdown in key",
        //  selectedOptionList)
        if (documentVariables?.length === setListLength.length) {
            setSaveButton(true)
        }

        // console.log(selectedOptionList)
    }, [selectedOptionList]);


    const columns = [
        {
            name: "Variables",
            selector: (row) => row,
            width: "40vw",
        },
        {
            name: "Values",
            width: "300px",
            cell: (row) => {
                // const handleSearch = (value) => {
                //   console.log('search:', value);
                // };
                return (
                    <div className="w-[300px]">
                        <Select
                            showSearch
                            placeholder="Select an Option"
                            className="w-full"
                            onChange={(value) => handleDropDownListChange(row, value)}
                            // onSearch={handleSearch}
                            options={[
                                { label: "Select an Option", value: "select" },
                                // ...(dropDownList?.headers.map((option) => ({label: option, value: option })) || [])
                                ...(dropDownList?.map((option) => ({ label: option, value: option })) || [])
                            ]}
                        />
                    </div>
                )
            }
        }
        // {
        //   name: "File Type",
        //   selector: (row) => row.fileType,
        //   width: 20,
        // },
    ];

    const tableCustomStyles = {
        headRow: {
            style: {
                background: "linear-gradient(90deg, #359FF3 0%, #8256FF 100%)",
                color: "#ffffff",
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
        setIsMapDataModal(false);
    }


    return (
        <>
            {/* <div className="absolute w-[90%] h-[90%] bg-black opacity-25"></div> */}
            <Modal
                width={"90%"} centered open={isMapDataModal}
                onCancel={handleModalClose}
                cancelButtonProps={{ hidden: true }}
                okButtonProps={{ hidden: true }}
                closable={false}
            // onOk={handleOk}
            // loading={loader}
            >

                <div className="relative min-h-[80vh] h-[80vh] w-[100%] mx-auto flex flex-col gap-y-4 ">
                    <div className="modelHeadingBackground p-3 border-blue-800 rounded flex items-center justify-between">
                        {/* <h1 className="text-white  text-xl font-semibold">Select Variable Values</h1> */}
                        <h1 className="text-white  text-xl font-semibold">Select Variable</h1>
                        <span
                            className=" text-white text-xl cursor-pointer"
                            onClick={handleCloseBtn}
                        >
                            <MdOutlineClose />
                        </span>
                    </div>
                    <div className="w-full mx-auto py-1 rounded-md h-[100%] table-container overflow-y-scroll">
                        <DataTable
                            columns={columns}
                            // changes done by Abhyanshu - reverse the data showing order
                            data={documentVariables ? documentVariables?.slice().reverse() : []}
                            // data={allCampaigns ? allCampaigns : []}
                            // pagination
                            // selectableRows
                            // onSelectedRowsChange={handleSelectedRowsChange}
                            customStyles={tableCustomStyles}
                            progressPending={loader}
                            // onRowClicked={rowClickHandler}
                            responsive={true}
                            noDataComponent={<CustomNoDataComponenet />}
                            progressComponent={<CustomProgressComponenet />}
                        />
                    </div>
                </div>
                <div className="flex justify-end flex-wrap py-2 px-4 right-0 bottom-0">
                    {/* ${saveButton ? "bg-green-600" : "bg-green-200 disabled"}  */}
                    < Button type="submit" onClick={handleMappedVariableValuesSend} disabled={addLoader} className={` 
                    ${saveButton ? "bg-green-600" : "bg-green-200 disabled"} ${addLoader ?  "bg-green-400 disabled" : "bg-green-600" }
                    rounded-md capitalize not-italic leading-normal font-poppins py-2 px-4 w-fit cursor-pointer text-white min-h-fit h-[40px] flex justify-center items-center mx-2 font-semibold shadow-sm`} >
                        {addLoader ? <span className="flex"><Spinner/></span> : "Save"}
                    </Button>
                    {/* <button onClick={handleSetLoader} >SetLoader</button> */}
                    <Button onClick={() => handleModalClose()} className="p-2 rounded-md w-fit cursor-pointer
                font-semibold capitalize leading-normal not-italic font-poppins shadow-sm bg-gray-200 text-black px-4" >Close</Button>
                </div>
            </Modal >
        </>
    )
}

export default MapDataModal;

const CustomNoDataComponenet = () => {
    return (
        <div className="w-full p-10 text-center">
            There are no records to displays
        </div>
    );
};

const CustomProgressComponenet = () => {
    return <div className="w-full p-10 text-center"><Spinner /></div>;
};

