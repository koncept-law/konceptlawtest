import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { toastify } from '../../toast';

const ProgressUpdateChecking = () => {

    const [countByInterval, setCountByInterval] = useState(null);
    const [countByTimeout, setCountByTimeout] = useState(null);

    const { campaignDetails } = useSelector((state) => state.campaigns)

    const handleProgressCheck = async () => {
        // const response = await axios.post("https://t.kcptl.in/docs/createSamplePdf", {
        //     campaignName: campaignDetails.name,
        // });



        // if (response.status === 200) {

            // let { totalFiles } = response.data
            // console.log("total Files getting from the response", totalFiles)
            // let files = totalFiles;
            setTimeout(()=>{
                setInterval(async () => {
                    const response1 = await axios.post("https://t.kcptl.in/docs/getProgressSampleMerging", {
                        campaignName: campaignDetails.name,
                    });
    
                    if (response1.status === 200) {
                        const { progress } = response1.data;
                        setCountByInterval(progress)
                        // if (totalFiles === response1.data?.progress) clearInterval(intervalId)
                    }
                }, 1000)
            },20000)

            // clearInterval(intervalId)

            // setTimeout(async () => {
            //     const response1 = await axios.post("/docs/getProgressSampleMerging", {
            //         campaignName: campaignDetails.name,
            //     });

            //     if (response.status === 200) {
            //         const { progress } = response1.data;
            //         setCountByTimeout(progress)
            //     }
            // }, 5000);
    // }
}

return (
    <div>
        <h1>Progress Update Checking</h1>
        <button className='bg-green-600 p-4 px-8 rounded-md' onClick={handleProgressCheck}>Get Progress</button>
        <p>Count By Interval {countByInterval}</p>
        <p>Count By Timeout {countByTimeout}</p>
    </div>
)
}

export default ProgressUpdateChecking
