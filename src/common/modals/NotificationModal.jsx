import React, { useEffect } from 'react';
import { Modal } from 'antd';
import { RxCross2 } from 'react-icons/rx';
import { MdNotificationsActive } from "react-icons/md";

// audio
import notificationAudio from "../../assets/notification.mp3";
import { useDispatch, useSelector } from 'react-redux';
import NotifyMessage from '../cards/NotifyMessage';
import { getGlobalNotificationThunkMiddleware, getNotificationThunkMiddleware, setNotification } from '../../redux/features/notification';
import { useNavigate } from 'react-router-dom';
import usePath from '../../hooks/usePath';

const NotificationModal = ({ isVisible = false, onClose = function () { } }) => {
    const { notification, allNotification } = useSelector(state => state.notification);
    const { campaignDetails } = useSelector(state => state.campaigns);
    const dispatch = useDispatch();
    const path = usePath();

    const audio = new Audio(notificationAudio);
    const modalStyle = {
        position: 'fixed',
        top: 20, // Adjust top position
        right: 20, // Adjust right position
        margin: 0,
        transform: 'none', // Prevent default transformations
    };

    useEffect(()=> {
        if(notification){
            audio.play();
            dispatch(setNotification({
                notification: false,
            }));
        }
    }, [notification]);

    const navigate = useNavigate();

    useEffect(()=> {
        if(path.startsWith("campaigns")){
            dispatch(getNotificationThunkMiddleware(campaignDetails?.name));
        }else {
            dispatch(getGlobalNotificationThunkMiddleware());
        }
    }, [navigate]);

    return (
        <Modal
            open={isVisible}
            closable={false}
            onCancel={onClose}
            footer={[]}
            okText="Confirm"
            cancelText="Cancel"
            className="custom-modal"
            centered={false} // Override centered positioning
            style={modalStyle} // Apply inline styles
        >
            <div className='flex flex-col overflow-hidden rounded-md'>
                <div className='w-full flex bg-slate-800 text-white justify-between items-center py-2 px-3'>
                    <div className="flex justify-center items-center gap-x-2">
                        <MdNotificationsActive size={18} />
                        <h2 className='font-poppns not-italic leading-normal font-semibold text-[16px]'>Notifications</h2>
                    </div>
                    <button className='cursor-pointer active:text-red-600' onClick={onClose}>
                        <RxCross2 size={"18px"} />
                    </button>
                </div>
                <div className='h-[1px] bg-gray-400 w-full'></div>

                <div className={`flex flex-col overflow-y-scroll bg-white py-1 px-2 h-48`}>
                    {
                        allNotification && allNotification?.length > 0 ? <>
                            {
                                allNotification?.map((notify, index)=> (
                                    <NotifyMessage 
                                        key={index} 
                                        message={notify?.message} 
                                        id={notify?._id} 
                                        type={notify?.type} 
                                        time={notify?.date} 
                                        campaignName={notify?.campaignName}
                                        path={""} 
                                    />
                                ))
                            }
                        </>: <h2 className='text-center my-3 h-full w-full flex justify-center items-center text-lg font-semibold font-poppins not-italic leading-normal text-slate-800'>No Notifications!</h2>
                    }
                            {/* <NotifyMessage message={"message..."} type={"success"} time="2024-8-29" path={""} />
                            <NotifyMessage message={"message..."} type={"error"} time="2024-8-29" path={""} /> */}

                </div>
            </div>
        </Modal>
    );
};

export default NotificationModal;
