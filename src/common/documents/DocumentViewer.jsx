// import React from "react";
// import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

// const DocumentViewer = ({ fileUrl, data }) => {
//     // const docs = [{ uri: fileUrl }];
//     // const docs = [{ uri: "https://m.konceptlaw.in/campaign/download/dipesh/57220006163109.pdf" }];
//     // const docs = [{ uri: "https://m.konceptlaw.in/docs/docsBuffer/doctemplet.docx" }];

//     if (fileUrl === "") return <div className="h-full w-full bg-white" >on file path found</div>
//     const docs = [
//         {
//             uri: `https://m.konceptlaw.in/docs/docsBuffer/${fileUrl}`,
//             fileType: "docx",
//             fileName: data?.name,
//         }
//     ];

//     return (
//         <DocViewer
//             documents={docs}
//             pluginRenderers={DocViewerRenderers}
//             // initialActiveDocument={docs[0]}
//             config={{
//                 header: {
//                     disableHeader: true,
//                 },
//             }}
//             style={{ width: "100%", height: "100%" }}
//         />
//     );
// };

// export default DocumentViewer;

// ==========================================================================================================
// import React, { useMemo } from "react";
// import { useSelector } from "react-redux";

// const DocumentViewer = ({ fileUrl }) => {
//     const { selectFile } = useSelector(state => state.campaigns);
//     console.log("Select file in doc. viwer", selectFile);
//     let file = selectFile?.path?.split("/")[1];
//     console.log("select file", file);
//     if (!fileUrl) {
//         return <div>No file path found</div>;
//     }

//     const googleDocsViewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(
//         `https://m.konceptlaw.in/docs/docsBuffer/${fileUrl}`
//     )}&embedded=true`;

//     // const officeViewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
//     //     `https://m.konceptlaw.in/docs/docsBuffer/${fileUrl}`
//     // )}`;
//     const officeViewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
//         `https://m.konceptlaw.in/docs/docsBuffer/${file}`
//     )}`;
    

//     // const googleDocsViewerUrl = useMemo(() => {
//     //     return `https://docs.google.com/gview?url=${encodeURIComponent(
//     //         `https://m.konceptlaw.in/docs/docsBuffer/${fileUrl}`
//     //     )}&embedded=true`;
//     // }, [fileUrl]);

//     return <>
//         <iframe
//             // src={googleDocsViewerUrl}
//             src={officeViewerUrl}
//             style={{ width: "100%", height: "72vh", border: "none" }}
//             title="Document Viewer"
//         />
//     </>
// };

// export default DocumentViewer;
import React, { useMemo, useEffect } from "react";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { useSelector } from "react-redux";
import { isEqual } from "lodash"; // Import deep comparison utility

const DocumentViewer = ({ fileUrl, data }) => {
  // Use deep equality check for useSelector
  const selectFile = useSelector((state) => state.campaigns.selectFile, isEqual);

  const file = selectFile?.path?.split("/")[1];

  console.log("Selected file:", selectFile);

  // Memoize the documents array to prevent re-computation on each render
  const docs = useMemo(() => {
    if (!file) return null;

    return [
      {
        uri: `https://m.konceptlaw.in/docs/docsBuffer/${file}`,
        fileType: "docx",
        fileName: selectFile?.name,
      },
    ];
  }, [file, selectFile]);

  // Trigger effect when 'docs' changes
  useEffect(() => {
    console.log("Documents changed:", docs);
  }, [docs]);

  // If no file path is found, display an error message
  if (!file) {
    return <div className="h-full w-full bg-white">No file path found</div>;
  }

  return (
    <DocViewer
      key={docs ? docs[0].uri : 'no-doc'} // Unique key based on documents
      documents={docs}
      pluginRenderers={DocViewerRenderers}
      config={{
        header: {
          disableHeader: true,
        },
      }}
      style={{ width: "100%", height: "100%" }}
    />
  );
};

export default DocumentViewer;
