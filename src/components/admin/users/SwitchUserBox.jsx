import React, { useEffect, useMemo, useRef, useState } from "react";
import { Modal } from 'antd';
import { RxCross2 } from 'react-icons/rx';
import DataTable from "react-data-table-component";
import Columns from "./Columns";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@material-tailwind/react";
import { getAllUsersThunkMiddleware, setSingleUserThunkMiddleware } from "../../../redux/features/campaigns";
import { useNavigate } from "react-router-dom";

import "./SwitchUserBoxStyle.css";

import { toast } from "react-toastify";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaExternalLinkAlt } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";

const SwitchUserBox = ({ open, setOpen = function () { } }) => {
  // Function to handle closing the modal
  const { allUsers, singleUser } = useSelector((state) => state.campaigns);
  const handleClose = () => singleUser ? setOpen(false): null;
  const navigate = useNavigate();
  const searchRef = useRef(null);

  useEffect(() => {
    if (navigate) {
      setOpen(false)
    }
  }, [navigate]);

  // Function to handle switching users
  const handleSwitch = () => {
    // Add logic for switching users here
    console.log("User switched");
    handleClose(); // Close the modal after switching
  };

  const dispatch = useDispatch();
  const reversedUsers = useMemo(() => {
    return allUsers ? [...allUsers].reverse() : [];
  }, [allUsers]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [DeleteUser, setDeleteUser] = useState(false);

  const navigateTo = async () => {
    // console.log("selectedUser", selectedUser);
    // storage.set("koncept-law-user", selectedUser);
    if (!selectedUser) return;
    dispatch(setSingleUserThunkMiddleware({ selectedUser: selectedUser }));
    setOpen(false);
    if (!singleUser) return;
    // if (!location.pathname.startsWith("/campaigns")) navigate("/dashboard");
    navigate("/dashboard")
  }
  useEffect(() => {
    if (selectedUser)
      toast.success("Switch Account", { position: "bottom-right", autoClose: 800 });
  }, [selectedUser]);

  useEffect(() => {
    // console.log("single User", singleUser);
    // console.log("Selected User", selectedUser);
    if (selectedUser) navigateTo();
  }, [singleUser, selectedUser]);

  useEffect(() => {
    dispatch(getAllUsersThunkMiddleware());
  }, []);

  const handleSettingSelectedUser = (user) => {
    setSelectedUser(user);
  }

  const DeleteCancel = () => {
    setDeleteUser(false);
  }

  const DeleteConfirm = () => {
    console.log("delete button is been clicked on the user", selectedRow)
    setDeleteUser(false);
  }

  const filteredData = reversedUsers?.filter(item => {
    return (
      item.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${item.firstName} ${item.lastName}`.toLowerCase().includes(searchQuery.toLowerCase().trim())
    );
  });

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      closable={false}
      footer={null} // Hide default footer
      width={800} // Adjust width as needed
      style={{
        borderRadius: "4px",
        overflow: "hidden"
      }}
      centered
    >
      <Modal
        open={DeleteUser}
        onCancel={DeleteCancel}
        closable={false}
        footer={[]}
        centered
      >
        <div className="flex flex-col justify-center w-full items-center">
          <div className="py-3 px-3 flex justify-end bg-slate-800 w-full text-white items-center">
            <button className="cursor-pointer active:text-red-700 transition-all" onClick={DeleteCancel}>
              <RxCross2 size={"20px"} />
            </button>
          </div>
          <div className="bg-white p-3 w-full flex font-poppins font-semibold gap-y-3 text-slate-700 not-italic leading-normal flex-col justify-center items-center">
            <MdDeleteOutline size={"55px"} />
            <p className="font-medium text-center text-[15px] w-full">Do You Want to Delete This User? <br />
              <span className="font-semibold text-lg capitalize">
                {selectedRow?.firstName} {selectedRow?.lastName}
              </span>
            </p>

            <div className="flex justify-end items-center w-full gap-x-1">
              <Button className="bg-gray-100 text-black rounded-sm py-1.5 border border-solid px-3 text-sm shadow-sm hover:shadow-sm capitalize font-poppins font-medium not-italic leading-normal" onClick={DeleteCancel}>No</Button>
              <Button className="bg-red-600 text-white shadow-sm rounded-sm py-1.5 text-sm px-3 hover:shadow-sm capitalize font-poppins font-medium not-italic leading-normal" onClick={DeleteConfirm}>Delete</Button>
            </div>
          </div>
        </div>
      </Modal>

      <div className='flex flex-col w-full h-[500px]'>
        <div className='text-white bg-slate-800 p-3 flex justify-between items-center'>
          <h2 className='font-poppins font-medium not-italic leading-normal'>Switch Account</h2>
          <button onClick={handleClose}>
            <RxCross2 size={"20px"} />
          </button>
        </div>
        <div className="flex justify-center items-center w-full">
          <div className="flex justify-center  shadow-lg shadow-slate-200 w-[90%] my-2 rounded-md overflow-hidden">
            <input ref={searchRef} type="text" placeholder="Search User" className="outline-none font-poppins w-full px-2 py-2 font-medium not-italic leading-normal" onChange={(e)=> setSearchQuery(e.target.value)} />
            <Button className="bg-slate-800 text-white w-[80px] flex justify-center py-2 items-center rounded-none" onClick={() =>{
              //  setSearchQuery(searchRef.current?.value)
              searchRef.current.value = "";
              setSearchQuery("");
            }}>
              {/* <BiSearch size={"18px"} /> */}
              <RxCross2 size={"18px"} />
            </Button>
          </div>
        </div>

        <div className="flex flex-col  overflow-y-scroll h-full w-full px-4">
          {
            filteredData && (
              filteredData.map((item, index) => (
                <div key={index} className="flex justify-between my-2 px-4 w-full items-center">
                  <div className="flex justify-center items-center gap-x-2">
                    <h2 className="not-italic leading-normal font-medium font-poppins text-[16px] text-[#000000]">{index + 1}.</h2>
                    <h2 className="not-italic leading-normal font-medium font-poppins text-[16px] cursor-pointer hover:text-slate-800 hover:font-semibold active:text-slate-600 transition-all text-[#000000]" onClick={() => {
                      handleSettingSelectedUser(item);
                    }}>{item?.firstName} {item?.lastName}</h2>
                  </div>
                  <div className="flex justify-center gap-x-2 items-center">
                    <Button
                      className="bg-green-700 rounded-sm p-2 cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        handleSettingSelectedUser(item);
                      }}
                    >
                      <FaExternalLinkAlt size={"14px"} color="white" />
                    </Button>

                    <Button
                      className="bg-red-600 rounded-sm p-2 cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        if (item?._id) {
                          setSelectedRow(item);
                          setDeleteUser(true);
                        }
                      }}
                    >
                      <RiDeleteBin6Line size={"16px"} color="white" />
                    </Button>
                  </div>
                </div>
              ))
            )
          }
        </div>
      </div>
    </Modal>
  );
};

export default SwitchUserBox;
