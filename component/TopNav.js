import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { Context } from "../context";
import { Menu, Avatar, Dropdown, Drawer, SubMenu, ItemGroup } from "antd";
import SearchBar from "./searchBar/searchBar";
import {
  MenuOutlined,
  LogoutOutlined,
  AppstoreOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import axios from "axios";
const { Item } = Menu;

const TopNav = () => {
  const [current, setCurrent] = useState("");
  const [visible, setVisible] = useState(false);
  const { state, dispatch } = useContext(Context);
  const { user } = state;
  console.log("user", state);
  const router = useRouter();

  useEffect(() => {
    process.browser && setCurrent(window.location.pathname);
    console.log(window.location.pathname);
  }, [process.browser && window.location.pathname]);

  const logout = async () => {
    dispatch({ type: "LOGOUT" });
    window.localStorage.removeItem("user");
    const { data } = await axios.get("/api/logout");
    toast(data.message);
    router.push("/login");
  };

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  return (
    <>
      <nav className=" bg-white main-nav ">
        <div className="main-nav-content">
          <div className="logo">
            <img
              src="./assets/images/prlogo1.png"
              style={{ height: "auto", width: "130px", objectFit: "cover" }}
            />
          </div>
          <div className="menu-link px-2">
            <Link href="/">
              <a>Home</a>
            </Link>
          </div>
          {user && user.role && user.role.includes("Instructor") && (
            <div className="menu-link px-3 ">
              <Link href="/instructor">
                <a>Instructor</a>
              </Link>
            </div>
          )}
          <div className="d-flex align-items-center flex-grow-1 desktop-menu ">
            <div className=" px-5" style={{ display: "flex", flexGrow: 1 }}>
              <SearchBar />
            </div>
            
            <div className="d-flex  d-flex align-items-center ">
            <div className="nav-item active mx-2">
                    <a>About Us</a>
                    <div className="dropdown-menu-div">
                    <div className="dropdown-content">
                      <div className="menu-link">
                      <a>My learnings</a>
                        </div>
                        </div>
                      </div>
                      </div>
                      </div>
                      <div className="d-flex align-items-center my-2 text-dark">
                      <div className="nav-item active mx-2">
                    <a>Contact Us</a>
                      </div>
                      </div>
                      
            {user === null ? (
              <div className="d-flex align-items-center">
                <div className="nav-item active mx-2">
                  <Link href="/login">
                    <a>
                      <button className="btn btn-outline-success my-2 my-sm-0">
                        Login
                      </button>
                    </a>
                  </Link>
                </div>
                <div className="nav-item active mx-2">
                  <Link href="/register">
                    <a>
                      <button
                        className="btn btn-outline-success my-2 my-sm-0"
                        style={{ backgroundColor: "#17bf9e", color: "white" }}
                      >
                        SignUp
                      </button>
                    </a>
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className="avatar" style={{ position: "relative" }}>
                  <Avatar
                    style={{
                      backgroundColor: "black",
                      verticalAlign: "middle",
                      position: "relative",
                    }}
                    size="large"

                    // gap={gap}
                  >
                    {user?.name?.split("")[0]}
                  </Avatar>
                  <div className="dropdown-menu-div">
                    <div className="dropdown-content">
                      <div className="menu-link">
                        {user &&
                        user.role &&
                        user.role.includes("Instructor") ? (
                          <Link href="/instructor/course/create">
                            <a>Create Course</a>
                          </Link>
                        ) : (
                          <Link href="/user/become-instructor">
                            <a>Become instructor</a>
                          </Link>
                        )}
                      </div>
                      <div className=" menu-link pt-2">
                      <Link href="/user">
                        <a>My learnings</a>
                      </Link>{" "}
                      </div>
                      <div className=" menu-link px-5 pt-2 ">
                      <div>
                        <button onClick={logout}>Logout</button>
                      </div>
                      </div>
                     
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="mobile-menu " onClick={showDrawer}>
            <MenuOutlined />
          </div>
        </div>
        <div className=" search-bars">
          <SearchBar />
        </div>
      </nav>
      <Drawer
        title="Basic Drawer"
        placement="right"
        onClose={onClose}
        visible={visible}
        size={200}
        style={{ zIndex: 2001 }}
      >
        {user !== null && (
          <></>
          // <SubMenu
          //   key="/logout"
          //   icon={<LogoutOutlined />}
          //   title={user && user.data.name}
          //   style={{ float: "right" }}
          // >
          //   <ItemGroup>
          //     <Item key="/user">
          //       <Link href={"/user"}>
          //         <a>Dashboard</a>{" "}
          //       </Link>{" "}
          //     </Item>

          //     <Item onClick={logout}>Logout</Item>
          //   </ItemGroup>
          // </SubMenu>
        )}
        {/* <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p> */}
      </Drawer>
    </>
  );
};
export default TopNav;
