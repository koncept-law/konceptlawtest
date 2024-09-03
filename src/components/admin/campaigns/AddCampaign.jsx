import React, { useState } from "react";
import { MdOutlineClose } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  addCampaignThunkMiddleware,
  getAllCampaignThunkMiddleware,
} from "../../../redux/features/campaigns";
import Spinner from "../../common/Spinner";
import { Select } from "antd";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@material-tailwind/react";

const AddCampaign = ({ modal, toggle }) => {
  const dispatch = useDispatch();
  const { addLoader } = useSelector((state) => state.loaders);
  const { singleUser } = useSelector((state) => state.campaigns);

  const campaignType = [
    {
      label: "PDF",
      value: "pdfType",
    },
    {
      label: "Merge",
      value: "mergeType",
    },
  ];

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      campaignName: "",
      campaignType: "",
    },
  });

  const uploadHandler = (data) => {
    dispatch(
      addCampaignThunkMiddleware(
        {
          campaignName: data.campaignName,
          accountId: singleUser.accountId,
          campaignType: data.campaignType,
        },
        (error) => {
          if (!error) {
            toggle();
            reset();
            // dispatch(getUserAllCampaignThunkMiddleware({ accountId : singleUser.accountId }));
          }
        }
      )
    );
  };

  return (
    <div
      className={` ${
        modal ? "fixed" : "hidden"
      } fixed top-0 left-0 w-[100%] h-[100%] z-40 flex justify-center items-center`}
    >
      {/* OverLay  */}
      <div className="absolute w-[100%] h-[100%] bg-black opacity-25"></div>

      {/* Content  */}
      <div className="bg-white rounded-lg w-[90%] md:w-[60%] p-2 absolute z-10 mt-10">
        {/* Model Header  */}
        <div className="modelHeadingBackground p-3 border-blue-800 rounded flex items-center justify-between">
          <h1 className="text-white text-xl font-semibold">Add Campaign</h1>
          <span className="text-white text-xl cursor-pointer" onClick={toggle}>
            <MdOutlineClose />
          </span>
        </div>

        {/* Modal Body  */}
        <div className="h-[100%] border-purple-800 rounded">
          <div className="space-y-3" id="myForm">
            <div className="flex flex-col gap-1 rounded">
              <label htmlFor="" className="text-sm py-2 font-semibold">
                Campaign Name
              </label>
              <Controller
                name="campaignName"
                control={control}
                rules={{ required: "Campaign Name is required" }}
                render={({ field }) => (
                  <input
                    type="text"
                    className={`border-2 rounded p-1 flex-1 outline-none ${
                      errors.campaignName ? "border-red-500" : ""
                    }`}
                    {...field}
                  />
                )}
              />
              {errors.campaignName && (
                <span className="text-red-500 text-sm">{errors.campaignName.message}</span>
              )}
            </div>

            <div className="flex flex-col gap-1 rounded">
              <label htmlFor="" className="text-sm py-2 font-semibold">
                Campaign Type
              </label>
              <Controller
                name="campaignType"
                control={control}
                rules={{ required: "Campaign Type is required" }}
                render={({ field }) => (
                  <Select
                    placeholder="Select An Option"
                    className={`h-[40px] outline-none ${
                      errors.campaignType ? "border-red-500" : ""
                    }`}
                    options={campaignType.map((option) => ({
                      label: option.label,
                      value: option.value,
                    }))}
                    onChange={(value) => field.onChange(value)}
                    value={field.value}
                  />
                )}
              />
              {errors.campaignType && (
                <span className="text-red-500 text-sm">{errors.campaignType.message}</span>
              )}
            </div>

            <div className="pt-4">
              <Button
                className="p-3 rounded capitalize font-poppins not-italic leading-normal modelHeadingBackground text-white font-bold hover:bg-transparent transition-all duration-300 w-full"
                disabled={addLoader}
                onClick={handleSubmit(uploadHandler)}
              >
                {addLoader ? <Spinner /> : "Add"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCampaign;
