import { createSlice } from "@reduxjs/toolkit";
import { toastify } from "../../../components/toast";
import axios from "axios";
import { setLoader } from "../loaders";
import { useNavigate } from "react-router-dom";
import { toastifyError } from "../../../constants/errors";

const initialState = {
  allFolders: null,
  selectedFolder: null,
  folderData: null,
  displayFolderData: null,
};

const documentSlice = createSlice({
  name: "document",
  initialState: initialState,
  reducers: {
    setDocument(state, action) {
      Object.keys(action.payload).forEach((key) => {
        state[key] = action.payload[key];
      });
    },
  },
});

export const { setDocument } = documentSlice.actions;
export default documentSlice.reducer;

// export const getFolderDataThunkMiddleware = ({ folderName, user }) => {
//   return async (dispatch) => {
//     try {
//       dispatch(setLoader({ getLoader: true }));

//       let folder, rootFolder, url;
//       if (
//         ["hdfc", "tracking"].some((substring) => folderName.includes(substring))
//       ) {
//         const folderSplit = folderName?.split("/");
//         rootFolder = folderSplit[0];
//         folder = folderSplit[1];
//         url = "https://t.kcptl.in/api/getFolderData";
//       } else {
//         folder = folderName;
//         url = "https://t.kcptl.in/api/folder";
//       }

//       const response = await axios.post(
//         url,
//         {
//           folderName: folder,
//           profile: user?.profile,
//           rootFolder: rootFolder,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("konceptLawToken")}`,
//           },
//           credentials: "include",
//         }
//       );

//       if (response?.status === 200) {
//         const data = response.data;
//         if (data.files.length != 0) {
//           console.log(data);
//           dispatch(
//             setDocument({
//               folderData: data?.files,
//               displayFolderData: data?.files,
//             })
//           );
//         }
//       }
//     } catch (error) {
//       if (error.response?.status === 403) {
//         localStorage.clear();
//         navigate("/login");
//       } else if (error.response?.data) {
//         toastify({ msg: error.response.data, type: "error" });
//       } else {
//         toastify({ msg: error.message, type: "error" });
//       }
//     } finally {
//       dispatch(setLoader({ getLoader: false }));
//     }
//   };
// };


// Changes made by abhyanshu
export const getFolderDataThunkMiddleware = ({ folderName, user }) => {
  return async (dispatch) => {
    const navigate = useNavigate();
    try {
      dispatch(setLoader({ getLoader: true }));

      let folder, rootFolder, url;
      if (
        ["hdfc", "tracking"].some((substring) => folderName.includes(substring))
      ) {
        const folderSplit = folderName?.split("/");
        rootFolder = folderSplit[0];
        folder = folderSplit[1];
        url = "https://t.kcptl.in/api/getFolderData";
      } else {
        folder = folderName;
        url = "https://t.kcptl.in/api/folder";
      }

      const response = await axios.post(
        url,
        {
          folderName: folder,
          profile: user?.profile,
          rootFolder: rootFolder,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("konceptLawToken")}`,
          },
          credentials: "include",
        }
      );

      if (response?.status === 200) {
        const data = response.data;
        if (data.files.length != 0) {
          dispatch(
            setDocument({
              folderData: data?.files,
              displayFolderData: data?.files,
            })
          );
        }
      }
    } catch (error) {
      // if (error.response?.status === 403) {
      //   localStorage.clear();
      //   navigate("/login");
      // } else if (error.response?.data) {
      //   toastify({ msg: error.response.data, type: "error" });
      // } else {
      //   toastify({ msg: error.message, type: "error" });
      // }
      toastifyError(error, (call) => {
        if(call){
          navigate("/login");
        }
      })
    } finally {
      dispatch(setLoader({ getLoader: false }));
    }
  };
};

// Changes made by abhyanshu

