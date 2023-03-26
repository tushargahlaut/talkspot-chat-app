import { useRef, useState } from "react";
import { toast } from "react-toastify";
import  axios  from "axios";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/userSlice";
import { useRouter } from "next/router";



const timestamp = Math.floor(Date.now() / 1000);
const publicId = `image_${timestamp}`;
const uploadPreset = "gn5fqfn6";
const apiKey = process.env.NEXT_PUBLIC_API_KEY;


const SignupBox = () => {
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const nameRef = useRef(null);
    const confirmPasswordRef = useRef(null);
   
    const [pic, setPic] = useState();
    const [picLoading, setPicLoading] = useState(false);
   
    const router = useRouter();

    

    async function handleSubmit(e) {
      e.preventDefault();
      (
        "Form Data",
        nameRef?.current?.value,
        passwordRef?.current?.value,
        emailRef?.current?.value,
        confirmPasswordRef?.current?.value
      );
      if(!nameRef?.current?.value || !passwordRef?.current?.value || !emailRef?.current?.value || !confirmPasswordRef?.current?.value){
        return toast.error("Fill All Required Fields");
      }
      else if(passwordRef?.current?.value !== confirmPasswordRef?.current?.value){
        return toast.error("Passwords Do Not Match");
      }

      try {
              const config = {
                  headers: {
                    "Content-type": "application/json",
                  },
                };
              const res1 = await axios.post(
                "http://localhost:8080/api/user/signup",
                {
                  name: nameRef?.current?.value,
                  password: passwordRef?.current?.value,
                  email: emailRef?.current?.value,
                  pic: pic,
                },
                config
              );
              ("Res", res1);
                if (res1.status === 200) {
                  useDispatch(loginSuccess(res1.data));
                  router.push("/chats");
                  return toast.success("Logged In Succesfully");
                }

      } catch (error) {
         if (error.response.status === 400) {
           // Handle the error here
           console.error("The request returned a 400 status code");
           return toast.error("User Already Exists");
         } else {
           console.error(error);
         }
      }

      const res1 = await axios.post("http://localhost:8080/api/user/signup", {
        name: nameRef?.current?.value,
        password: passwordRef?.current?.value,
        email: emailRef?.current?.value,
        pic: pic
      });
      ("Res",res1);
    }

    
  const postDetails = (pics) => {
    setPicLoading(true);
    if (pics === undefined) {
      toast.error("Please Select an Image");
      return;
    }
    (pics);
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      // const data = new FormData();
      // data.append("file", pics);
      // data.append("upload_preset", "chat-app");
      // data.append("cloud_name", "piyushproj");

      const formData = new FormData();
      formData.append("file", pics);
      formData.append("timestamp", timestamp);
      formData.append("public_id", publicId);
      formData.append("upload_preset", uploadPreset);
      formData.append("api_key", apiKey);

      const apiUrl = `https://api.cloudinary.com/v1_1/dkawluvzz/image/upload`;
      fetch(apiUrl, {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          (data.url.toString());
          toast.success("Image Uploaded Successfully")
          setPicLoading(false);
        })
        .catch((err) => {
          (err);
          setPicLoading(false);
        });

    } else {
      toast.error("Please Select an Image");
      setPicLoading(false);
      return;
    }
  };

    return (
      <div className="w-3/4">
        <form
          className="flex w-full flex-col items-center justify-center"
        >
          <div className="md:w-3/4">
            <label
              className="block font-bold text-gray-700 text-sm mb-2"
              htmlFor="name"
            >
              Name
              <span className=" ml-1 text-red-500">*</span>
            </label>
            <input
              ref={nameRef}
              className="appearance-none block w-full  text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              id="name"
              type="name"
            />
          </div>

          <div className="md:w-3/4">
            <label
              className="block font-bold text-gray-700 text-sm mb-2"
              htmlFor="email"
            >
              Email Address
              <span className=" ml-1 text-red-500">*</span>
            </label>
            <input
              ref={emailRef}
              className="appearance-none block w-full  text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              id="email"
              type="email"
            />
          </div>
          <div className="md:w-3/4">
            <label
              className="block font-bold text-gray-700 text-sm mb-2"
              htmlFor="password"
            >
              Password
              <span className=" ml-1 text-red-500">*</span>
            </label>
            <input
              ref={passwordRef}
              className="appearance-none block w-full text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
              id="password"
              type="password"
            />
          </div>

          <div className="md:w-3/4">
            <label
              className="block font-bold text-gray-700 text-sm mb-2"
              htmlFor="confirmPassword"
            >
              Confirm Password
              <span className=" ml-1 text-red-500">*</span>
            </label>
            <input
              ref={confirmPasswordRef}
              className="appearance-none block w-full text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
              id="confirmPassword"
              type="password"
            />
          </div>

          <div className="flex flex-col md:flex-row md:w-3/4 mt-3">
            <div className="md:w-3/4">
              <h1 className="block font-bold text-gray-700 text-sm mb-2">
                Upload Your Picture
              </h1>
              <input
                type="file"
                accept="image/*"
                className="appearance-none w-3/4 rounded-lg px-5 py-3 border border-gray-400 leading-tight focus:outline-none focus:shadow-outline-blue"
                onChange={(e) => postDetails(e.target.files[0])}
              />
            </div>
            <button
              onClick={handleSubmit}
              className={`${
                picLoading ? "bg-pink-300" : "bg-blue-400"
              } self-center hover:bg-blue-700 mt-5 text-white w-1/2 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
              type="submit"
            >
              <span>{picLoading ? "Loading... " : "Sign Up"}</span>
            </button>
          </div>
        </form>
      </div>
    );
}
 
export default SignupBox;