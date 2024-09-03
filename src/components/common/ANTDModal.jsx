import { Modal } from 'antd'
import React from 'react'
import { MdOutlineClose } from 'react-icons/md'

const ANTDModal = ({ toggle, setToggle, customTitle }) => {

  const handleCancel = () => {
    setToggle(false)
  }

  const handleCloseBtn = () => {
    setToggle(false)
  }

  return (
    <>
      <div className="absolute w-[100%] h-[100%] bg-black opacity-25"></div>
      <Modal width={"90%"} centered open={toggle}
        onCancel={handleCancel}
        cancelButtonProps={{ hidden: true }}
        okButtonProps={{ hidden: true }}
        closable={false}
      >
        {/* <div className="bg-white rounded-lg w-[100%] md:w-[100%] mx-auto min-h-[80vh]">
        <div className="modelHeadingBackground p-3 border-blue-800 rounded flex items-center justify-between">
          <h1 className="text-white text-xl font-semibold">{customTitle}</h1>
          <span
            className=" text-black text-xl cursor-pointer"
            onClick={handleCloseBtn}
          >
            <MdOutlineClose />
          </span>
        </div>
      </div> */}
      </Modal>
    </>
  )
}

export default ANTDModal
