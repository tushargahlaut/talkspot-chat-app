import { useDispatch } from "react-redux";
import { logout } from "../../Redux/userSlice";
import styles from "../../styles/LogoutBox.module.css";

const LogoutBox = ({ setIsLogout }) => {
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
    setIsLogout(false);
  };
  return (
    <div className={styles.LogoutBox}>
      <div className="bg-white flex flex-col justify-center items-center w-full  h-1/2 md:w-1/2">
        <div
          onClick={() => setIsLogout((prev) => !prev)}
          className="mb-6 cursor-pointer"
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
        <p
          className="my-2 text-xl"
          onClick={() => setIsLogout((prev) => !prev)}
        >
          Do You Want to Log Out?
        </p>
        <div className="w-full flex flex-col items-center justify-center">
          <div
            onClick={handleLogout}
            className="w-1/3 h-10 flex justify-center cursor-pointer rounded-sm m-4 items-center bg-cyan-700"
          >
            <p className="text-center text-white">YES</p>
          </div>
          <div
            onClick={() => setIsLogout((prev) => !prev)}
            className="w-1/3 h-10 flex justify-center m-4 rounded-sm cursor-pointer items-center bg-cyan-700"
          >
            <p className="text-center text-white">NO</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutBox;
