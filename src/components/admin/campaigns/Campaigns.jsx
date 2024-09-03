import React, { useEffect, useState } from "react";
import Topbar from "./Topbar";
import CampaignsTable from "./CampaignsTable";
import AddCampaign from "./AddCampaign";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllCampaignThunkMiddleware, setSingleUserThunkMiddleware } from "../../../redux/features/campaigns";
import { Modal } from "antd";
// import { useDispatch } from "react-redux";

const Campaigns = () => {

  // const dispatch = useDispatch()

  // const [isUserModal, setIsUserModal] = useState(true);
  // const [allUsers, setAllUsers] = useState(null);
  // const { singleUser } = useSelector((state) => state.campaigns)
  // const url = window.location.href; // Returns the full URL
  // const pathname = window.location.pathname; // Returns the path after the domain

  const [openAddCampaign, setOpenAddCampaign] = useState(false);
  const openAddCampaignHandler = () => {
    setOpenAddCampaign((prev) => !prev);
  };

  // useEffect(() => {
  //   if (allUsers !== null) {
  //     return;
  //   }
  //   const getAllUser = async () => {
  //     const response = await axios.get(`https://t.konceptlaw.in/account/get`);
  //     setAllUsers(response.data)
  //   }

  //   getAllUser();
  //   // dispatch(setSingleUserThunkMiddleware({selectedUser : null }))
  // }, []);

  // useEffect(() => {
  //   if(!singleUser){
  //     return;
  //   }

  //   // console.log(selectedUser)
  //   // if(singleUser && (window.location.pathname !== "/campaigns")){
  //   // if(!singleUser &&  window.location.pathname.includes("campaigns") !== true ){
  //   //   dispatch(setSingleUserThunkMiddleware({selectedUser : null }))
  //   // }
  //   // if(window.location.pathname.includes("campaigns") === false){
  //   //   dispatch(setSingleUserThunkMiddleware({selectedUser : null }))
  //   // }
  // }, [singleUser]);

  return (

    <>
      {/* {
        allUsers && (
          <div>{isUserModal && <UsersSelectionModal allUsers={allUsers} setIsUsersModal={setIsUserModal} isUserModal={isUserModal} setIsUserModal={setIsUserModal} />}</div>
        )
      } */}
      {/* {
        singleUser ?
          (<> */}
      <div className="h-[94vh] w-[100vw] overflow-y-auto px-6 py-4 flex gap-2 md:gap-4 flex-col">
        <Topbar toggle={openAddCampaignHandler} />
        <div className="p-3 bg-white h-full rounded-md overflow-hidden overflow-x-scroll overflow-y-scroll">
          <CampaignsTable toggle={openAddCampaignHandler} />
        </div>
      </div>
      <AddCampaign modal={openAddCampaign} toggle={openAddCampaignHandler} />
      {/* <div className="h-[100vh] w-[100vw] flex justify-center items-center"> */}
      {/* </div> */}
      {/* </>)
          : ""
      } */}
    </>
  );
};

export default Campaigns;



// export const UsersSelectionModal = ({ allUsers, isUserModal , setIsUserModal }) => {

//   // const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const handleDelete = (name) => {
//     console.log(name)
//   }

//   const handleSettingSelectedUser = (e, user) => {
//     e.preventDefault();

//     dispatch(setSingleUserThunkMiddleware({ selectedUser: user }));
//     setIsUserModal(false)
//     // console.log("users Full name from the modal for selection of the user  :" , `${userFullName}`)
//     // dispatch(setSingleUserThunkMiddleware({accountId : user.accountId}))
//   }

//   const handleCancel = () => {
//     setIsUserModal(false)
//   }

//   return (
//     <Modal width={"90%"} centered open={isUserModal}
//       // onCancel={() => setIsUsersModal(false)}
//       onCancel={handleCancel}
//       cancelButtonProps={{ hidden: true }}
//       okButtonProps={{ hidden: true }}
//     >
//       {allUsers &&
//         (<div className="flex flex-col justify-center items-center">
//           {allUsers.map((item, index) => (
//             <div key={index} className="sm:w-[60%] w-[80%] flex border border-1 border-gray-200 justify-around flex-wrap items-center rounded-md">
//               <button onClick={(e) => handleSettingSelectedUser(e, item)}
//                 className="w-3/4 bg-gray-600 py-2 text-white text-md font-semibold rounded-l-lg"
//               >{`${item.firstName}  ${item.lastName}`}
//               </button>
//               <button className="w-1/4 bg-red-400 py-2 text-white font-semibold rounded-r-lg" onClick={() => handleDelete(item.firstName)}>
//                 Detete
//               </button>
//             </div>
//           ))}
//         </div>)
//       }
//     </Modal>
//   )
// }
