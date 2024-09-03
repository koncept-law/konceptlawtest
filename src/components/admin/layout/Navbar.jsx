import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { toastify } from "../../toast";
import { FaUserCircle } from "react-icons/fa";
import { TiSpanner } from "react-icons/ti";
import { AiOutlineLogout } from "react-icons/ai";
import { MdDeleteOutline, MdOutlineClose } from "react-icons/md";
import { RiMenuFoldFill, RiMenuUnfoldFill } from "react-icons/ri";
import { MdDeleteForever } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import axios from "axios";
import { TiThMenu } from "react-icons/ti";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { passwordChangeSchema } from "../../../common/constant/validation";
import logo from "./../../../assets/konceptLogo.png";
import { useDispatch, useSelector } from "react-redux";
import { setMiscellaneous } from "../../../redux/features/miscellaneous";
import { logoutThunkMiddleware, setUser } from "../../../redux/features/user";
import { toast } from "react-toastify";
import { deleteUserThunkMiddleware, getAllUsersThunkMiddleware, setCampaigns, setSingleUserThunkMiddleware } from "../../../redux/features/campaigns";
import { Modal } from "antd";
import DataTable from "react-data-table-component";
import ConfirmMessage from "../../common/ConfirmMessage";
import { IoSearch } from "react-icons/io5";

const Navbar = () => {
  const { user } = useSelector((state) => state.user);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(passwordChangeSchema),
  });

  const dispatch = useDispatch();
  const { documentSidebar, trackingSidebar, excelSidebar } = useSelector(
    (state) => state.miscellaneous
  );

  const { allUsers, singleUser } = useSelector((state) => state.campaigns);
  // all users in the app
  const reversedUsers = useMemo(() => {

    return allUsers ? [...allUsers].reverse() : [];
  }, [allUsers])

  const navigate = useNavigate();
  const location = useLocation();

  const [profileDropDownOpen, setProfileDropDownOpen] = useState(false);
  const [navTopbar, setNavTopbar] = useState(false);

  // changes made by abhyanshu
  // const [campaignNavigationModal, setCampaignNavigationModal] = useState(false);
  const [isUserModal, setIsUserModal] = useState(false);
  // const [allUsers, setAllUsers] = useState(null);
  // const { singleUser } = useSelector((state) => state.campaigns);

  const [modal, setModal] = useState(false);
  const toggle = () => setModal((prev) => !prev);

  const changePasswordHandler = async (data) => {
    try {
      const token = localStorage.getItem("konceptLawToken");
      const response = await axios.post(`https://m.konceptlaw.in/api/reset`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toastify({ msg: response.data, type: "success" });
    } catch (error) {
      if (error.response?.status === 403) {
        localStorage.clear();
        navigate("/login");
      } else if (error.response?.data) {
        // toastify({ msg: error.response.data, type: "error" });
        toastify({ msg: error.response.data.message, type: "error" });
      } else {
        toastify({ msg: error.message, type: "error" });
      }
    }
  };

  const logoutHandler = () => {
    dispatch(logoutThunkMiddleware());
    setProfileDropDownOpen((prev) => (prev = false));
    toastify({ msg: "Logout Successfully", type: "success" });
  };

  const SidebarToggle = () => {
    if (location.pathname === "/document") {
      dispatch(setMiscellaneous({ documentSidebar: !documentSidebar }));
    } else if (location.pathname === "/tracking") {
      dispatch(setMiscellaneous({ trackingSidebar: !trackingSidebar }));
    } else if (location.pathname === "/exceldocument") {
      dispatch(setMiscellaneous({ excelSidebar: !excelSidebar }));
    }
  };

  // DropDown Menu Close Functionality
  const dropDownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
        // Clicked outside of the dropdown, so close it
        setProfileDropDownOpen(false);
      }
    }

    // Add the event listener
    document.addEventListener("click", handleClickOutside);

    // Remove the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // changes made by abhyanshu
  const handleCampaignNavigation = () => {
    // console.log("campaign navigation button selected");
    // console.log("all users" , allUsers)
    if (location.pathname.startsWith("/campaigns")) {
      return;
    }
    if (allUsers && !location.pathname.startsWith("/campaigns")) {
      dispatch(setCampaigns({ singleUser: null }));
      // setIsUserModal(true);
      // console.log( "single User when modals open" , singleUser)
      navigate("/select-user");
    }
  }

  useEffect(() => {
    try {
      dispatch(getAllUsersThunkMiddleware())
    } catch (error) {
      console.log(error)
    }
  }, []);

  useEffect(() => {
    // console.log(allUsers)
    // console.log("single User ", singleUser)
  }, [singleUser])
  // }, [allUsers, singleUser])

  // console.log(singleUser)

  return (
    <>
      <div className="relative px-6 gap-2  flex items-center flex-wrap py-2 justify-between bg-white z-30 shadow-lg">
        {/* Navbar Logo and Sidebar Toggle */}
        <div className=" flex items-center gap-4">
          {location.pathname === "/document" && (
            <div
              className=" md:hidden cursor-pointer text-black text-2xl sm:text-3xl font-bold"
              onClick={SidebarToggle}
            >
              {documentSidebar ? <RiMenuFoldFill /> : <RiMenuUnfoldFill />}
            </div>
          )}

          {/* Excel Document Sidebar Toggle  */}
          {location.pathname === "/exceldocument" && (
            <div
              className=" md:hidden cursor-pointer text-black text-2xl sm:text-3xl font-bold"
              onClick={SidebarToggle}
            >
              {excelSidebar ? <RiMenuFoldFill /> : <RiMenuUnfoldFill />}
            </div>
          )}

          {/* Tracking Filter Sidebar Toggle  */}
          {location.pathname === "/tracking" && (
            <div
              className=" md:hidden cursor-pointer text-black text-2xl sm:text-3xl font-bold"
              onClick={SidebarToggle}
            >
              {trackingSidebar ? <RiMenuFoldFill /> : <RiMenuUnfoldFill />}
            </div>
          )}

          <div className=" flex items-center gap-2">
            <div className=" sm:w-[4rem] sm:h-[2.5rem] w-[2rem] h-[2rem] flex">
              <img src={logo} alt="logo" className=" w-full h-full" />
            </div>
            <div>
              <p className=" hidden sm:block text-2xl ml-2 font-bold logo-color">
                Koncept Law Associates
              </p>
              <p className=" sm:hidden block text-2xl  font-bold logo-color">
                KLA
              </p>
            </div>
          </div>
          <h1
            className="sm:text-xl  md:text-2xl text-sm font-bold text-black"
            style={{
              wordSpacing: "-2px",
            }}
          >
            {/* <span className="hidden sm:block"> Koncept Law Associates</span> */}
          </h1>
        </div>

        {/* Navbar Links  */}
        <div className=" flex gap-2 sm:gap-3 md:gap-5 lg:gap-6 text-md">
          {user && user.profile === "superAdmin" && (
            <NavLink className={`nav-link hidden md:block`} to={"/dashboard"}>
              Dashboard
            </NavLink>
          )}

          <NavLink className={`nav-link hidden md:block`} to={"/document"}>
            Document
          </NavLink>

          {/* <NavLink className={`nav-link hidden md:block`} to={"/campaigns"}>
            Campaigns
          </NavLink> */}
          {/* // changes made by abhyanshu */}
          {user && user.profile === "superAdmin" && (
            <div
              className={`nav-link hidden md:block cursor-pointer`}
              onClick={() => { handleCampaignNavigation(); }}
            >
              Campaigns
            </div>
          )}

          {/* {user && user.profile === "superAdmin" && (
            <NavLink className={`nav-link hidden md:block`} to={"/tracking"}>
              Tracking
            </NavLink>
          )} */}

          {/* {user && user.profile === "superAdmin" && (
            <NavLink className={`nav-link hidden md:block`} to={"/uploadfile"}>
              Start Campaign
            </NavLink>
          )} */}

          {/* Menu Button  */}
          <div
            className="text-2xl md:hidden cursor-pointer"
            onClick={() => setNavTopbar((prev) => !prev)}
          >
            <TiThMenu />
          </div>

          {/* Profile DropDown  */}
          <div className=" grid place-items-center " ref={dropDownRef}>
            <span
              className="text-2xl cursor-pointer"
              onClick={() => setProfileDropDownOpen((prev) => !prev)}
            >
              <FaUserCircle />
            </span>

            <div
              className={`${profileDropDownOpen ? "flex" : "hidden"
                } rounded z-20  flex-col mx-4 absolute top-[90%] right-0 border-2 bg-white shadow`}
            >
              <div className=" h-3 w-3 bg-white border-t-2 border-l-2 absolute right-3 -top-2 rotate-45"></div>
              <p className=" px-4 py-2 text-md font-semibold border-b-2">
                Welcome
              </p>
              <Link
                onClick={() => {
                  setProfileDropDownOpen((prev) => (prev = false));
                  toggle();
                }}
              >
                <div className="  hover:bg-sky-100 px-4 py-2 border-b-2 text-md flex items-center gap-2">
                  <span className=" text-2xl bg-pink-600 p-1 rounded-full shadow text-white">
                    <TiSpanner />
                  </span>
                  <span>Change Password</span>
                </div>
              </Link>
              <Link onClick={logoutHandler}>
                <div className="  hover:bg-sky-100 px-4 py-2 border-b-2 text-md flex items-center gap-2">
                  <span className=" text-2xl bg-blue-600 p-1 rounded-full shadow text-white">
                    <AiOutlineLogout />
                  </span>
                  <span>Logout</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Phone Navbar  */}
      <div
        className={`  md:hidden absolute bg-white  w-full ${navTopbar ? "h-[12rem]" : "h-0"
          }  top-0 left-0 z-20 overflow-hidden  transition-all duration-300`}
      >
        <div className=" flex flex-col justify-center items-center gap-2 pt-[5rem]">
          {user && user.profile === "superAdmin" && (
            <NavLink
              className={`nav-link`}
              to={"/dashboard"}
              onClick={() => setNavTopbar((prev) => !prev)}
            >
              Dashboard
            </NavLink>
          )}

          <NavLink
            className={`nav-link`}
            to={"/document"}
            onClick={() => setNavTopbar((prev) => !prev)}
          >
            Document
          </NavLink>

          {/* {user && user.profile === "superAdmin" && (
            <NavLink
              className={`nav-link`}
              // changes made by abhyanshu
              // to={"/tracking"}
              to={"/campaigns"}
              onClick={() => setNavTopbar((prev) => !prev)}
            >
              changes made by abhyanshu
              Tracking
              Campaign
            </NavLink>
          )} */}
          {/* changes made by abhyanshu */}
          {user && user.profile === "superAdmin" && (
            <div
              className={`nav-link md:hidden block cursor-pointer`}
              onClick={() => { handleCampaignNavigation(); }}
            >
              Campaigns
            </div>
          )}

        </div>
      </div>

      {/*Change Password Model  */}
      <div
        className={` ${modal ? "fixed" : "hidden"
          } fixed top-0 left-0 w-[100%] h-[100%] z-40 flex  justify-center`}
      >
        {/* OverLay  */}
        <div
          className="absolute w-[100%] h-[100%] bg-black opacity-25"
        // onClick={toggle}
        ></div>

        {/* Conetnt  */}
        <div className=" bg-white rounded-lg w-[90%] md:w-[60%]  p-2 absolute z-10  mt-10">
          {/* Model Header  */}
          <div className="modelHeadingBackground p-3 rounded flex items-center justify-between text-white">
            <h1 className=" text-xl font-semibold">Change Password</h1>
            <span
              className=" text-black text-xl cursor-pointer"
              onClick={toggle}
            >
              <MdOutlineClose />
            </span>
          </div>

          {/* Model Body  */}
          <div className="px-2 py-1  my-2 h-[100%] rounded">
            <form
              onSubmit={handleSubmit(changePasswordHandler)}
              className=" space-y-3"
            >
              <div className=" flex flex-col gap-1 rounded">
                <label htmlFor="currentPassword" className=" font-semibold">
                  Current Password :
                </label>
                <input
                  id="currentPassword"
                  name="currentPassword"
                  type="text"
                  {...register("currentPassword")}
                  className="border-2 rounded p-1 flex-1 focus:ring-2 focus:ring-blue-800 outline-none"
                />
                <p className="text-red-500">
                  {errors.currentPassword?.message}
                </p>
              </div>

              <div className=" flex flex-col gap-1 rounded">
                <label htmlFor="newPassword" className=" font-semibold">
                  New Password :
                </label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="text"
                  {...register("newPassword")}
                  className="border-2 rounded p-1 flex-1 focus:ring-2 focus:ring-blue-800 outline-none"
                />
                <p className="text-red-500">{errors.newPassword?.message}</p>
              </div>

              <div className=" flex flex-col gap-1 rounded">
                <label htmlFor="confirmPassword" className=" font-semibold">
                  Confirm New Password :
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="text"
                  {...register("confirmPassword")}
                  className="border-2 rounded p-1 flex-1 focus:ring-2 focus:ring-blue-800 outline-none"
                />
                <p className="text-red-500">
                  {errors.confirmPassword?.message}
                </p>
              </div>

              <div className=" py-4">
                <button
                  type="submit"
                  className="p-3 rounded modelHeadingBackground text-white font-bold hover:bg-transparenttransition-all duration-300 w-full"
                >
                  Change
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {isUserModal && <UsersSelectionModal
        // allUsers={reversedUsers} 
        allUsers={reversedUsers}
        setIsUserModal={setIsUserModal}
        isUserModal={isUserModal} />}
    </>
  );
};

export default Navbar;



export const UsersSelectionModal = ({ allUsers, isUserModal, setIsUserModal }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { singleUser } = useSelector((state) => state.campaigns);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);


  const handleDelete = async (accountId) => {
    // console.log("delete user");
  }

  // const handleRowClick = (rowData)=>{
  //   // console.log("row clicked" , rowData)
  //   console.log("row clicked" , rowData)
  // }

  useEffect(() => {
    if (selectedUser) {
      navigateTo();
    }
  }, [singleUser, selectedUser])

  const navigateTo = async () => {
    if (!selectedUser) {
      return;
    }
    if (selectedUser) {
      dispatch(setSingleUserThunkMiddleware({ selectedUser: selectedUser }));
    }

    if (!singleUser) {
      return;
    }
    if (singleUser) {
      if (!location.pathname.startsWith("/campaigns")) {
        navigate("/campaigns");
      }
    }
    setIsUserModal(false);
  }

  const handleSettingSelectedUser = (user) => {
    // e.preventDefault();
    // dispatch(setSingleUserThunkMiddleware({ selectedUser: user }));
    setSelectedUser(user);
    // setIsUserModal(false);
  }

  const handleCancel = () => {
    setIsUserModal(false);
  }

  // Function to handle row deletion
  // const handleDelete = (rowId) => {
  //   const filteredData = data.filter(item => item.id !== rowId);
  //   setData(filteredData);
  // };

  const handleCloseBtn = () => {
    setIsUserModal(false);
  }

  // table styles 
  const tableCustomStyles = {
    header: {
      style: {
        fontSize: '1.5rem',
        color: '#333',
        backgroundColor: '#f1f1f1',
        minHeight: '56px',
      },
    },
    headRow: {
      style: {
        background: "linear-gradient(90deg, #359ff3 0%, #8256ff 100%)",
        color: "#ffffff",
        borderBottomWidth: '1px',
        borderBottomColor: '#ccc',
        borderBottomStyle: 'solid',
      },
    },
    headCells: {
      style: {
        color: "#ffffff",
        fontSize: '16px',
        fontWeight: '500',
      },
    },
    rows: {
      style: {
        minHeight: '48px', // override the row height
        '&:not(:last-of-type)': {
          borderBottomStyle: 'solid',
          borderBottomWidth: '1px',
          borderBottomColor: '#ccc',
        },
      },
    },
  }

  // Define columns
  const columns = [
    {
      name: 'Name',
      selector: row => (
        <div
          onClick={
            // row.firstName === "sanjana" ? () => console.log("sanjana campaign") :
            (e) => {
              handleSettingSelectedUser(row);
            }}
          className="font-semibold capitalize cursor-pointer">{row.firstName}  {row.lastName}</div>
      ),
      // sortable: true,
      width: "60vw"
    },
    {
      name: "Delete",
      width: "100px",
      cell: (row) => {

        const handleDeleteUser = (id) => {
          // if (!row) {
          //   return
          // }
          // const singleUserArr = []
          // singleUserArr.push(id);
          // dispatch(deleteCampaigns({ userId: singleUserArr, accountId: singleUser.accountId }));
          console.log("delete button is been clicked on the user", id)
        }

        return (
          <div>
            {
              selectedRow === row ? <>
                < ConfirmMessage yes="Yes, I am sure" deleteBtn={true} saveOrsend="" className="flex-col" no="No, I'm not sure!" value={(e) => {
                  if (e) {
                    // e.preventDefault();
                    handleDeleteUser(row._id)
                  }
                  setSelectedRow(false);
                }}>
                  <MdDeleteOutline size={"50px"} className="mb-3 text-slate-700" />
                  <h2 className="text-lg w-full text-center text-slate-700 font-normal">Do You Want to Delete This User? <br />
                    <span className="font-semibold text-lg capitalize">
                      {row.firstName} &nbsp;{row.lastName}
                    </span>
                  </h2>
                </ConfirmMessage >
              </> : null
            }
            < button
              className="bg-red-600 rounded-md p-2 cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                setSelectedRow(row)
              }}
            >
              <RiDeleteBin6Line className="" size={"18px"} color="white" />
            </button >
          </div>
        )
      }
    }
  ];

  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  }

  const handleSearch = () => {
    // if(event.key === "enter"){
    //   setSearchQuery(searchInput);
    // }
    setSearchQuery(searchInput);
  };

  const filteredData = allUsers?.filter(item => {
    return (
      item.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${item.firstName} ${item.lastName}`.toLowerCase().includes(searchQuery.toLowerCase().trim())
      // ||
      // item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      // item.id.toString().includes(searchQuery)
    );
  });

  return (
    <div>
      <div className="absolute w-[100%] h-[100%] bg-black opacity-25"></div>
      <Modal width={"90%"} centered open={isUserModal}
        onCancel={handleCancel}
        cancelButtonProps={{ hidden: true }}
        okButtonProps={{ hidden: true }}
        closable={false}
      >
        <div className="bg-white rounded-lg w-[100%] md:w-[100%] mx-auto min-h-[80vh]">
          <div className="modelHeadingBackground p-3 border-blue-800 rounded flex items-center justify-between">
            <h1 className="text-white text-xl font-semibold">Select User</h1>
            <span
              className=" text-black text-xl cursor-pointer"
              onClick={handleCloseBtn}
            >
              <MdOutlineClose />
            </span>
          </div>
          <div className='bg-gray-200 flex gap-x-4 p-2 my-2 rounded-md sm:h-[60px] h-fit flex-wrap gap-y-2'
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
          </div>
          <div className="w-[100%] mx-auto py-2 rounded-md h-[100%] overflow-y-scroll">
            <DataTable
              // data={allUsers ? allUsers : []}
              data={filteredData ? filteredData : []}
              columns={columns}
              // onRowClicked={handleSettingSelectedUser}
              customStyles={tableCustomStyles}
              responsive={true}
              noDataComponent={<CustomNoDataComponenet />}
              progressComponent={<CustomProgressComponenet />}
              fixedHeader
              fixedHeaderScrollHeight="60vh"
            />

          </div>
        </div>
      </Modal>
    </div>
  );
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
