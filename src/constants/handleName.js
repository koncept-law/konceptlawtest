const handleName = (user) => {
    if (user) {
        let name = "";
        if (user?.firstName && user?.firstName !== "") {
            name += user?.firstName;
        }
        if(user?.lastName && user?.lastName !== ""){
            name += ` ${user?.lastName}`;
        }

        return name;
    }

    return null;
}

export default handleName;