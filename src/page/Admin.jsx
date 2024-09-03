import React, { useEffect } from "react";
import Navbar from "../components/admin/layout/Navbar";
import { Outlet, useNavigate } from "react-router-dom";
import Footer from "../components/admin/layout/Footer";
import { useDispatch, useSelector } from "react-redux";
import { getUserListThunkMiddleware } from "../redux/features/user";
import DashBoardSideBar from "../components/admin/layout/DashBoardSideBar";
import DashboardNavbar from "../components/admin/layout/DashboardNavbar";
import { toastify } from "../components/toast";

const Admin = () => {
  const navigate = useNavigate()
  const { singleUser } = useSelector(
    (state) => state.campaigns
  );  
  // console.log("single user in admin", singleUser);

  const dispatch = useDispatch();
  useEffect(() => {
    if(singleUser){
      dispatch(getUserListThunkMiddleware(navigate));
    }else {
      if(navigate){
        toastify({ msg: "Kindly select an account.", type: "error" });
      }
      navigate("/all-accounts");
    }
  }, [singleUser, navigate]);


  return (
    <>
      {/* <div className="min-h-[94dvh] h-fit">
        <Navbar />
        <div className="bg-[#c2c0c0] min-h-[80dvh] h-fit">
          <Outlet />
        </div>
        <div className="bg-[#c2c0c0]">
          <Footer />
        </div>
      </div> */}
      <div className="flex justify-center items-start h-screen">
        <DashBoardSideBar />
        <div className="bg-slate-50 w-full h-full custom-scroll overflow-hidden">
          <DashboardNavbar />
          {/* change by me */}
          <div className="w-full flex h-[93%] flex-col justify-start py-2 items-start px-2">
          {/* <div className="w-full flex h-full flex-col justify-start py-2 items-center px-2"> */}
            {/* <MainDashboard /> */}
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default Admin;
