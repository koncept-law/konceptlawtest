import React from "react";

const BackgroundScreen = ({
    children,
    className = ""
}) => {
    return <>
        <div className={`koncept-background w-full h-screen flex justify-center items-center ${className}`}>
            {children}
        </div>
    </>
}

export default BackgroundScreen;
