import React, { useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import { MdOutlineClose } from "react-icons/md";
import Columns from "./Columns";
import { useDispatch, useSelector } from "react-redux";
import { IoSearch } from "react-icons/io5";
import { Button } from "@material-tailwind/react";
import { setSingleUserThunkMiddleware } from "../../../redux/features/campaigns";
import { useNavigate } from "react-router-dom";
import UserStats from "./UserStats";

const SelectUser = () => {
  const { allUsers, singleUser } = useSelector((state) => state.campaigns);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const reversedUsers = useMemo(() => {
    return allUsers ? [...allUsers].reverse() : [];
  }, [allUsers])

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

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
  }

  useEffect(() => {
    if (selectedUser) {
      navigateTo();
    }
  }, [singleUser, selectedUser])


    const handleSettingSelectedUser = (user) => {
        // e.preventDefault();
        // dispatch(setSingleUserThunkMiddleware({ selectedUser: user }));
        setSelectedUser(user);
        // setIsUserModal(false);
      }

      const filteredData = reversedUsers?.filter(item => {
        return (
          item.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          `${item.firstName} ${item.lastName}`.toLowerCase().includes(searchQuery.toLowerCase().trim())
          // ||
          // item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          // item.id.toString().includes(searchQuery)
        );
      });

    const tableCustomStyles = {
        header: {
          style: {
            fontSize: '1.5rem',
            color: '#333',
            backgroundColor: '#f1f1f1',
            minHeight: '56px',
            width: "100%"
          },
        },
        table: {
            style: {
              borderRadius: '4px',
              overflow: 'auto', // Ensure the table scrolls horizontally if needed
              width: "100%",
            //   height: "600px"
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

    return <>
       <div className="w-full bg-[#c2c0c0]">
      <div className="w-full flex flex-col justify-center px-3 py-2 bg-[#c2c0c0] items-center">
           <UserStats /> 
          {/* <div className="flex justify-center w-full items-center gap-x-3 py-4"
            // onKeyDown={handleKeyDown}
            tabIndex={0}
          >
            <div className="rounded-md bg-white w-full flex justify-center overflow-hidden">
            <input
              type="text"
              className="outline-none w-full px-3 py-3"
              placeholder="Search Now"
            //   onChange={handleInputChange}
            // onKeyDown={handleSearch}  
            />
            <Button
              type="submit"
              className=" buttonBackground capitalize font-poppins not-italic leading-normal font-medium rounded-none text-white flex justify-center gap-x-2 items-center w-[140px]"
              onClick={() => handleSearch()}
            // onChange={handleSearch}
            // onKeyDown={handleSearch}  
            >
              <IoSearch size={16.5} /> Search
            </Button>
            </div>
          </div> */}

          <div className="w-full mt-1.5 bg-[#c2c0c0]">
            <DataTable
              // data={allUsers ? allUsers : []}
              data={filteredData ? filteredData : []}
              columns={Columns(handleSettingSelectedUser, selectedRow, setSelectedRow)}
              // onRowClicked={handleSettingSelectedUser}
              customStyles={tableCustomStyles}
              pagination
              responsive={true}
              className="w-full"
            //   noDataComponent={<CustomNoDataComponenet />}
            //   progressComponent={<CustomProgressComponenet />}
            //   fixedHeader
            //   fixedHeaderScrollHeight="60vh"
            />

          </div>
        </div>
    </div>
    </>
}

export default SelectUser;