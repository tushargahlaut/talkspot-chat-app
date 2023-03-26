import { useEffect } from "react";
import axios from "axios";
import styles from "../../styles/Chats.module.css"
import { useDispatch, useSelector } from "react-redux";
import { addAllChats, setSelectedChat } from "../../redux/userSlice";
import { useRouter } from "next/router";
import { useState } from "react";
import GroupChatModal from "../../components/Modals/GroupChatModal";
import { getSender, getSenderFull } from "../../utils/chatLogic";
import SingleChat from "../../components/SingleChat";
import UpdateGroupChat from "../../components/Modals/UpdateGroupChat";

const UserList = ({ setIsGroupChatModal }) => {
  const userList = useSelector((state) => state?.user?.allChats);
  const user = useSelector((state)=>state?.user?.currentUser);
  const selectedChat = useSelector((state)=>state?.user?.selectedChat);
  const dispatch = useDispatch();
  const handleSelectChat = (data) => {
    dispatch(setSelectedChat(data));
  };

  return (
    <div className="bg-white border flex flex-col p-2 rounded-md border-gray-700 h-full w-full">
      <div onClick={()=>setIsGroupChatModal(prev => !prev)} className="border cursor-pointer mb-3 p-3 border-gray-400 bg-gray-200 rounded-md">
        <p>+ New Group Chat</p>
      </div>
      {userList?.map((e) => {

        return (
          <div
            key={e._id}
            onClick={() => handleSelectChat(e)}
            className={` ${
              e === selectedChat
                ? "rounded flex overflow-y-auto items-center cursor-pointer bg-blue-900 p-2 my-2 "
                : "rounded flex overflow-y-auto items-center cursor-pointer bg-blue-100 p-2 my-2"
            } `}
          >
            {!e.isGroupChat && <div>
              <img
                className="h-8 w-8  rounded-full"
                src={getSenderFull(user, e.users).pic}
              ></img>
            </div>}
            
            {e.isGroupChat ? (
              <div className="ml-3">
                <p
                  className={`font-semibold ${
                    e === selectedChat ? "text-white" : ""
                  }`}
                >
                  {e.chatName}
                </p>

              </div>
            ) : (
              <div className="ml-3">
                <p
                  className={`font-semibold ${
                    e === selectedChat ? "text-white" : ""
                  }`}
                >
                  {getSenderFull(user, e.users).name}
                </p>
                <p
                  className={`font-light ${
                    e === selectedChat ? "text-white" : ""
                  }`}
                >
                  {getSenderFull(user, e.users).email}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};


const Chats = () => {
    const [isGroupChatModal, setIsGroupChatModal] = useState(false);
    const [isUpdateGroupChatModal, setIsUpdateGroupChatModal] = useState(false);
    const user = useSelector((state)=>state?.user?.currentUser);
  const selectedChat = useSelector((state) => state?.user?.selectedChat);

    const isLogin = useSelector((state) => state?.user?.isLogin);
    const token = user?.token;
    const dispatch = useDispatch();
    const router = useRouter();
    useEffect(()=>{
      if(!user){
          router.push("/");
      }
        async function fetchChats(){
            const config = {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            };
            try {
              const res = await axios.get(
                "http://localhost:8080/api/chat",
                config
              );
              dispatch(addAllChats(res.data));
            } catch (error) {
              console.log(error);
            }
            
        }
        fetchChats();
    },[]);

    if(!isLogin){
      setTimeout(()=>{
        router.push("/");
      },1000);
      return(
        <div>
          Please Go to Home Page and Login
        </div>
      )
    }

    return (
      <div className={`${styles.chats}`}>
        <div className="flex h-full overflow-y-auto w-full p-3">
          <div className="flex-3 p-3">
            <UserList setIsGroupChatModal={setIsGroupChatModal} />
          </div>
          <div className="flex-1 p-3">
            {selectedChat && (
              <SingleChat
                setIsUpdateGroupChatModal={setIsUpdateGroupChatModal}
              />
            )}
          </div>
        </div>
        {isGroupChatModal && (
          <GroupChatModal setIsGroupChatModal={setIsGroupChatModal} />
        )}
        {isUpdateGroupChatModal && (
          <UpdateGroupChat
            setIsUpdateGroupChatModal={setIsUpdateGroupChatModal}
          />
        )}
      </div>
    );
}
 
export default Chats;