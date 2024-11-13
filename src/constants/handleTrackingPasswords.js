const handleTrackingPasswords = (credentials = null) => {
    const passwords = [
        {
            userName: "dipesh",
            password: "Dipesh@1234"
        },
    ]

    if (credentials) {
        try {
            return passwords.find(({ userName, password }) => (credentials?.userName === userName && credentials?.password === password)) ? true: false;
        } catch (err) {
            console.log("Handle Tracking Password Error:", err)
        }
    }

    return false;
}

export default handleTrackingPasswords;