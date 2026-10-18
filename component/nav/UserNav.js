import Link from "next/link";
import { useEffect, useState } from "react";
const UserNav =() => {
    const [current,setCurrent] = useState("");
    useEffect(() => {
      process.browser && setCurrent(window.location.pathname);
      console.log(window.location.pathname);
    }, [process.browser && window.location.pathname]);
    return(
        <div className = "nav flex-column nav-pills" style={{paddingTop:"100px"}}>
            {/* <Link href="/user">
            <a className ={`nav-link ${current === "/user" && "active"}`}>Dashboard</a>
            </Link> */}
        </div>
    );
};
export default UserNav;