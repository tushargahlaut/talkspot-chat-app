import { useState } from "react";
import { useSelector } from "react-redux";

const Notifications = ({ setIsNotifications }) => {
    const notif = useSelector((state) => state?.user?.notifications);

  return (
    <div
      onClick={() => setIsNotifications((prev) => !prev)}
      className="flex cursor-pointer ml-4 relative"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-7 h-7"
      >
        <path
          fillRule="evenodd"
          d="M5.25 9a6.75 6.75 0 0113.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 11-7.48 0 24.585 24.585 0 01-4.831-1.244.75.75 0 01-.298-1.205A8.217 8.217 0 005.25 9.75V9zm4.502 8.9a2.25 2.25 0 104.496 0 25.057 25.057 0 01-4.496 0z"
          clipRule="evenodd"
        />
      </svg>
      {notif.length > 0 && (
        <p className="bg-red-600 absolute left-3 text-center text-xs h-4 w-4 text-white rounded-full">
          {notif.length}
        </p>
      )}
    </div>
  );
};

const Navbar = ({ setIsSearch,setIsLogout, setIsNotifications }) => {
  const user = useSelector((state) => state.user.currentUser);
 
  
  return (
    <div className="flex items-center py-2 px-4">
      <div
        onClick={() => {
          setIsSearch((prev) => !prev);
        }}
        className="flex-1 cursor-pointer pl-8"
      >
        <div className=" flex ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          <p className="hidden md:block">SEARCH</p>
        </div>
      </div>
      <h1 className="flex-1 text-2xl text-slate-900 text-center">TalkSpot</h1>

      <div className="flex-1 justify-center items-center  flex">
        {user && (
          <>
            <div
              onClick={() => setIsLogout((prev) => !prev)}
              className="flex cursor-pointer"
            >
              <img
                className="h-8 w-8  rounded-full"
                src={user ? user.pic : ""}
              />
              <p className="ml-3 mr-4 hidden md:block">{user ? user.name : ""}</p>
            </div>
            <Notifications setIsNotifications={setIsNotifications} />
          </>
        )}
      </div>
    </div>
  );
};
 
export default Navbar;