import React, { useState } from 'react';
import { FaCalendarCheck } from "react-icons/fa";
import { BsPersonCircle } from "react-icons/bs";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { Modal } from 'antd'; // Import Modal and Button from Ant Design
import { Button } from '@material-tailwind/react';

// for data show
import { FcSms } from "react-icons/fc";
import { IoLogoWhatsapp } from "react-icons/io";
import { MdDeleteOutline } from "react-icons/md";
import { RxCross2 } from 'react-icons/rx';
import { useDispatch, useSelector } from 'react-redux';
import { deleteInsideCampaignThunkMiddleware, getAllCampaignReportsThunkMiddleware } from '../../../../redux/features/campaigns';

const CampaignsCard = ({ value, handleSelectedCard, isActive }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { campaignDetails } = useSelector(state => state.campaigns);
  const dispatch = useDispatch();

  function formatDateToDDMMYY(date) {
    date = new Date(date);
    try {
      // Ensure the input is a valid Date object
      if (!(date instanceof Date) || isNaN(date.getTime())) {
        throw new Error('Invalid date');
      }

      // Extract the day, month, year, hours, and minutes
      const day = String(date.getDate()).padStart(2, '0'); // Ensure two digits
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
      const year = String(date.getFullYear()); // Get full year
      let hours = date.getHours();
      const minutes = String(date.getMinutes()).padStart(2, '0'); // Ensure two digits

      // Determine AM/PM suffix
      const ampm = hours >= 12 ? 'PM' : 'AM';

      // Convert hours from 24-hour format to 12-hour format
      hours = hours % 12;
      hours = hours ? hours : 12; // The hour '0' should be '12'
      hours = String(hours).padStart(2, '0'); // Ensure two digits

      // Return formatted date and time
      return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
    } catch (err) { 
      console.error(err); 
      return date;
    }
  }

  const showDeleteModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    // console.log("report", value, campaignDetails?.name);
    dispatch(deleteInsideCampaignThunkMiddleware({ campaignName: campaignDetails?.name, insideCampaignId: value?.id, type: value?.type }, (call) => {
      if(call) dispatch(getAllCampaignReportsThunkMiddleware({ campaignName: campaignDetails?.name }))
    }));
    setIsModalVisible(false);
    // Add delete logic here
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Modal
        open={isModalVisible}
        onCancel={handleCancel}
        closable={false}
        footer={[]}
        centered
      >
        <div className="flex flex-col justify-center w-full items-center">
          <div className="py-3 px-3 flex justify-end bg-slate-800 w-full text-white items-center">
            <button className="cursor-pointer active:text-red-700 transition-all" onClick={handleCancel}>
              <RxCross2 size={"20px"} />
            </button>
          </div>
          <div className="bg-white p-3 flex font-poppins font-semibold gap-y-3 text-slate-700 not-italic leading-normal flex-col justify-center items-center">
            <MdDeleteOutline size={"55px"} />
            <p className="font-medium text-center text-[15px] w-full md:w-[80%]">Confirm deletion of campaign ID: <b>{value?.id}</b> scheduled for <b>{formatDateToDDMMYY(value?.date)}</b>?</p>

            <div className="flex justify-end items-center w-full gap-x-1">
              <Button className="bg-gray-100 text-black rounded-sm py-1.5 border border-solid px-3 text-sm shadow-sm hover:shadow-sm capitalize font-poppins font-medium not-italic leading-normal" onClick={handleCancel}>No</Button>
              <Button className="bg-red-600 text-white shadow-sm rounded-sm py-1.5 text-sm px-3 hover:shadow-sm capitalize font-poppins font-medium not-italic leading-normal" onClick={handleOk}>Delete</Button>
            </div>
          </div>
        </div>
      </Modal>
      <div onClick={handleSelectedCard} className={`cursor-pointer m-2 bg-white border-2 min-h-[130px] 
        flex flex-col h-fit rounded-md ${isActive ? `border-blue-500` : ``} `}>
        <div className=' p-2 text-white font-semibold bg-gray-600'>
          <p className='flex text-[13px] w-full justify-between items-center font-poppins not-italic leading-normal gap-2'>
            <span> {value?.id}</span>
            {/* {formatDateToDDMMYY(value.date)} */}
            <div className="flex justify-center items-center gap-x-2">
              <div className="bg-red-700 p-1 flex justify-center items-center text-white cursor-pointer rounded-3xl">
                <RxCross2 onClick={showDeleteModal} />
              </div>
            </div>
          </p>
        </div>
        <div className='p-4 flex sm:flex-row flex-col justify-center items-center font-semibold'>
          <div className='flex md:w-1/2 w-full flex-col gap-y-3 gap-x-2' >
            <p >
              <span>
                {
                  value?.type === "SMS" ? (<span className='flex items-center gap-2 text-[14px]' ><FcSms size={20} color="blue" />{value?.type}</span>)
                    : value?.type === "WHATSAPP" ? (<span className='flex items-center gap-2 text-[14px]' ><IoLogoWhatsapp size={20} color="green" />{value?.type}</span>)
                      : value?.type === "Email" || value?.type === "email" ? (<span className='flex items-center gap-2 text-[14px]' ><FcSms size={20} color="black" />{value?.type}</span>) : ""
                }
              </span>
            </p>
            <p>
              {
                value?.campaignStatus === "completed" ? (<span className='flex text-blue-800 items-center gap-2 text-[14px]'> <BsFillCheckCircleFill size={20} color="blue" /> Completed </span>) :
                  value?.campaignStatus === "pending" ? (<span className='flex text-red-800 items-center gap-2 text-[14px]'> <BsFillCheckCircleFill size={20} color="red" /> Pending </span>) : ""
              }
            </p>
          </div>
          <div className='md:w-1/2 w-full flex flex-col gap-2' >
            <p className='flex items-center gap-2 text-[14px]'>
              <span>
                <FaCalendarCheck size={20} color="violet" />
              </span>
              {formatDateToDDMMYY(value?.date)}
            </p>
            <p className='flex items-center gap-2 text-[14px]' >
              <BsPersonCircle size={20} color="blue" />
              KonceptLaw
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default CampaignsCard;
