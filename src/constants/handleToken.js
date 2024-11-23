import { jwtDecode } from "jwt-decode";

const handleToken = () => {
    let token = localStorage.getItem("konceptLawToken");
    if(token){
        // token = JSON.stringify(token);
        let user = jwtDecode(token);
        // console.log(user);
        return user?.foundUser;
    }
}

export default handleToken;