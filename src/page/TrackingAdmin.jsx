import React from "react";
import MyButton from "../components/common/Buttons/MyButton";
import { IoReload } from "react-icons/io5";
import DataTable from "react-data-table-component";

const TrackingAdmin = () => {
    const columns = [
        {
            name: "Transaction ID",
            selector: row => row?.transactionId || '-',
            wrap: true
        },
        {
            name: "Date & Time",
            selector: row => row?.dateTime || '-',
            wrap: true
        },
    ]

    const data = [
        {
            transactionId: "12345",
            dateTime: "26-07-2024 56:30",
        }
    ]

    return <>
        <div className="flex flex-col justify-center items-center w-full">
            <div className="w-full flex font-poppins py-3 px-4 not-italic leading-normal justify-between items-center">
                <h2>Payout Transactions</h2>
                <div className="flex justify-center items-center gap-x-2">
                    <MyButton className="flex justify-center items-center gap-x-2">
                        <IoReload size={18} />
                        Refresh
                    </MyButton>
                </div>
            </div>

            <div className="w-full px-4 py-3 flex justify-center items-center">
                <DataTable
                    columns={columns}
                    data={data}
                />
            </div>
        </div>
    </>
}

export default TrackingAdmin;