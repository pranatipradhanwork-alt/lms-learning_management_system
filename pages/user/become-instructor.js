import { useContext,useState } from "react";
import axios from "axios";
import { Context } from "../../context";
import { Button } from "antd";
import{SettingOutlined,UserSwitchOutlined,LoadingOutlined} from "@ant-design/icons";
import { toast } from "react-toastify";
//import { json } from "express";
//import UserRoute from "../../component/routes/UserRoute";

const BecomeInstructor = () => {
    const[loading,setLoading] = useState(false);
    const{
        state:{user},

    }= useContext(Context);
    const becomeInstructor = () =>{
       // console.log("become instructor");
       setLoading(true);
       axios.post("/api/make-instructor") .then(res =>{
           console.log('res from make-instructor',res.data.url);

           window.location.href = res.data.url;

       })
       .catch(err => {
           // Show Stripe's reason (for example, Connect not set up) instead of a generic message.
           toast(`Stripe onboarding failed: ${(err.response && err.response.data) || "Try again."}`);
           setLoading(false);
       })
    };
    return(
        <>
        <h1 className = "jumbotron text-center square" >Become Instructor</h1>
        <div className="container"style={{height:"100vh"}}>
            <div className="row">
               <div className="col-md-6.offset-md-3,text-center">
               <div className="pt-4">
                   <UserSwitchOutlined className="display-1 pb-3"/>
                   <br/>
                   <h2> Setup payout to publish course of LMS</h2>
                   <p className="lead text-warning">LMS partner with stripe to transfer earnings to your bank accounts
                   </p>
                  < Button className="mb-3" type ="primary" block shape="round"
                   icon = {loading? <LoadingOutlined /> :<SettingOutlined/>}
                   size= "large"
                   onClick={becomeInstructor}
                disabled = {
                    ( user && user.role && user.role.includes("Instructor"))||
                   loading
                }
                   >
                       {loading ? "Processing..." : "Payout Setup"}
                   </Button>
                   <p className="lead"> you will be redirected to stripe to complete onboarding process.
                   </p>
               </div>
            </div>
        </div>
        </div>
        </>
    );
};
export default BecomeInstructor;