import { useState, useEffect } from "react";
import styles from "../../styles/GroupChatModal.module.css"
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addAllChats, addGroupChat } from "../../redux/userSlice";


const GCMembers = ({ gcMembers, setGcMembers }) => {
  const handleMembers = (e) => {
    const index = gcMembers.findIndex((item) => item._id === e._id);
    if (index === -1) {
      setGcMembers([...gcMembers, e]);
    } else {
      const newArr = [...gcMembers];
      newArr.splice(index, 1);
      setGcMembers(newArr);
    }
    console.log("GC Members", gcMembers);
  };

  return (
    <div className="flex">
      {gcMembers.map((e) => (
        <div
          onClick={() => {
            handleMembers(e);
          }}
          className="flex m-1 cursor-pointer p-1 rounded-sm bg-orange-600"
        >
          <p className="text-xs text-white">{e.name}</p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            class="w-3 h-3 text-white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
      ))}
    </div>
  );
};


const SearchResults = ({allUsers,setGcMembers,gcMembers}) =>{

  const handleMembers = (e) =>{
       const index = gcMembers.findIndex(item => item._id === e._id);
       if(index>-1){
        return toast.error("Already Added");
       }
       else{
      setGcMembers([...gcMembers, e]);

       }
       console.log("GC Members",gcMembers);
  }

  return (
    <div className="flex">
      {allUsers.map((e) => (
        <div
          onClick={() => {
            handleMembers(e);
          }}
          className={` ${
            "bg-blue-900"
          }  m-1 flex cursor-pointer p-1 rounded-sm`}
        >
          <p className="text-xs text-white">{e.name}</p>

        </div>
      ))}
    </div>
  );
}

const GroupChatModal = ({ setIsGroupChatModal }) => {

  const [allUsers, setAllUsers] = useState([]);
  const [gcMembers,setGcMembers] = useState([]);
  const [gcName,setGcName] = useState("");
  const dispatch = useDispatch();
  const [gcSearch,setGcSearch] = useState("");
   const user = useSelector((state) => state.user.currentUser);
   const token = user.token;
   
 const fetchAllUsers = async(e)=> {
  e.preventDefault();
  if(!gcSearch){
    return toast.error("Please Enter Something");
  }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const res1 = await axios.get(
        `http://localhost:8080/api/user?search=${gcSearch}`,
        config
      );
      console.log("GC Array",res1.data);
      if(res1.data.length < 1)
      {
        return toast.error("No User Found");
      }
      setAllUsers(res1.data);
      
    } catch (error) {
      console.log(error);
    }
 }

 const handleGC =  async() =>{
      if(!gcName){
        return toast.error("Group Chat Name Missing");
      }
      if(gcMembers.length<1){
        return toast.error("Add Some Members");
      }
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const { data } = await axios.post(
          "http://localhost:8080/api/chat/group",{
            name:gcName,
            users:JSON.stringify(gcMembers.map((e)=>e._id))
          },
          config
        );

        dispatch(addGroupChat(data));
        setIsGroupChatModal((prev)=>!prev);
        return toast.success("Group Chat Created Successfully");

      } catch (error) {
        console.log(error);
      }
 }


  return (
    <div className={styles.GroupChatModal}>
      <div className="bg-white flex flex-col justify-center items-center h-3/4 w-1/2">
        <div
          onClick={() => setIsGroupChatModal((prev) => !prev)}
          className="mb-16 cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-10 h-10"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <div className="w-full flex items-center flex-col ">
          <input
            className="border outline-none focus:border-emerald-700 placeholder:text-emerald-700 border-emerald-500 mb-3 rounded p-3 w-1/2"
            placeholder="Enter Group Chat Name"
            type={"text"}
            onChange={(e) => {
              setGcName(e.target.value);
            }}
            value={gcName}
          />
          <div className=" flex border outline-none focus:border-emerald-700  border-emerald-500 mb-3 rounded p-3 w-1/2">
            <input
              className=" outline-none placeholder:text-emerald-700 border-none w-full"
              placeholder="Enter Group Chat Members"
              type={"text"}
              value={gcSearch}
              onChange={(e) => {
                setGcSearch(e.target.value);
              }}
            />
            <div onClick={fetchAllUsers} className="cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-emerald-800"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </div>
          </div>
          {gcMembers && (
            <GCMembers setGcMembers={setGcMembers} gcMembers={gcMembers} />
          )}
          {allUsers && (
            <SearchResults
              gcMembers={gcMembers}
              setGcMembers={setGcMembers}
              allUsers={allUsers}
            />
          )}
          <div
            onClick={handleGC}
            className="bg-green-800 mt-4 p-3 rounded cursor-pointer w-1/4 h-1/3"
          >
            <p className="text-white text-center">Create Group Chat</p>
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default GroupChatModal;