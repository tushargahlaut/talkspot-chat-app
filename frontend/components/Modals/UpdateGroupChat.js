import { useDispatch, useSelector } from "react-redux";
import styles from "../../styles/UpdateGroupChat.module.css";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  addMemberToGroupChat,
  leaveGroupChat,
  removeMemberFromGroupChat,
  renameGroupChat,
} from "../../Redux/userSlice";

const UpdateGroupChat = ({ setIsUpdateGroupChatModal }) => {
  const selectedChat = useSelector((state) => state?.user?.selectedChat);
  const user = useSelector((state) => state?.user?.currentUser);
  const dispatch = useDispatch();
  const token = user.token;
  const users = selectedChat?.users;
  const [chatName, setChatName] = useState(selectedChat?.chatName);
  const [searchName, setSearchName] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleMemberDelete = async (e) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const res1 = await axios.put(
        "https://talkspot-backend.onrender.com/api/chat/groupremove",
        {
          chatId: selectedChat._id,
          userId: e._id === user._id ? user._id : e._id,
        },
        config
      );
      console.log(res1.data);
      if (e._id === user._id) {
        dispatch(leaveGroupChat());
      } else dispatch(removeMemberFromGroupChat({ selectedChat, e }));
      return toast.success("Member Removed");
    } catch (error) {
      console.log(error);
    }
  };

  const handleNameUpdate = async () => {
    if (!chatName) {
      return toast.error("Please Enter Something");
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const res1 = await axios.put(
        "https://talkspot-backend.onrender.com/api/chat/rename",
        {
          chatId: selectedChat._id,
          chatName,
        },
        config
      );
      console.log(res1.data);
      dispatch(renameGroupChat(res1.data));
      return toast.success("Name Updated Successfully");
    } catch (error) {
      console.log(error);
    }
  };

  const handleMemberSearch = async () => {
    if (!searchName) {
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const res1 = await axios.get(
        `https://talkspot-backend.onrender.com/api/user?search=${searchName}`,
        config
      );
      setSearchResults(res1.data);
      if (res1.data.length < 1) {
        return toast.error("No User Found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const Members = () => {
    return (
      <div className="flex">
        {users?.map((e) => (
          <div
            key={e._id}
            onClick={() => handleMemberDelete(e)}
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

  const SearchResults = () => {
    const handleAddMembers = async (e) => {
      const index = users.findIndex((item) => item._id === e._id);
      if (index > -1) {
        return toast.error("User is already present");
      }
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const res1 = await axios.put(
          "https://talkspot-backend.onrender.com/api/chat/groupadd",
          {
            chatId: selectedChat._id,
            userId: e._id,
          },
          config
        );
        console.log(res1);
        dispatch(addMemberToGroupChat({ selectedChat, e }));
        return toast.success("Member Added Succesfully");
      } catch (error) {
        console.log(error);
      }
    };

    return (
      <div className="flex">
        {searchResults?.map((e) => (
          <div
            key={e._id}
            onClick={() => handleAddMembers(e)}
            className="flex m-1 cursor-pointer p-1 rounded-sm bg-blue-600"
          >
            <p className="text-xs text-white">{e.name}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.UpdateGroupChat}>
      <div className="bg-white flex flex-col justify-center items-center h-3/4 w-1/2">
        <div
          onClick={() => setIsUpdateGroupChatModal((prev) => !prev)}
          className="mb-10 cursor-pointer"
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
        <Members />
        <div className="m-2 w-full flex items-center flex-col ">
          <div className="flex w-full justify-center">
            <input
              type="text"
              className="border outline-none h-3/4 focus:border-emerald-700 placeholder:text-emerald-700 border-emerald-500 mb-3 p-3 w-1/2"
              placeholder="Enter Chat Name"
              value={chatName}
              onChange={(e) => setChatName(e.target.value)}
            />
            <div
              onClick={handleNameUpdate}
              className="flex items-center cursor-pointer border h-3/4 border-emerald-700 bg-emerald-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="m-2 w-full flex items-center flex-col ">
          <div className="flex w-full justify-center">
            <input
              type="text"
              className="border outline-none h-3/4 focus:border-emerald-700 placeholder:text-emerald-700 border-emerald-500 mb-3 p-3 w-1/2"
              placeholder="Add More Members"
              value={searchName}
              onChange={(e) => {
                setSearchName(e.target.value);
              }}
            />
            <div
              onClick={handleMemberSearch}
              className="flex items-center cursor-pointer border h-3/4 border-emerald-700 bg-emerald-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </div>
          </div>
          {searchResults.length > 0 && <SearchResults />}
        </div>
        <div
          onClick={() => handleMemberDelete(user)}
          className="bg-red-600 rounded-sm flex items-center p-2 cursor-pointer justify-end"
        >
          <p className="text-white">LEAVE GROUP</p>
        </div>
      </div>
    </div>
  );
};

export default UpdateGroupChat;
