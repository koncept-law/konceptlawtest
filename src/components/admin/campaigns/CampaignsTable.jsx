import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  deleteCampaigns,
  editCampaignThunkMiddleware,
  filterCampaignFilesThunkMiddleware,
  getAllCampaignThunkMiddleware,
  // getAllCampaignThunkMiddleware,
  getCampaignByNameThunkMiddleware,
  // setCampaigns,
} from "../../../redux/features/campaigns";
import ConfirmMessage from "../../common/ConfirmMessage";
import { MdDeleteOutline } from "react-icons/md";
import { MdOutlineModeEdit } from "react-icons/md";
import { Modal, Popover, Select } from "antd";
import { Button } from "@material-tailwind/react";
import { IoMdAdd } from "react-icons/io";
import { IoReload, IoSearch } from "react-icons/io5";
import { setUser } from "../../../redux/features/user";
import { useForm } from "react-hook-form";



const CustomTableTitle = ({ handleDeleteButton, toggle, selectedUsers }) => {
  const [ShowDeleteConfirmMessage, setShowDeleteConfirmMessage] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { singleUser } = useSelector((state) => state.campaigns);

  const refreshHandler = () => {
    dispatch(getAllCampaignThunkMiddleware({ accountId: singleUser.accountId }));
  };

  const [searchValue, setSearchValue] = useState("");
  const searchHandler = (e) => {
    e.preventDefault();
    dispatch(
      filterCampaignFilesThunkMiddleware({ fileName: searchValue }, () => {
        navigate("filterdata");
      })
    );
  };



  return (
    <div
      className={` flex flex-wrap gap-4 items-center justify-between mb-2 bg-white rounded-lg `}
    >
      <div className="flex">
        <div className=" flex items-center flex-wrap gap-4">
          <h1 className="font-semibold text-xl">Campaigns</h1>

          <Button
            onClick={toggle}
            className=" flex items-center gap-1 capitalize font-poppins not-italic leading-normal buttonBackground px-4 py-1.5 rounded-md text-white font-semibold"
          >
            <IoMdAdd size={20} />
            <span>Add</span>
          </Button>

          <button
            onClick={refreshHandler}
            className=" flex items-center gap-1 buttonBackground px-2 py-1 rounded-md text-white font-semibold"
          >
            <IoReload size={26} />
          </button>
        </div>
      </div>
      <div>
        {
          ShowDeleteConfirmMessage ? <>
            <ConfirmMessage yes="Yes, I am sure" deleteBtn={true} className="flex-col max-h-[80vh]" no="No, I'm not sure!" value={(e) => {
              if (e) {
                handleDeleteButton();
              }
              setShowDeleteConfirmMessage(false);
            }}>
              <MdDeleteOutline size={"50px"} className="mb-3 text-slate-700" />
              <h2 className="text-lg w-full text-center text-slate-700 font-normal">Do You Want to Delete Selected Camapigns(s)?
                <br />
                <div className="flex flex-wrap flex-col gap-y-2 overflow-y-scroll ">
                  {selectedUsers && selectedUsers.map((data, index) => {
                    return (<span key={index} className="font-semibold text-lg capitalize">
                      {data.name}
                    </span>)
                  })
                  }
                </div>
              </h2>
            </ConfirmMessage>
          </> : null
        }
        <div className="flex items-center gap-y-2 flex-wrap gap-x-2">
          <div>
            <form
              onSubmit={searchHandler}
              className=" sm:w-[25rem] flex items-center flex-wrap gap-4  rounded"
            >
              <input
                type="text"
                className="border-2 rounded p-1 flex-1 focus:ring-2 focus:ring-purple-800 outline-none"
                placeholder="Search Files"
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <button
                type="submit"
                className=" flex items-center gap-1 buttonBackground px-2 py-1 rounded-md text-white font-semibold"
              >
                <IoSearch size={26} /> Search
              </button>
            </form>
          </div>
          {
            <button onClick={(e) => {
              e.preventDefault();
              if (selectedUsers?.length !== 0) {
                setShowDeleteConfirmMessage(true);
              }
            }}
              className="bg-red-400 p-1 px-2 rounded-md text-white font-semibold"
            >Delete</button>
          }
        </div>
      </div>
    </div>
  );
};

const CampaignsTable = ({ toggle }) => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [editRow, setEditRow] = useState(null)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { allCampaigns, singleUser } = useSelector((state) => state.campaigns);
  const { getLoader } = useSelector((state) => state.loaders);

  // console.log(allCampaigns);

  const { reset, register, handleSubmit } = useForm();

  const [open, setOpen] = useState(false);
  const [popoverSelected, setPopoverSelected] = useState(null);

  const tableCustomStyles = {
    tableWrapper: {
      style: {
        overflowX: 'auto',  // Enable horizontal scrolling
      },
    },
    headRow: {
      style: {
        // background: "#34201F",
        // background: "linear-gradient(103.45deg, #DFC066 24.76%, #2E1A1B 100%)",
        background: "linear-gradient(90deg, #359ff3 0%, #8256ff 100%)",
        color: "#ffffff",
        fontWeight: "38px",
        fontSize: "14px",
        borderRadius: "5px",
        minHeight: "41px",
        minWidth: "80vw"
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
        minWidth: "80vw"
      },
    },
  };


  const columns = [
    {
      name: "Name",
      selector: (row) => row.name,
      width: "60vw",
    },
    {
      name: "Edit",
      cell: (row) => {

        const handleEditOpen = async (e, rowData) => {
          e.preventDefault();
          // console.log("edit open button has been clicked", rowData);
          await setPopoverSelected(rowData);
          setOpen(true);
        }

        const hide = () => {
          setOpen(false);
        };

        const handleSubmitEdits = (data) => {
          // const myForm = new 
          // e.preventDefault();
          dispatch(editCampaignThunkMiddleware({ campaignId: popoverSelected._id, campaignName: data.editname, accountId: singleUser.accountId }))
          setOpen(false)
        }

        // console.log( "popover selected" , popoverSelected)
        const content = () => {
          return (
            <>
              <div className="relaitve p-2 min-h-[50px] h-fit md:max-w-[400px] flex md:flex-row flex-col w-full md:gap-y-0 gap-y-2 justify-center items-center flex-wrap">
                <form onSubmit={handleSubmit(handleSubmitEdits)} className="flex md:flex-row flex-col md:gap-y-0 gap-y-2 w-full md:w-[80%] justify-around">
                  <input type="text" name="editedname" {...register("editname", { required: true })} defaultValue={popoverSelected ? popoverSelected?.name : ""}
                    placeholder="Edit Campaign Name..." className="md:w-3/4 w-full p-2 text-md rounded-md border-2 border-gray-200" />
                  <button type="submit" className="bg-green-600 font-semibold text-white px-2 py-2 w-full md:w-[50px] rounded-md" >Edit</button>
                </form>
                <button onClick={hide} className="bg-gray-400 w-full p-2 font-semibold text-white rounded-md md:w-[20%]">close</button>
              </div>
            </>
          )
        }

        return (
          <>
            {
              open && (
                <>
                  {
                    popoverSelected._id === row._id && (
                      <Popover placement="left" content={content} open={open} >
                      </Popover>
                    )
                  }
                </>
              )
            }
            <button className="flex bg-green-600 font-semibold text-white rounded-lg justify-center 
            items-center px-3 py-1" onClick={(e) => { handleEditOpen(e, row) }} >
              <span className="text-sm">Edit</span>
            </button>
          </>
        )
      },

      width: "100px"
    },
    {
      name: "Delete",
      width: "100px",
      cell: (row) => {

        const handleDeleteCampaign = (id) => {
          if (!row) {
            return
          }
          const singleUserArr = []
          singleUserArr.push(id);
          dispatch(deleteCampaigns({ userId: singleUserArr, accountId: singleUser.accountId }));
        }

        return (
          <div>
            {
              selectedRow === row ? <>
                < ConfirmMessage yes="Yes, I am sure" deleteBtn={true} saveOrsend="" className="flex-col" no="No, I'm not sure!" value={(e) => {
                  if (e) {
                    // e.preventDefault();
                    handleDeleteCampaign(row._id)
                  }
                  setSelectedRow(false);
                }}>
                  <MdDeleteOutline size={"50px"} className="mb-3 text-slate-700" />
                  <h2 className="text-lg w-full text-center text-slate-700 font-normal">Do You Want to Delete This Campaign?<br />
                    <span className="font-semibold text-lg capitalize">
                      {row.name}
                    </span>
                  </h2>
                </ConfirmMessage >
              </> : null
            }
            < button
              className="bg-red-400 px-2 py-1 rounded-md text-white font-semibold"
              onClick={(e) => {
                e.preventDefault();
                setSelectedRow(row)
              }}
            > Delete
            </button >
          </div>
        )
      }
    },
    // {
    //   name: "Edit",
    //   selector: (row) => {
    //     // const handleEditData = (e , data) => {
    //     //   e.preventDefault();
    //     //   // console.log(data)
    //     //   dispatch(
    //     //     getCampaignByNameThunkMiddleware(
    //     //       {
    //     //         campaignName: data.name,
    //     //       },
    //     //       (error) => {
    //     //         if (!error) {
    //     //           navigate(`edit/${data._id}`);
    //     //         }
    //     //       }
    //     //     )
    //     //   );
    //     // };

    //     return (
    //       <button
    //         // onClick={(e) => handleEditData(e, row)}
    //         onClick={(e) => { setEditModal(true); setEditRow(row) }}
    //         className="flex bg-green-600 font-semibold text-white rounded-lg justify-center items-center px-3 py-1" >
    //         {/* <span><MdOutlineModeEdit size={"14px"} /></span> */}
    //         <span className="text-sm">Edit</span>
    //       </button>
    //     )
    //   },
    //   width: "120px"
    // },
    // {
    //   name: "Delete",
    //   width: "100px",
    //   cell: (row) => {

    //     const handleDeleteCampaign = (id) => {
    //       if (!row) {
    //         return
    //       }
    //       const singleUserArr = []
    //       singleUserArr.push(id);
    //       dispatch(deleteCampaigns({ userId: singleUserArr, accountId: singleUser.accountId }));
    //     }

    //     return (
    //       <div>
    //         {
    //           selectedRow === row ? <>
    //             < ConfirmMessage yes="Yes, I am sure" deleteBtn={true} saveOrsend="" className="flex-col" no="No, I'm not sure!" value={(e) => {
    //               if (e) {
    //                 // e.preventDefault();
    //                 handleDeleteCampaign(row._id)
    //               }
    //               setSelectedRow(false);
    //             }}>
    //               <MdDeleteOutline size={"50px"} className="mb-3 text-slate-700" />
    //               <h2 className="text-lg w-full text-center text-slate-700 font-normal">Do You Want to Delete This Campaign?<br />
    //                 <span className="font-semibold text-lg capitalize">
    //                   {row.name}
    //                 </span>
    //               </h2>
    //             </ConfirmMessage >
    //           </> : null
    //         }
    //         < button
    //           className="bg-red-400 px-2 py-1 rounded-md text-white font-semibold"
    //           onClick={(e) => {
    //             e.preventDefault();
    //             setSelectedRow(row)
    //           }}
    //         > Delete
    //         </button >
    //       </div>
    //     )
    //   }
    // },
  ];

  const rowClickHandler = (campaignDetails) => {
    dispatch(
      getCampaignByNameThunkMiddleware(
        {
          campaignName: campaignDetails.name,
        },
        (error) => {
          if (!error) {
            navigate("campaigndetails");
          }
        }
      )
    );
  };

  const [multiSelectRows, setMultiSelectRows] = useState([]);
  // const [seletedUsersId , SetSelectedUsersId] = useState(null)

  const handleSelectedRowsChange = (state) => {
    // selected rows is the property of the datatable rows
    setMultiSelectRows(state.selectedRows); // Update the selected rows state
  };

  const handleMultiSelectClick = () => {
    let userIdArr = [];
    multiSelectRows.forEach((row) => {
      userIdArr.push(row._id);
    })
    // console.log("all data in the selected row multiselected rows", multiSelectRows); // Log the selected rows data
    // console.log("userId array", userIdArr);
    dispatch(deleteCampaigns({ userId: userIdArr }))
  };

  useEffect(() => {
    if (!singleUser) {
      return;
    }
    if (singleUser) {
      // dispatch(setUser({ singleUser : null}))
      dispatch(getAllCampaignThunkMiddleware({ accountId: singleUser.accountId }));
    }
  }, [singleUser]);

  // console.log(allCampaigns)

  return (
    <div className="h-full">
      <div className="h-fit min-h-[10%]">
        <CustomTableTitle
          handleDeleteButton={handleMultiSelectClick}
          toggle={toggle}
          selectedUsers={multiSelectRows}
        // selectedRows={selectedRows()}
        />
      </div>
      <div className="relative md:h-[90%] h-fit z-0 md:w-[100%]  horizontal-container overflow-scroll table-container">
        <DataTable
          columns={columns}
          // changes done by Abhyanshu - reverse the data showing order
          data={allCampaigns ? allCampaigns.slice().reverse() : []}
          // data={allCampaigns ? allCampaigns : []}
          pagination
          selectableRows
          onSelectedRowsChange={handleSelectedRowsChange}
          customStyles={tableCustomStyles}
          progressPending={getLoader}
          onRowClicked={rowClickHandler}
          responsive={true}
          noDataComponent={<CustomNoDataComponenet />}
          progressComponent={<CustomProgressComponenet />}
        fixedHeader
        fixedHeaderScrollHeight="90%"
        />
      </div>
      {/* {editModal && <EditCampaignModal editModal={editModal} setEditModal={setEditModal} editRow={editRow} accountId={singleUser.accountId} />} */}
    </div>
  );
};

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


// export const EditCampaignModal = ({ editModal, setEditModal, editRow, accountId }) => {

//   const handleOk = () => {
//     setEditModal(false);
//   };

//   const handleCancel = () => {
//     setEditModal(false);
//   };

//   // const { campaignDetails } = useSelector((state) => state.campaigns)
//   // console.log(campaignDetails);

//   const [name, setName] = useState(editRow.name);
//   const dispatch = useDispatch();
//   // const handleClose = () => {
//   //   setEditModal(false);
//   // };
//   const handleSubmitEdits = (e) => {
//     // const myForm = new 
//     e.preventDefault();
//     dispatch(editCampaignThunkMiddleware({ campaignId: editRow._id, campaignName: name, accountId: accountId }))
//     // console.log("Edit is being used by the button");
//     // console.log("name:" , name)
//     setEditModal(false)
//   }

//   return (
//     <Modal width={"90%"} centered open={editModal} onCancel={handleCancel} onOk={handleOk} cancelButtonProps={{ hidden: true }}
//       okButtonProps={{ hidden: true }} >
//       <div className='sm:h-[20vh] h-[40vh] flex justify-around w-full items-center overflow-y-auto px-6 py-4 gap-2 md:gap-4'>
//         <div className='flex w-full sm:flex-row flex-col flex-wrap gap-2 justify-around bg-white rounded-md'>
//           <h1 className='sm:w-2/6 sm:text-xl text-center sm:text-start text-md font-semibold'>Edit Campaign Name</h1>
//           <form onSubmit={handleSubmitEdits} className="flex sm:flex-row flex-col sm:w-3/6 gap-y-2 sm:gap-2">
//             <input type="text" className='sm:w-4/6 w-full bg-gray-100 border min-h-fit h-[40px] p-2 sm:h-[40px] border-gray-400 rounded-md sm:p-2' value={name} onChange={(e) => setName(e.target.value)} />
//             <div className="flex sm:justify-start justify-center w-full sm:w-2/6">
//               <button type='submit' className="w-fit sm:p-2 rounded-md p-2 min-h-fit bg-green-600 h-[40px] text-white font-semibold">Submit</button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </Modal>
//   )
// }


export default CampaignsTable;
