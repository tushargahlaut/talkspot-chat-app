import { useState } from "react";
import Navbar from "./navbar";
import SearchModal from "./Modals/SearchModal";
import LogoutBox from "./Modals/LogoutBox";
import Notifications from "./Modals/Notifications";


export default function Layout({ children }) {
  const [isSearch,setIsSearch] = useState(false);
  const [isLogout,setIsLogout] = useState(false);
  const [isNotifications,setIsNotifications] = useState(false);

  return (
    <div className="overflow-hidden">
      <Navbar
        setIsLogout={setIsLogout}
        setIsNotifications={setIsNotifications}
        setIsSearch={setIsSearch}
      />
      {isSearch && <SearchModal setIsSearch={setIsSearch} />}
      {isLogout && <LogoutBox setIsLogout={setIsLogout} />}
      {isNotifications && (
        <Notifications setIsNotifications={setIsNotifications} />
      )}
      <main>{children}</main>
    </div>
  );
}
