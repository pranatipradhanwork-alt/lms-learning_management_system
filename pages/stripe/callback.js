import {useContext,useEffect} from "react";
import {Context} from "../../context";
import {SyncOutlined} from "@ant-design/icons"
//import UserRoute from "../../component/routes/UserRoute";
import axios from "axios";
const StripeCallback =() => {
    const {state : {user},
    dispatch,

} = useContext(Context)
    useEffect(() => {
        // The saved login loads a moment after the page; send to login if it never arrives.
        const toLogin = setTimeout(() => { if(!user) window.location.href = "/login"; }, 4000);
        if(user){
            clearTimeout(toLogin);
           
            axios.post("/api/get-account-status").then((res)=> {
               console.log('res from getaccount status',res);
            dispatch({
                    type:"LOGIN",
                    payload:res.data,

               });
                window.localStorage.setItem("user", JSON.stringify(res.data));
                window.location.href = "/instructor";
            }).catch((err) => {
                const reason = (err.response && err.response.data) || err.message;
                alert(`Could not finish becoming an instructor: ${typeof reason === "string" ? reason : JSON.stringify(reason)}. Try logging out and in again.`);
                window.location.href = "/user/become-instructor";
            });
        }
        return () => clearTimeout(toLogin);
    },[user]);
    return(
        <SyncOutlined spin className="d-flex justify-content-center display-1 text-danger p-5" />
    );
};
export default StripeCallback;