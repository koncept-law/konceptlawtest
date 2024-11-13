import { useEffect, useState } from "react";

const useTimer = () => {
    const [seconds, setSeconds] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [percentage, setPercentage] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [totalTime, setTotalTime] = useState(0); // New state for total time

    /**
     * 
     * @param time - MM:SS - minutes:seconds
     */
    const start = (time = "10:00") => {
        const myTime = time.split(":");
        const minute = parseInt(myTime[0]);
        const second = parseInt(myTime[1]);

        setMinutes(minute);
        setSeconds(second);
        setIsActive(true);
        setTotalTime(minute * 60 + second); // Calculate total time in seconds
        setPercentage(0); // Reset percentage to 100 when starting
    }

    const reset = () => {
        setIsActive(false);
        setSeconds(0);
        setMinutes(0);
        setPercentage(0); // Reset percentage to 0
    }

    const stop = () => {
        setIsActive(false);
    }

    const resetAndStop = () => {
        stop();
        reset();
    }

    useEffect(() => {
        let interval;
        if (isActive) {
            interval = setInterval(() => {
                if (minutes === 0 && seconds === 0) {
                    stop(); // Stop when time runs out
                } else if (seconds === 0) {
                    setMinutes(prevMinutes => prevMinutes - 1);
                    setSeconds(59);
                } else {
                    setSeconds(prevSeconds => prevSeconds - 1);
                }

                // Calculate elapsed time in seconds
                const elapsedTime = totalTime - (minutes * 60 + seconds);
                setPercentage((elapsedTime / totalTime) * 100); // Update percentage
            }, 1000);
        }
        return () => clearInterval(interval); // Cleanup the interval
    }, [isActive, minutes, seconds, totalTime]); // Add totalTime to dependency array

    // Format time to MM:SS
    const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    return {
        start,
        reset,
        time: formattedTime,
        stop,
        isActive, // Optional: return active state
        resetAndStop,
        percentage, // Return the percentage
    }
}

export default useTimer;
