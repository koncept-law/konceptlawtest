import { MdDeleteOutline } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import ConfirmMessage from "../../common/ConfirmMessage";

// Define columns
const Columns = (handleSettingSelectedUser = function(){}, selectedRow = null, setSelectedRow = function(){}) => {
  return [
    {
      name: "Sno",
      selector: (row, index) => index + 1, // Display the serial number
      width: "100px",
      center: true // Optional: center the serial number
    },
    {
      name: 'Name',
      selector: row => (
        <div
          onClick={
            (e) => {
              handleSettingSelectedUser(row);
            }}
          className="font-semibold capitalize cursor-pointer">
          {row.firstName} {row.lastName}
        </div>
      ),
      // width: "60vw"
    },
    {
      name: "Delete",
      width: "100px",
      cell: (row) => {

        const handleDeleteUser = (id) => {
          console.log("delete button is been clicked on the user", id)
        }

        return (
          <div>
            {selectedRow === row ? (
              <ConfirmMessage
                yes="Yes, I am sure"
                deleteBtn={true}
                saveOrsend=""
                className="flex-col"
                no="No, I'm not sure!"
                value={(e) => {
                  if (e) {
                    // if (!row) {
          //   return
          // }
          // const singleUserArr = []
          // singleUserArr.push(id);
          // dispatch(deleteCampaigns({ userId: singleUserArr, accountId: singleUser.accountId }));
                    handleDeleteUser(row._id)
                  }
                  setSelectedRow(false);
                }}>
                <MdDeleteOutline size={"50px"} className="mb-3 text-slate-700" />
                <h2 className="text-lg w-full text-center text-slate-700 font-normal">
                  Do You Want to Delete This User? <br />
                  <span className="font-semibold text-lg capitalize">
                    {row.firstName} {row.lastName}
                  </span>
                </h2>
              </ConfirmMessage>
            ) : null}
            <button
              className="bg-red-600 rounded-md p-2 cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                setSelectedRow(row)
              }}
            >
              <RiDeleteBin6Line size={"18px"} color="white" />
            </button>
          </div>
        )
      }
    }
  ];
}

export default Columns;
