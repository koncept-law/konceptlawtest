import React from "react";

import Wave from "../svgs/Wave.svg";
import MyButton from "../components/common/Buttons/MyButton";
import { useRazorpay } from "react-razorpay";

const TrackingSubscription = () => {
    const Card = ({
        color = "bg-orange-600",
        title = "",
        points = []
    }) => {
        const { error, isLoading, Razorpay } = useRazorpay();

        const handlePayment = () => {
            const options = {
                key: "YOUR_RAZORPAY_KEY",
                amount: 50000, // Amount in paise
                currency: "INR",
                name: "Test Company",
                description: "Test Transaction",
                order_id: "order_9A33XWu170gUtm", // Generate order_id on server
                handler: (response) => {
                    console.log(response);
                    alert("Payment Successful!");
                },
                prefill: {
                    name: "John Doe",
                    email: "john.doe@example.com",
                    contact: "9999999999",
                },
                theme: {
                    color: "#F37254",
                },
            };

            const razorpayInstance = new Razorpay(options);
            razorpayInstance.open();
        };

        return <>
            <div className="bg-white rounded-md overflow-hidden h-[480px] transition-all cursor-pointer duration-300 hover:scale-105 w-[90%]">
                <div className={`h-[40%] p-4 -space-y-2 relative w-full duration-0 ${color}`}>
                    <div className="flex justify-start w-full items-center gap-x-2">
                        <h2 className="text-[45px] font-bold">$20</h2>
                        <p className="text-[14px]">/month</p>
                    </div>
                    <div className="flex justify-start w-full items-center">
                        <h2 className="text-[30px] font-semibold uppercase">{title}</h2>
                    </div>
                    <img src={Wave} alt="" className="w-[1000px] select-none absolute text-white -bottom-1 left-0" />
                </div>

                <div className="w-full list-none text-black flex flex-col px-5 my-6 relative justify-center items-center gap-y-3">
                    {
                        points?.map((item, index) => (
                            <li key={index} className="flex justify-start items-center w-full gap-x-3">
                                <div className={`p-1 rounded-full ${color}`}></div>
                                <span className="text-[14px]">{item}</span>
                            </li>
                        ))
                    }
                </div>

                {/* {isLoading && <p>Loading Razorpay...</p>}
                {error && <p>Error loading Razorpay: {error}</p>} */}
                <div className="w-full flex justify-center items-center">
                    <MyButton className={`py-2 px-5 cursor-pointer ${color}`} onClick={handlePayment} disabled={isLoading}>Buy Now</MyButton>
                </div>
            </div>
        </>
    }

    const plains = [
        {
            title: "Basic",
            color: "bg-orange-600",
            points: [
                "Up to 2 dedicated servers for streamlined performance.",
                "2 GB RAM for essential operational needs.",
                "Real-time tracking of server health and uptime.",
                "Email alerts for critical server events and issues."
            ],
        },
        // {
        //     title: "Standard",
        //     color: "bg-orange-500",
        //     points: [
        //         "Up to 2 dedicated servers for streamlined performance.",
        //         "2 GB RAM for essential operational needs.",
        //         "Real-time tracking of server health and uptime.",
        //         "Email alerts for critical server events and issues."
        //     ],
        // },
        {
            title: "Premium",
            color: "bg-blue-600",
            points: [
                "Up to 2 dedicated servers for streamlined performance.",
                "2 GB RAM for essential operational needs.",
                "Real-time tracking of server health and uptime.",
                "Email alerts for critical server events and issues."
            ],
        },
        // {
        //     title: "Special",
        //     color: "bg-purple-700",
        //     points: [
        //         "Up to 2 dedicated servers for streamlined performance.",
        //         "2 GB RAM for essential operational needs.",
        //         "Real-time tracking of server health and uptime.",
        //         "Email alerts for critical server events and issues."
        //     ],
        // },
    ]

    return <>
        <div className="flex justify-start overflow-y-scroll flex-col gap-y-10 py-10 items-center h-screen w-full gap-x-3 bg-gray-800 font-poppins not-italic leading-normal koncept-background text-white">
            <h2 className="text-[32px] font-medium">Our Pricing & Plans</h2>

            <div className="w-full flex justify-center items-center">
                <div className="grid grid-cols-2 gap-y-12 items-center justify-center px-10 gap-x-10">
                    {
                        plains.map((props, index) => (
                            <div className="w-full justify-center items-center flex">
                                <Card key={index} {...props} />
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    </>
}

export default TrackingSubscription;