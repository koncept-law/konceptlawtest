import React, { lazy, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation, useRoutes } from "react-router-dom";
import { getItemFromStore } from "../utils";
import { jwtDecode } from "jwt-decode";
import { logoutThunkMiddleware, setUser } from "../redux/features/user";
import { setAuth } from "../redux/features/auth";
import Logs from "../components/admin/campaigns/campaignDetails/Logs";
// import DownloadDocumentByCategory from "../components/admin/campaigns/campaignDetails/DocumentByCategory/DownloadDocumentByCategory.jsx";
// import LoginPageCopy from "../page/LoginPageCopy.jsx";
const HomePage = lazy(() => import("../page/HomePage"));
// const Login = lazy(() => import("../page/Login"));
const LoginPage = lazy(() => import("../page/LoginPage"));
const ProtectedRoutes = lazy(() => import("./ProtectedRoutes"));
const Admin = lazy(() => import("../page/Admin"));
const Dashboard = lazy(() => import("../components/admin/dashboard/Dashboard"));
const MainDashboard = lazy(() => import("../components/admin/dashboard/MainDashboard.jsx"));
const Campaigns = lazy(() => import("../components/admin/campaigns/Campaigns"));
// changes made by abhyanshu
// changes made by abhyanshu
const CampaignDetails = lazy(() =>
  import("../components/admin/campaigns/campaignDetails/CampaignDetails")
);
const CampaignFilterData = lazy(() =>
  import("../components/admin/campaigns/campaignFilterData/CampaignFilterData")
);
const SmsCampaign = lazy(() =>
  import("../components/admin/campaigns/campaignDetails/SmsCampaign")
);
const WhatsappCampaign = lazy(() =>
  import("../components/admin/campaigns/campaignDetails/WhatsappCampaign")
);
const WhatsappCategories = lazy(() => import("../components/admin/campaigns/campaignDetails/WhatsappCategories.jsx"));
const Tracking = lazy(() => import("../components/admin/tracking/Tracking"));
const AdminProtectedRoutes = lazy(() => import("./AdminProtectedRoutes"));
const BulkEmail = lazy(() =>
  import("../components/admin/campaigns/campaignDetails/BulkEmail/BulkEmail")
);
const EmailCategories = lazy(() => import("../components/admin/campaigns/campaignDetails/BulkEmail/EmailCategoires.jsx"));
const UploadTemplate = lazy(() =>
  import(
    "../components/admin/campaigns/campaignDetails/BulkEmail/UploadTemplate"
  )
);
const CreateEmailTemplate = lazy(() => import("../components/admin/campaigns/campaignDetails/BulkEmail/CreateEmailTemplate.jsx"));

const CreateSmsTemplatePage = lazy(() =>
  import(
    "../components/admin/campaigns/createCampaignTemplate/createSmsTemplatePage"
  )
);

const CreateWhatsappTemplatePage = lazy(() =>
  import(
    "../components/admin/campaigns/createCampaignTemplate/createWhatsappTemplatePage"
  )
);

const AllCampaignsData = lazy(() =>
  import(
    "../components/admin/campaigns/campaignReports/AllCampaignsData.jsx"
  )
);

const EmailTemplate = lazy(() => import("../components/admin/campaigns/campaignDetails/BulkEmail/EmailTemplate.jsx"))

const DocumentTemplates = lazy(() => import("../components/admin/campaigns/documentTemplates/AllDocumentTemplate.jsx"))

const Document = lazy(() => import("../components/admin/document/Document"));

const DownloadDocumentByCategory = lazy(() => import("../components/admin/campaigns/campaignDetails/DocumentByCategory/DownloadDocumentByCategory.jsx"));

const SelectUser = lazy(() => import("../components/admin/users/SelectUser.jsx"));

const MyNumber = lazy(() => import("../components/admin/myNumber/MyNumber.jsx"));

const AllUsers = lazy(() => import("../components/admin/users/AllUsers.jsx"));

// sms
const SmsApplication = lazy(() => import("../components/admin/campaigns/campaignDetails/sms/SmsApplication.jsx"));
const SmsCategories = lazy(() => import("../components/admin/campaigns/campaignDetails/sms/SmsCategories.jsx"));
const Tools = lazy(() => import("../components/admin/tools/Tools.jsx"));
const TrackingPage = lazy(() => import("../components/admin/tools/pages/TrackingPage.jsx"));

// validations
const TrackingLogin = lazy(() => import("../page/validations/TrackingLogin.jsx"));
const TrackingRegister = lazy(() => import("../page/validations/TrackingRegister.jsx"));

// tracking
const TrackingView = lazy(() => import("../page/TrackingView.jsx"));
const TrackingAdmin = lazy(() => import("../page/TrackingAdmin.jsx"));
const TrackingSubscription = lazy(() => import("../page/TrackingSubscription.jsx"));

// pdf to excel link
const PdfToExcelLink = lazy(() => import("../components/admin/tools/pages/PdfToExcelLink.jsx"));

const Router = () => {
  const dispatch = useDispatch();
  const isAuth = localStorage.getItem("isAuthenticated");
  const { isAuthenticated, role, token } = useSelector((state) => state.auth);
  const isTrackingAuth = true;
  // console.log("isAuthenticate", isAuth)

  const destination = useMemo(() => {
    if (isAuth) {
      return "/dashboard";
    } else if (!isAuth) {
      return "/login";
    } else {
      return "/";
    }
  }, [isAuth, role, token]);
  // console.log(destination)

  const element = useRoutes([
    {
      path: "/",
      // element: <HomePage />,
      // element: <LoginPage />,
      element: <Navigate to={destination} />,
    },
    {
      path: "/login",
      // element: (
      //   <ProtectedRoutes
      //   isAuthenticated={!isAuthenticated}
      //   redirect={"/dashboard"}
      //   >
      //     {/* <Login /> */}
      //     <LoginPage />
      //   </ProtectedRoutes>
      // ),
      element: !isAuth ? <LoginPage /> : <Navigate to={"/"} />,
    },
    {
      path: "/register",
      // element: (
      //   <ProtectedRoutes
      //     isAuthenticated={!isAuthenticated}
      //     redirect={"/dashboard"}
      //   >
      //     {/* <Login /> */}
      //     <LoginPage />
      //   </ProtectedRoutes>
      // ),
      element: !isAuth ? <LoginPage /> : <Navigate to={"/"} />,
    },
    {
      path: "/tracking-login",
      element: <TrackingLogin />,
    },
    {
      path: "/tracking-register",
      element: <TrackingRegister />,
    },
    {
      path: "/tracking-page",
      element: isTrackingAuth ? <TrackingView />: <Navigate to={"/tracking-login"} />,
    },
    {
      path: "/tracking-subscription",
      element: isTrackingAuth ? <TrackingSubscription />: <Navigate to={"/tracking-login"} />,
    },
    {
      path: "/tracking-admin",
      element: isTrackingAuth ? <TrackingAdmin />: <Navigate to={"/tracking-login"} />,
    },
    {
      path: "/",
      // element: (
      //   <ProtectedRoutes isAuthenticated={isAuthenticated} redirect={"/login"}>
      //     <Admin />
      //   </ProtectedRoutes>
      // ),
      element: isAuth ? <Admin /> : <Navigate to={"/login"} />,
      // element : <Admin/>,
      children: [
        {
          path: "/dashboard",
          element: (
            // <AdminProtectedRoutes
            //   // isAdmin={role === "superAdmin"}
            //   // redirect={"/document"}
            //   isAdmin={true}
            // >
            //   {/* <Dashboard /> */}
            //   <MainDashboard />
            // </AdminProtectedRoutes>
            <MainDashboard />
          ),
          // element : <Dashboard/>,
        },
        {
          path: "/document",
          element: <Document />,
        },
        {
          path: "/select-user",
          element: <SelectUser />
        },
        // {
        //   path: "/campaigns",
        //   element: <Campaigns />,
        // },
        // changes made by abhyanshu
        {
          path: "/campaigns",
          // element: (
          //   <AdminProtectedRoutes
          //     isAdmin={role === "superAdmin"}
          //     // redirect={"/document"}
          //     redirect={"/dashboard"}
          //   >
          //     <Campaigns />
          //   </AdminProtectedRoutes>
          // ),
          element: <Campaigns />
        },
        {
          path: "/campaigns/documenttemplates",
          element: <DocumentTemplates />,
        },
        {
          path: "/campaigns/campaigndetails",
          element: <CampaignDetails />,
        },
        // {
        //   path: "/campaigns/edit/:id",
        //   element: <EditCampaign />,
        // },
        {
          path: "/campaigns/filterdata",
          element: <CampaignFilterData />,
        },
        {
          path: "/campaigns/campaigndetails/sms",
          element: <SmsCampaign />,
        },
        {
          path: "/campaigns/campaigndetails/sms/createtemplate",
          element: <CreateSmsTemplatePage />,
        },
        {
          path: "/campaigns/campaigndetails/sms/logs",
          element: <Logs />,
        },
        // {
        //   path: "/campaigns/campaigndetails/whatsapp",
        //   element: <WhatsappCampaign />,
        // },
        // {
        //   path: "/campaigns/campaigndetails/whatsapp/createtemplate",
        //   element: <CreateWhatsappTemplatePage />,
        // },
        {
          // path: "/campaigns/campaigndetails/bulkemail",
          // element: <BulkEmail />,
          path: "/campaigns/whatsapp",
          children: [
            {
              path: "application",
              element: <WhatsappCampaign />,
            },
            {
              path: "categories",
              element: <WhatsappCategories />
            },
            {
              path: "create-template",
              element: <CreateWhatsappTemplatePage />
            }
          ]
        },
        {
          path: "/campaigns/campaigndetails/whatsapp/logs",
          element: <Logs />,
        },
        {
          path: "/campaigns/campaigndetails/bulkemail/uploadtemplate",
          element: <UploadTemplate />,
        },
        {
          // path: "/campaigns/campaigndetails/bulkemail",
          // element: <BulkEmail />,
          path: "/campaigns/campaigndetails/email",
          children: [
            {
              path: "bulkemail",
              element: <BulkEmail />,
            },
            {
              path: "categories",
              element: <EmailCategories />
            },
            {
              path: "create-template",
              element: <CreateEmailTemplate />
            }
          ]
        },
        {
          path: "/campaigns/campaigndetails/bulkemail/createtemplate",
          element: <EmailTemplate />
        },
        {
          path: "/campaigns/campaigndetails/bulkemail/logs",
          element: <Logs />,
        },
        {
          path: "/campaigns/campaigndetails/reports",
          element: <AllCampaignsData />,
        },
        {
          path: "/campaigns/documentscategorydownload",
          element: <DownloadDocumentByCategory />,
        },
        {
          path: "/campaigns/sms",
          // element: (
          //   <ProtectedRoutes isAuthenticated={isAuthenticated} redirect={"/login"}>
          //     <Admin />
          //   </ProtectedRoutes>
          // ),
          // element : <Admin/>,
          children: [
            {
              path: "application",
              // element: <SmsApplication />,
              element: <SmsCampaign />,
            },
            {
              path: "categories",
              element: <SmsCategories />,
            },
          ],
        },
        {
          path: "/tracking",
          element: (
            // <AdminProtectedRoutes
            //   isAdmin={role === "superAdmin"}
            //   // redirect={"/document"}
            //   redirect={"/dashboard"}
            // >
            //   <Tracking />
            // </AdminProtectedRoutes>
            <Tracking />
          ),
        },
        {
          path: "/my-number",
          // element: (<AdminProtectedRoutes
          //   isAdmin={role === "superAdmin"}
          //   // redirect={"/document"}
          //   redirect={"/dashboard"}
          // >
          //   <MyNumber />
          // </AdminProtectedRoutes>)
          element: <MyNumber />,
        },
        {
          path: "/all-accounts",
          // element: (<AdminProtectedRoutes
          //   isAdmin={role === "superAdmin"}
          //   // redirect={"/document"}
          //   redirect={"/dashboard"}
          // >
          //   <AllUsers />
          // </AdminProtectedRoutes>)
          element: <AllUsers />
        },
        {
          path: "/tools",
          // element: (<AdminProtectedRoutes
          //   isAdmin={role === "superAdmin"}
          //   // redirect={"/document"}
          //   redirect={"/dashboard"}
          // >
          //   <Tools />
          // </AdminProtectedRoutes>)
          element: <Tools />,
        },
        {
          path: "/tools/tracking",
          element: <TrackingPage />,
        },
        {
          path: "/tools/pdf-to-excel-link",
          element: <PdfToExcelLink />,
        },
        {
          path: "*",
          element: <Navigate to={"/"} />
        },
      ],
    },
  ]);

  // useEffect(() => {
  //   const checkIsUserAuthenticated = async () => {
  //     try {
  //       const token = getItemFromStore("konceptLawToken");
  //       if (token) {
  //         const user = await jwtDecode(token).foundUser;
  //         const role = user.profile ? user.profile : null;

  //         dispatch(
  //           setAuth({
  //             token,
  //             isAuthenticated: true,
  //             role,
  //           })
  //         );
  //         dispatch(setUser({ user }));
  //       } else {
  //         dispatch(logoutThunkMiddleware());
  //       }
  //     } catch (error) {
  //       dispatch(logoutThunkMiddleware());
  //     }
  //   };

  //   checkIsUserAuthenticated();
  // }, [isAuthenticated, token, role, dispatch]);

  return element;
};

export default Router;
