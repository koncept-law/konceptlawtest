// import React, { useRef } from "react";
// import { Menu } from "antd";

// const UploadMenu = () => {
//     const uploadContactRef = useRef(null);

//     const handleUploadClick = () => {
//         console.log("Menu item clicked"); // Debugging line
//         if (uploadContactRef.current) {
//             uploadContactRef.current.click();
//         }
//     };

//     return (
//         <>
//             <Menu
//                 className="custom-menu" // Apply custom class here
//                 style={{ width: 250, backgroundColor: '#1e293b' }} // Set background color here
//             >
//                 <h2 className="w-full text-start text-white not-italic leading-normal font-poppins font-medium px-2 py-1">Prepare</h2>
//                 <h2 className="w-full my-1 h-[1px] bg-gray-600"></h2>
//                 <Menu.Item className="w-full" onClick={handleUploadClick}>
//                     <div className="w-full flex justify-start gap-x-3 items-center text-white">
//                         {/* <MdSms size={"17px"} /> */}
//                         <span className="font-poppins not-italic leading-normal font-medium text-[13px]">Upload Contact Excel</span>
//                     </div>
//                 </Menu.Item>
//                 <input ref={uploadContactRef} type="file" style={{ display: 'none' }} />
//             </Menu>
//         </>
//     );
// };

// export default UploadMenu;
