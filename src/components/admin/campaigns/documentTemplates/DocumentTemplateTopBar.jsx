import React, { memo, useEffect } from 'react'
import { IoMdArrowRoundBack } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllFoldersThunkMiddleware, getAllTemplateFilesThunkMiddleware, getFolderThunkMiddleware } from '../../../../redux/features/campaigns';
import usePath from '../../../../hooks/usePath';

export const DocumentTemplateTopBar = memo(({ 
  title = "", 
  // path = "", 
  items, folderName = "",
  BackEvent = function(){}
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const path = usePath();
  const { docuementTemplateFiles, singleUser } = useSelector((state) => state.campaigns);

  useEffect(()=>{},[ docuementTemplateFiles])

  const refreshHandler = () => {
    // dispatch(
    //   // getAllCampaignThunkMiddleware({ accountId: singleUser.accountId})
    //   getAllTemplateFilesThunkMiddleware()
    // );
    // console.log("on Folder", folderName );
    dispatch(getAllTemplateFilesThunkMiddleware());
    dispatch(getAllFoldersThunkMiddleware(singleUser?.accountId));
    if(folderName && folderName !== ""){
      dispatch(getFolderThunkMiddleware({ folder: folderName }));
    }
  };

  return (
    <div className="h-fit px-4 py-2 gap-y-2 sm:gap-y-0 flex flex-wrap w-full justify-between bg-white rounded-md">
      <div className=" flex items-center gap-4">
        <button
          // onClick={() => path.back()}
          onClick={BackEvent}
          className="w-fit flex items-center gap-1 buttonBackground px-2 py-1 rounded-md text-white font-semibold"
        >
          <IoMdArrowRoundBack size={26} />
        </button>
        <h1 className=" text-xl font-semibold">{title}</h1>
      </div>
      <div className="flex justify-center items-center gap-x-2">
        {items}
        <button
          onClick={refreshHandler}
          className="w-fit flex items-center gap-1 buttonBackground px-2 py-1 rounded-md text-white font-semibold"
        >
          Refresh
        </button>
      </div>
    </div>
  )
})

export default DocumentTemplateTopBar;
