import React, { useEffect, useState } from "react";

// icons
// import DocViewer, { DocViewerRenderers } from "react-doc-viewer";
import axios from "axios";

import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import "@cyntler/react-doc-viewer/dist/index.css";
import ConfirmMessage from "../../../common/ConfirmMessage";
import { MdDeleteOutline } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { deleteDocumentFileThunkMiddleware } from "../../../../redux/features/campaigns";

const InsideDocumentBox = ({ data = {}, fileUrl = "" }) => {
  if (!data) return <div>Loading</div>
  // console.log(data);

  // const { documentTemplateFiles } = useSelector((state) => state.campaigns)

  const dispatch = useDispatch();

  const [ShowDeleteConfirmMessage, setShowDeleteConfirmMessage] = useState(false);
  // const [docsData, setDocsData] = useState(() => {
  //   return documentTemplateFiles.filter((item, index) => {
  //     return data._id === item._id
  //   })
  // });

  // console.log("docuemnt data in box by directly taking it in the file", docsData)

  // State

  const handleDeleteButton = (name, id) => {
    // console.log("delete button for the document template" , name)
    // dispatch(deleteDocumentFileThunkMiddleware({ documentName : name , documentId : id }))
    dispatch(deleteDocumentFileThunkMiddleware({ documentId: id }))
    // console.log("handleDeleteButton is been clicked for this document", fileUrl)
  }

  return (
    <>
      {
        ShowDeleteConfirmMessage ? <>
          <ConfirmMessage yes="Yes, I am sure" deleteBtn={true} className="flex-col max-h-[80vh]" no="No, I'm not sure!" value={(e) => {
            if (e) {
              handleDeleteButton(data.name, data._id);
            }
            setShowDeleteConfirmMessage(false);
          }}>
            <MdDeleteOutline size={"50px"} className="mb-3 text-slate-700" />
            <h2 className="text-lg w-full text-center text-slate-700 font-normal">Do You Want to Delete Selected Document?
              <br />
              {/* <div className="flex flex-wrap flex-col gap-y-2 overflow-y-scroll ">
                {selectedUsers && selectedUsers.map((data, index) => {
                  return (<span key={index} className="font-semibold text-lg capitalize">
                    {data.name}
                  </span>)
                })
                }
              </div> */}
            </h2>
          </ConfirmMessage>
        </> : null
      }
      <div className="flex flex-col ">
        <div className="w-full bg-white items-center justify-center">
          <div className="flex justify-between flex-wrap bg-gray-100">
            <p className="sm:w-1/4 w-full text-center p-2"><span className="font-semibold mx-2">Name:</span><span> {data.name}</span></p>
            <p className="sm:w-1/4 w-full text-center p-2"><span className="font-semibold mx-2">Type:</span><span>{data.fileType}</span></p>
            <p className="sm:w-1/4 w-full text-center p-2"><span className="font-semibold mx-2">Category:</span><span>{data.category}</span></p>
            {
              <div className="w-1/4 flex justify-center items-center p-2">
                <div onClick={(e) => {
                  e.preventDefault();
                  // if (dataInCampaign) {
                  setShowDeleteConfirmMessage(true);
                  // }
                }}
                  className="bg-red-400 w-fit cursor-pointer p-1 px-2  rounded-md text-white font-semibold"
                >Delete</div>
              </div>
            }
          </div>
        </div>
      </div>
      <div>
        <DocumentViewer fileUrl={fileUrl} data={data} />
      </div>
    </>
  )
}

export default InsideDocumentBox;

export const DocumentViewer = ({ fileUrl, data }) => {
  // const docs = [{ uri: fileUrl }];
  // const docs = [{ uri: "https://m.konceptlaw.in/campaign/download/dipesh/57220006163109.pdf" }];
  // const docs = [{ uri: "https://m.konceptlaw.in/docs/docsBuffer/doctemplet.docx" }];

  if (fileUrl === "") return <div className="h-[80vh] w-full bg-white" >on file path found</div>
  const docs = [
    {
      uri: `https://m.konceptlaw.in/docs/docsBuffer/${fileUrl}`,
      fileType: "docx",
      fileName: data?.name,
    }
  ];
  // console.log("docs url in document viewer", docs)

  return (
    <DocViewer
      documents={docs}
      pluginRenderers={DocViewerRenderers}
      // initialActiveDocument={docs[0]}
      config={{
        header: {
          disableHeader: true,
        },
      }}
      style={{ width: "100%", height: "80vh" }}
    />
  );
};

const CustomNoDataComponenet = () => {
  return (
    <div className="w-full p-10 text-center">
      There are no records to displays
    </div>
  );
};