// import React, { useMemo, useEffect } from "react";
// import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
// import { useSelector } from "react-redux";
// import { isEqual } from "lodash"; // Import deep comparison utility
// import useDocument from "../../hooks/useDocument";

// const DocumentViewer = ({ fileUrl, data }) => {
//   // Use deep equality check for useSelector
//   const selectFile = useSelector(
//     (state) => state.campaigns.selectFile,
//     isEqual
//   );
//   const docs = useDocument();
  

//   const file = selectFile?.path?.split("/")[1];

//   console.log("Selected file:", selectFile);

//   // Memoize the documents array to prevent re-computation on each render
//   const docx = useMemo(() => {
//     if (!file) return null;

//     return {
//       uri: `https://t.kcptl.in/docs/docsBuffer/${file}`,
//       fileType: "docx",
//       fileName: selectFile?.name,
//     }
//   }, [file, selectFile]);

//   // Trigger effect when 'docs' changes
//   // const converter = async () => {
//   //   console.log("not convert hmtl ")
//   //   const fetchBuffer = await fetch(docx.uri);
//   //   const resp = await fetchBuffer.blob();
//   //   const converHtml = await docs.docxConvertHtml([resp]);
//   //   console.log("convert html", converHtml)
//   // }
//   useEffect(() => {
//     // converter();
//     console.log("Documents changed:", docx);
//   }, [docx]);

//   // If no file path is found, display an error message
//   if (!file) {
//     return <div className="h-full w-full bg-white">No file path found</div>;
//   }

//   return (
//     <DocViewer
//       key={docx ? docx?.uri : "no-doc"} // Unique key based on documents URI
//       documents={docx}
//       pluginRenderers={DocViewerRenderers}
//       config={{
//         header: {
//           disableHeader: true,
//         },
//       }}
//       style={{ width: "100%", height: "100%" }}
//     />
//   );
// };

// export default DocumentViewer;

import React, { useMemo, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Spin } from "antd"; // Import the Spin component from Ant Design
import { isEqual } from "lodash"; // Import deep comparison utility

const DocumentViewer = ({ fileUrl, data }) => {
  // Use deep equality check for useSelector
  const selectFile = useSelector((state) => state.campaigns.selectFile, isEqual);

  const [loading, setLoading] = useState(true);
  const [iframeUrl, setIframeUrl] = useState(null);

  // Memoize the Google Docs URL to prevent re-computation on each render
  const googleDocsUrl = useMemo(() => {
    if (!selectFile?.path) return null;

    const file = selectFile.path.split("/")[1];
    const docxUrl = `https://t.kcptl.in/docs/docsBuffer/${file}`;
    // Create a Google Docs Viewer URL
    return `https://docs.google.com/gview?url=${encodeURIComponent(docxUrl)}&embedded=true`;
  }, [selectFile]);

  // Effect to handle changes in selectFile
  useEffect(() => {
    setLoading(true);
    setIframeUrl(null); // Clear the iframe URL to force re-render
  }, [selectFile]);

  useEffect(() => {
    if (googleDocsUrl) {
      setIframeUrl(googleDocsUrl); // Set the iframe URL
    }
  }, [googleDocsUrl]);

  // If no file path is found, display an error message
  if (!selectFile?.path) {
    return <div className="h-full w-full bg-white">No file path found</div>;
  }

  return (
    <div className="h-full w-full relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Spin size="default" /> {/* Ant Design Spin component */}
        </div>
      )}
      <iframe
        src={iframeUrl}
        style={{ width: "100%", height: "100%", border: "none" }}
        title="Google Docs Viewer"
        onLoad={() => setLoading(false)} // Set loading to false when iframe loads
      />
    </div>
  );
};

export default DocumentViewer;
