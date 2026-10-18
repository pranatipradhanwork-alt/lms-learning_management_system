import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import {
  SyncOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { Context } from "../context";
import { useRouter } from "next/router";
import AuthLayout from "../component/layout/authLayout/authLayout";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../config/firebase";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const {
    state: { user },
  } = useContext(Context);

  const router = useRouter();

  useEffect(() => {
    if (user !== null) router.push("/");
  }, [user]);

  const onTooglePassword = () => {
    setShowPassword(!showPassword);
  };

  const onValidate = () => {
    var re = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]/;
    if (name === "") {
      toast("name can not be empty.");
    } else if (email === "") {
      toast("email can not be empty.");
    } else if (password === "") {
      toast("password can not be empty.");
    } else if (password && !re.test(password)) {
      toast(
        "Password must have at least a symbol, upper and lower case letters ."
      );
    } else if (password.length < 8) {
      toast("Password must have 8 character long.");
    } else {
      return true;
    }
    // var re = /^(\S)(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹])[a-zA-Z0-9~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]{6,15}$/;
    //   if(password && !re.test(password)){
    //         return res.status(400).send('Password must have at least a symbol, upper and lower case letters and a number and min 8 characters');
    // };
  };

  const provider = new GoogleAuthProvider();
  const googleLogin = async (e) => {
    await signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        const user = result.user;
        console.log("user from google login", user);
        if (user) {
          handleSubmit(e, user);
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        toast(errorMessage);
      });
  };
  const handleSubmit = async (e, user) => {
    e.preventDefault();
    if (user || onValidate()) {
      const payload = {
        name: user ? user.displayName : name,
        email: user ? user.email : email,
        password: user ? "" : password,
      };
      try {
        setLoading(true);
        const data = await axios.post(`/api/register`, payload);
        console.log("REGISTER RESPONSE", data);
        toast("Registration successful. Please log in.");
        setName("");
        setEmail("");
        setPassword("");
        setLoading(false);
      } catch (err) {
        toast(err.response.data);
        setLoading(false);
      }
    }
  };

  return (
    <>
      <AuthLayout>
        <div className="card-body px-4 py-4 px-lg-5 py-lg-2 text-black">
          <h1 className="h1 fw-bold mb-0 text-center pb-4">Register</h1>
          {/* <div className="container col-md-4 offset-md-4 pb-5"> */}
          {/* <form onSubmit={handleSubmit}> */}
          <div>
            <input
              type="text"
              className="form-control mb-4 p-3"
              value={name}
              // style={{marginTop:"-10px"}}
              onChange={(e) =>
                setName(e.target.value.replace(/[^a-zA-Z\s-]/g, ""))
              }
              placeholder="Enter name"
              required
            />
            <input
              type="email"
              className="form-control mb-4 p-3"
              value={email}
              // style={{marginTop:"-10px"}}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              required
            />
            <div style={{ position: "relative" }}>
              <input
                type={!showPassword ? "password" : "text"}
                className="form-control mb-4 p-3"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
              <div
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "10px",
                  zIndex: 2,
                }}
                onClick={onTooglePassword}
              >
                {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
              </div>
            </div>
            <div className="d-grid pt-4 mb-4 w-100 px-6">
              <button
                className="btn btn-lg btn-block"
                style={{ backgroundColor: "#17bf9e", color: "white" }}
                type="submit"
                disabled={loading}
                onClick={handleSubmit}
              >
                {loading ? <SyncOutlined spin /> : "submit"}
              </button>
            </div>

            <div
              className="d-grid pt-2 mb-2 w-100 px-6"
              style={{ position: "relative" }}
            >
              <button
                className="btn btn-lg btn-light btn-block border-secondary"
                type="submit"
                onClick={googleLogin}
              >
                <h3
                  style={{
                    position: "absolute",
                    zIndex: 2,
                    top: "12px",
                    left: "80px",
                  }}
                >
                  <FcGoogle />
                </h3>
                SignUp With google
              </button>
            </div>
          </div>

          {/* </form> */}
          <p className="text-center p-3">
            Already registered?{""}
            <Link href="/login">
              <a> Login</a>
            </Link>
          </p>
          {/* </div> */}
        </div>
      </AuthLayout>
    </>
  );
};
export default Register;
