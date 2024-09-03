import { memo } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import usePath from "../../../../../hooks/usePath";

export const DownloadDocumentTopBar = memo(({ title = "" , refreshPage, items }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const path = usePath();
    // const { docuementTemplateFiles } = useSelector((state) => state.campaigns);

    // useEffect(() => { }, [docuementTemplateFiles])

    // const refreshHandler = () => {
    //     dispatch(
    //         // getAllCampaignThunkMiddleware({ accountId: singleUser.accountId})
    //         getAllTemplateFilesThunkMiddleware()
    //     );
    // };

    return (
        <div className="h-fit px-4 py-2 gap-4 flex flex-wrap w-full justify-between bg-white rounded-md">
            <div className=" flex md:flex-row flex-col md:items-center items-startS gap-4">
                <button
                    // onClick={() => navigate("/campaigns/campaigndetails")}
                    onClick={() => path.back()}
                    className="w-fit flex items-center gap-1 buttonBackground px-2 py-1 rounded-md text-white font-semibold"
                >
                    <IoMdArrowRoundBack size={26} />
                </button>
                <h1 className=" text-xl font-semibold">{title}</h1>
            </div>
            <div className="flex justify-center items-center gap-x-2">
                {items}
                <button
                    onClick={refreshPage}
                    className="w-fit flex items-center gap-1 buttonBackground px-2 py-1 rounded-md text-white font-semibold"
                >
                    Refresh
                </button>
            </div>
        </div>
    )
});
