import Link from "next/link";
import { useEffect, useState } from "react";
const InstructorNav = () => {
  const [current, setCurrent] = useState("");
  useEffect(() => {
    process.browser && setCurrent(window.location.pathname);
    console.log(window.location.pathname);
  });
  return (
    <div
      className=" nav flex-column nav-pills pl-20"
      style={{ paddingTop: "100px", paddingLeft: "20px" }}
    >
      <Link href="/instructor">
        <a
          className={`nav-link ${current === "/instructor" && "active"}`}
         
        >
          Dashboard
        </a>
      </Link>
      <Link href="/instructor/course/create">
        <a
          className={`nav-link ${
            current === "/instructor/course/create" && "active"
          }`}
        >
          Course Create
        </a>
      </Link>
      <Link href="/instructor/revenue">
        <a
          className={`nav-link ${
            current === "/instructor/revenue" && "active"
          }`}
        >
          Revenue
        </a>
      </Link>
    </div>
  );
};
export default InstructorNav;
