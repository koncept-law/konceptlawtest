import React, { useState } from 'react'
import { FaCalendarCheck } from "react-icons/fa";
import { BsPersonCircle } from "react-icons/bs";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { FaUserCircle } from "react-icons/fa";
import { FaLanguage } from "react-icons/fa";
import { AiOutlineFileWord } from "react-icons/ai";

// for data show
import { FcSms } from "react-icons/fc";
import { IoLogoWhatsapp } from "react-icons/io";
// import { getWordDocumentFileThunkMiddleware } from '../../../../redux/features/campaigns';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ConfirmMessage from '../../../common/ConfirmMessage';
import { MdDelete, MdDeleteOutline, MdModeEditOutline, MdOutlineDateRange } from 'react-icons/md';
import { GoEye } from 'react-icons/go';
import { FiDownload } from "react-icons/fi";
import { deleteFolderCampaignThunkMiddleware, editDocumentTemplateFileThunkMiddleware, selectFileThunkMiddleware } from '../../../../redux/features/campaigns';
import DocumentEditModal from '../../../../common/modals/DocumentEditModal';
import { toastify } from '../../../toast';
import { setLoader } from '../../../../redux/features/loaders';

// const DocumentTemplateCard = ({ value,
//   handleSelectedCard,
//   // handleFileUrl,
//   isActive }) => {
//   const dispatch = useDispatch()

//   //   const  handleWordFileReq = (item) =>{

//   //         dispatch(getWordDocumentFileThunkMiddleware({filePath: item.path}))
//   // }

//   return (
//     <>
//       <div onClick={() => {
//         handleSelectedCard();
//         // handleWordFileReq();
//         // handleFileUrl();
//         // handleWordFileReq(value.path);
//       }}
//         className={`cursor-pointer my-3 border-2 border-blue-600 min-h-[130px] 
//         flex flex-col h-fit rounded-md ${isActive ? `bg-blue-200` : `bg-gray-200`} `}
//       >
//         <div className=' p-2  text-white font-semibold bg-gray-600'>
//           <p className='flex gap-2'><span>{value.id}</span>{value.date}</p>
//         </div>
//         <div className='p-4 flex sm:flex-row flex-col justify-center items-center font-semibold'>
//           <div className='flex md:w-1/2 w-full flex-col gap-2' >
//             <p>
//               <span>
//                 <span className='flex items-center gap-2 ' ><FaLanguage  className='' />{value.category}</span>
//               </span>
//             </p>
//             <p>
//               <span className='flex text-blue-800 items-center gap-2'><AiOutlineFileWord  className=' text-lg' color="blue" />{value?.fileType}</span>
//             </p>
//           </div>
//           <div className='md:w-1/2 w-full flex flex-col gap-2' >
//             <p className='flex items-center gap-2'>
//               <span>
//                 <FaCalendarCheck className=' text-lg' color="violet" />
//               </span>
//               {value?.date}
//             </p>
//             <p className='flex items-center gap-2' >
//               <FaUserCircle className=' text-lg' color="blue" />
//               {value?.userName}
//             </p>
//           </div>
//         </div>
//       </div>
//     </>
//   )
// }

// https://m.konceptlaw.in/docs/docsBuffer/${fileUrl}
const DocumentTemplateCard = ({
    value,
    handleSelectedCard,
    // handleFileUrl,
    isActive = false,
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();
    const [selectedRow, setSelectedRow] = useState(false);
    const dispatch = useDispatch();
    const [EditModalOpen, setEditModalOpen] = useState(false);
    const { folder, singleUser } = useSelector((state) => state.campaigns);


    // console.log("campaign data", value);

    //   const  handleWordFileReq = (item) =>{

    //         dispatch(getWordDocumentFileThunkMiddleware({filePath: item.path}))
    // }

    const selectCampagin = () => {
        handleSelectedCard();
        dispatch(selectFileThunkMiddleware(value));
    }

    const handleDeleteCampaign = (id) => {
        // console.log("delete campaign", id);
        setSelectedRow(false);
        dispatch(deleteFolderCampaignThunkMiddleware({ folder: value?.folderName, id: id }, (error)=> {
            if(!error){
                navigate("/");
            }
        }));
        if(!folder || folder?.length < 1){
            navigate("/dashboard");
        }
    }

    const downloadDocument = () => {
        // console.log(value);
        let fileUrl = value?.path.split("/")[1];
        // https://m.konceptlaw.in/docs/docsBuffer/${fileUrl}
        const downloadUrl = `https://m.konceptlaw.in/docs/docsBuffer/${fileUrl}`;

        // Create an anchor element and trigger the download
        const anchor = document.createElement('a');
        anchor.href = downloadUrl;
        anchor.download = fileUrl;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
    }

    const handleEditEvent = (e) => {
        if(e?.name?.match(".docx")){
            // console.log("upload file", e);.
            let folderName = folder[0]?.folderName;
            dispatch(editDocumentTemplateFileThunkMiddleware({folder: value?.name, file: e, accountId: singleUser?.accountId, folderName }));
            setEditModalOpen(false);
            // handleSelectedCard();
            dispatch(selectFileThunkMiddleware(value));
        }else {
            toastify({ msg: `Please select a valid .docx file: .${e?.name?.split(".")[1]}`, type: "error" })
        }
    }

    return <>
        {/* <EditCampaign visible={isOpenUpdateCampaing} data={data} onClose={() => setIsOpenUpdateCampaing(false)} /> */}
        <DocumentEditModal open={EditModalOpen} setOpen={setEditModalOpen} handleEditEvent={handleEditEvent} />
        {
            selectedRow ? <>
                < ConfirmMessage yes="Yes, I am sure" deleteBtn={true} saveOrsend="" className="flex-col" no="No, I'm not sure!" value={(e) => {
                    if (e) {
                        // e.preventDefault();
                        if (value?._id) {
                            handleDeleteCampaign(value?._id)
                        }
                    }
                    setSelectedRow(false);
                }}>
                    <MdDeleteOutline size={"50px"} className="mb-3 text-slate-700" />
                    <h2 className="text-lg w-full text-center text-slate-700 font-normal">Do You Want to Delete This Template?<br />
                        <span className="font-semibold text-lg capitalize">
                            {value?.name}
                        </span>
                    </h2>
                </ConfirmMessage >
            </> : null
        }

        <div
            className={`w-full p-1 rounded-md flex my-2 flex-col shadow-md shadow-slate-200 cursor-pointer justify-start items-start bg-white border border-solid transition-all duration-300 ${isHovered ? 'border-blue-600' : ''} ${isActive ? 'border-blue-600' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={selectCampagin}
        >
            <div className="w-full flex justify-between items-center px-1">
                <h2 className="font-medium not-italic leading-normal text-start my-1 font-poppins text-[16px]">{value?.name}</h2>
                <div className={`flex justify-center overflow-hidden transition-all ${isHovered ? 'h-full' : 'h-0'} items-center gap-x-2`}>
                    <button className="p-1 rounded-3xl cursor-pointer bg-blue-600 text-white" onClick={() => setEditModalOpen(true)}>
                        <MdModeEditOutline size={"15px"} />
                    </button>

                    <button className="p-1 rounded-3xl cursor-pointer bg-green-600 text-white" onClick={downloadDocument}>
                        <FiDownload size={"15px"} />
                    </button>

                    <button className="p-1 rounded-3xl cursor-pointer bg-red-600 text-white" onClick={() => setSelectedRow(true)}>
                        <MdDelete size={"15px"} />
                    </button>
                </div>
            </div>
            <h2 className="h-[1px] w-full bg-gray-400 my-2"></h2>
            <div className="grid grid-cols-2 gap-x-4 w-full gap-y-2 px-2 my-1.5">
                <div className="flex justify-start items-center w-full text-[13px] font-poppins text-[#000000] not-italic leading-normal font-medium gap-x-2">
                    <FaLanguage size={"20px"} className="text-blue-600" />
                    <span>{value?.category}</span>
                </div>

                <div className="flex justify-start items-center w-full text-[13px] font-poppins text-[#000000] not-italic leading-normal font-medium gap-x-2">
                    <AiOutlineFileWord size={"20px"} className="text-blue-600" />
                    <span>{value?.fileType}</span>
                </div>

                <div className="flex justify-start items-center w-full text-[13px] font-poppins text-[#000000] not-italic leading-normal font-medium gap-x-2">
                    <FaUserCircle size={"20px"} className="text-blue-600" />
                    <span>{value?.userName}</span>
                </div>

                <div className="flex justify-start items-center w-full text-[13px] font-poppins text-[#000000] not-italic leading-normal font-medium gap-x-2">
                    <MdOutlineDateRange size={"20px"} className="text-red-600" />
                    <span>{value?.date}</span>
                </div>
            </div>
        </div>
    </>
}

export default DocumentTemplateCard;
