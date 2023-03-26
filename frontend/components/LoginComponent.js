import { useState } from "react";
import styles from "../styles/LoginComponent.module.css"
import LoginBox from "./LoginBox";
import SignupBox from "./SignupBox";

const Login = () => {
    const [modal,setModal] = useState("LOGIN");
    return (
      <div
        className={`${styles.Parent} flex md:items-center rounded-md overflow-auto bg-blue-gray-400 justify-center bg-white`}
      >
        <div className="flex flex-col p-4 pt-1 w-full bg-blue-gray-400 items-center md:justify-center">
          <div className="flex w-3/4 mb-8 mt-3 justify-center">
            <div className="flex justify-between">
              <div
                className={` ${
                  modal === "LOGIN"
                    ? "bg-green-400"
                    : "border-solid border border-green-400"
                }  cursor-pointer mx-3 rounded`}
                onClick={() => {
                  setModal("LOGIN");
                }}
              >
                <p
                  className={` ${
                    modal === "LOGIN" ? "text-white" : "text-green-400"
                  }  px-8 py-3`}
                >
                  LOGIN
                </p>
              </div>
              <div
                className={` ${
                  modal === "SIGNUP"
                    ? "bg-green-400"
                    : "border-solid border border-green-400"
                }  cursor-pointer mx-3 rounded`}
                onClick={() => {
                  setModal("SIGNUP");
                }}
              >
                <p
                  className={` ${
                    modal === "SIGNUP" ? "text-white" : "text-green-400"
                  }  px-8 py-3`}
                >
                  SIGNUP
                </p>
              </div>
            </div>
          </div>

          {modal === "LOGIN" ? <LoginBox /> : <SignupBox />}
        </div>
      </div>
    );
}
 
export default Login;