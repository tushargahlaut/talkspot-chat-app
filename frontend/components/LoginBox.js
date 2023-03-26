import { useRef,useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { loginFailure, loginStart, loginSuccess } from "../redux/userSlice";
import { useRouter } from "next/router";

const LoginBox = () => {

    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const dispatch = useDispatch();
    const user = useSelector((state)=>state);
    const router = useRouter();
    async function handleSubmit(e) {
        e.preventDefault();
        dispatch(loginStart);
        if(!email || !password){
          dispatch(loginFailure);
          return toast.error("Fill All Fields");
          
        }
        try {
          const res1 = await axios.post("http://localhost:8080/api/user/login",
              {
                email,password
              })

              if(res1.status===200){
                  dispatch(loginSuccess(res1.data));
                  console.log(res1.data);
                  router.push("/chats");
                  return toast.success("Logged In Succesfully");
                  
              }
        } catch (error) {
          if (error.response.status === 400) {
            // Handle the error here
            console.error("The request returned a 400 status code");
            dispatch(loginFailure());
            return toast.error("Wrong Email/Password");

          } else {
            console.error(error);
            dispatch(loginFailure());
          }
          
        }
    }

    function handleGuestUserClick(e){
        e.preventDefault();
        setEmail("guest@example.com");
        setPassword("123456");
        handleSubmit();
    }

    return (
      <div className="w-full md:w-3/4">
        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col items-center justify-center"
        >
          <div className="w-full md:w-3/4">
            <label
              className="block font-bold text-gray-700 text-sm mb-2"
              htmlFor="email"
            >
              Email Address
              <span className=" ml-1 text-red-500">*</span>
            </label>
            <input
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              className="appearance-none block w-full  text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              id="email"
              type="email"
            />
          </div>
          <div className="w-full md:w-3/4">
            <label
              className="block font-bold text-gray-700 text-sm mb-2"
              htmlFor="password"
            >
              Password
              <span className=" ml-1 text-red-500">*</span>
            </label>
            <input
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              className="appearance-none block w-full text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
              id="password"
              type="password"
            />
          </div>

          <button
            className="bg-blue-500 self-center hover:bg-blue-700 mt-10 text-white w-full md:w-1/2 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Sign in
          </button>

          <button
            onClick={handleGuestUserClick}
            className="bg-rose-500 self-center hover:bg-rose-700 mt-4 text-white w-full md:w-1/2 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Login As Guest
          </button>
        </form>
      </div>
    );
}
 
export default LoginBox;