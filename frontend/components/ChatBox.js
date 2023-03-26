import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

const ChatBox = ({messages,isTyping,setIsTyping}) => {
    const user = useSelector((state)=>state?.user?.currentUser);

  

    function truncateName(name){
        const index = name.indexOf(" ");
        if(index>-1){
            name = name.slice(0,index) + "...";
        }
        return name;
    }

    const chatBoxRef = useRef(null);


    useEffect(()=>{
        chatBoxRef.current.scrollIntoView({behavior:"smooth"})
    },[messages]);

    return (
      <div className="h-full p-1 pr-2 overflow-auto flex flex-col w-full my-1">
        {messages.map((e) => (
          <div
            className={`flex my-1 flex-col ${
              e.sender._id === user._id
                ? "justify-end items-end"
                : "justify-start items-start"
            } `}
            key={e._id}
          >
            <div
              className={`flex justify-end w-1/2 ${
                e.sender._id === user._id ? "" : "flex-row-reverse"
              } items-end`}
            >
              <div className="flex flex-col">
                <p className={`italic text-xs`}>
                  {truncateName(e.sender.name)}
                </p>
                <div
                  className={`border-none p-2 w-auto ${
                    e.sender._id === user._id ? "bg-blue-700" : "bg-blue-100"
                  }  rounded-md`}
                >
                  <p className={`${e.sender._id === user._id && "text-white"}`}>
                    {e.content}
                  </p>
                </div>
              </div>
              {e.sender._id !== user._id && (
                <>
                  <img
                    className="w-6 object-center object-cover mx-1 h-6 rounded-full"
                    src={e?.sender?.pic}
                    alt="pfp"
                  />
                </>
              )}
            </div>
          </div>
        ))}
        <div ref={chatBoxRef} />
      </div>
    );
}
 
export default ChatBox;
