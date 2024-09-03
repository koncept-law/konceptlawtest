import React, { useEffect, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";

const StopWatch = ({ start = false, stop = false }) => {
    const [open, setOpen] = useState(false);
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        let interval;
        if (isRunning) {
            interval = setInterval(() => {
                setTime(prevTime => prevTime + 1);
            }, 1000);
        } else if (!isRunning && time !== 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isRunning, time]);

    const handleStartStop = () => {
        setIsRunning(!isRunning);
    };

    const handleReset = () => {
        setIsRunning(false);
        setTime(0);
    };

    useEffect(()=> {
        if(start && !stop){
            handleStartStop();
        }else if(!start && stop){
            handleReset();
        }
    }, [start, stop])

    const formatTime = (time) => {
        const getSeconds = `0${time % 60}`.slice(-2);
        const minutes = `${Math.floor(time / 60)}`;
        const getMinutes = `0${minutes % 60}`.slice(-2);
        const getHours = `0${Math.floor(time / 3600)}`.slice(-2);
        return `${getHours}:${getMinutes}:${getSeconds}`;
    };

    return (
        <div className="bg-white fixed shadow-md w-1/3 shadow-slate-300 top-0 left-1/3">
            <div className="flex justify-between py-2.5 px-4 cursor-pointer border-b border-solid border-slate-200 items-center" onClick={() => setOpen(!open)}>
                <h2 className="text-[15px]">{!open && isRunning ? formatTime(time): null}</h2>
                <IoIosArrowDown size={22} className={`text-slate-700 transition-all duration-700 ${open ? "rotate-180" : "rotate-0"}`} />
            </div>

            {open && (
                <div className="h-16 w-full py-2 px-4 flex flex-col items-center">
                    <h2 className="text-4xl h-[80%] flex justify-center items-center text-slate-800">{formatTime(time)}</h2>
                    {/* <div className="mt-4 flex gap-4">
                        <button onClick={handleStartStop} className="px-4 py-2 bg-blue-500 text-white rounded-md">
                            {isRunning ? "Stop" : "Start"}
                        </button>
                        <button onClick={handleReset} className="px-4 py-2 bg-red-500 text-white rounded-md">
                            Reset
                        </button>
                    </div> */}
                </div>
            )}
        </div>
    );
};

export default StopWatch;
