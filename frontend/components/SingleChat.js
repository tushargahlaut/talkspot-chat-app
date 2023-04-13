import { useDispatch, useSelector } from "react-redux";
import { getSenderFull } from "../utils/chatLogic";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import ChatBox from "./ChatBox";
import io from "socket.io-client";
import { addNotifications } from "../Redux/userSlice";

const ENDPOINT = "https://talkspot-backend.onrender.com";
var socket, selectedChatCompare;

const Header = ({
  selectedChat,
  setIsUpdateGroupChatModal,
  user,
  isTyping,
}) => {
  return (
    <div className="w-full rounded-sm p-2 bg-blue-100">
      {selectedChat?.isGroupChat ? (
        <div className="flex justify-between">
          <p className="mx-10 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zM6 8a2 2 0 11-4 0 2 2 0 014 0zM1.49 15.326a.78.78 0 01-.358-.442 3 3 0 014.308-3.516 6.484 6.484 0 00-1.905 3.959c-.023.222-.014.442.025.654a4.97 4.97 0 01-2.07-.655zM16.44 15.98a4.97 4.97 0 002.07-.654.78.78 0 00.357-.442 3 3 0 00-4.308-3.517 6.484 6.484 0 011.907 3.96 2.32 2.32 0 01-.026.654zM18 8a2 2 0 11-4 0 2 2 0 014 0zM5.304 16.19a.844.844 0 01-.277-.71 5 5 0 019.947 0 .843.843 0 01-.277.71A6.975 6.975 0 0110 18a6.974 6.974 0 01-4.696-1.81z" />
            </svg>

            <span className="ml-2">{selectedChat?.chatName}</span>
          </p>
          {selectedChat?.groupAdmin?._id === user?._id && (
            <div
              onClick={() => setIsUpdateGroupChatModal((prev) => !prev)}
              className="bg-blue-300 cursor-pointer p-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                class="w-3 h-3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                />
              </svg>
            </div>
          )}
        </div>
      ) : (
        <div className="flex">
          <img
            className="h-8 w-8  rounded-full"
            src={getSenderFull(user, selectedChat.users).pic}
          ></img>
          <div className="ml-3">
            <p className={`font-semibold ${"text-black"}`}>
              {getSenderFull(user, selectedChat.users).name}
            </p>
            <p className={`font-light ${"text-black"}`}>
              {isTyping
                ? "Typing..."
                : getSenderFull(user, selectedChat.users).email}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const Footer = ({
  user,
  selectedChat,
  messages,
  setMessages,
  socketConnected,
  typing,
  setTyping,
}) => {
  //Message Input
  const [message, setMessage] = useState("");

  const handleMessageSend = async (e) => {
    // e.preventDefault();
    // socket.emit("stop typing", selectedChat._id);
    if (!message) {
      return toast.error("Message Cannot Be Empty");
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        "https://talkspot-backend.onrender.com/api/message",
        {
          content: message,
          chatId: selectedChat._id,
        },
        config
      );

      console.log(data);
      setMessages([...messages, data]);
      setMessage("");
      socket.emit("new message", data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleKeyDown = (event) => {
    if (event.code.toLowerCase() === "enter") {
      console.log("Enter Key Pressed");
      handleMessageSend();
    }
  };

  return (
    <div className=" w-full bg-emerald-100 h-full items-center flex p-1 my-1">
      <input
        className="border outline-none h-full focus:border-emerald-700 placeholder:text-emerald-700 border-emerald-500 p-3 w-full"
        type="text"
        placeholder="Enter Message"
        value={message}
        onKeyDown={handleKeyDown}
        onChange={(e) => {
          setMessage(e.target.value);
          if (!socketConnected) {
            return;
          }
          if (!typing) {
            setTyping(true);
            socket.emit("typing", selectedChat._id);
          }
          let lastTypingTime = new Date().getTime();
          var timerLength = 3000;
          setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && typing) {
              socket.emit("stop typing", selectedChat._id);
              setTyping(false);
            }
          }, timerLength);
        }}
      />
      <div
        onClick={(e) => handleMessageSend(e)}
        className="flex items-center cursor-pointer border border-emerald-100"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6 text-emerald-700 "
        >
          <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
        </svg>
      </div>
    </div>
  );
};

const SingleChat = ({ setIsUpdateGroupChatModal }) => {
  const selectedChat = useSelector((state) => state?.user?.selectedChat);
  const user = useSelector((state) => state?.user?.currentUser);
  const dispatch = useDispatch();
  const [socketConnected, setSocketConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([]);

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `https://talkspot-backend.onrender.com/api/message/${selectedChat._id}`,
        config
      );

      setMessages(data);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => {
      setSocketConnected(true);
    });
    socket.on("typing", () => {
      setIsTyping(true);
    });
    socket.on("stop typing", () => {
      setIsTyping(false);
    });
  }, []);

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      console.log("New Msg Rcvd", newMessageReceived);
      if (
        !selectedChatCompare ||
        newMessageReceived.chat._id !== selectedChat._id
      ) {
        //Send Notification
        dispatch(addNotifications(newMessageReceived));
      } else if (newMessageReceived.chat._id === selectedChat._id) {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });

  return (
    <div className="bg-white overflow-hidden flex flex-col border relative p-2 rounded-md border-gray-700 h-full w-full">
      <Header
        setIsUpdateGroupChatModal={setIsUpdateGroupChatModal}
        selectedChat={selectedChat}
        user={user}
        isTyping={isTyping}
      />
      <ChatBox
        isTyping={isTyping}
        setIsTyping={setIsTyping}
        messages={messages}
      />
      <div className="w-full">
        <Footer
          typing={typing}
          setTyping={setTyping}
          selectedChat={selectedChat}
          socketConnected={socketConnected}
          messages={messages}
          setMessages={setMessages}
          user={user}
        />
      </div>
    </div>
  );
};

export default SingleChat;
