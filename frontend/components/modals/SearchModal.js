import { useRef, useState } from "react";
import styles from "../../styles/SearchModal.module.css";
import { toast } from "react-toastify";
import axios from "axios";
import Loader from "../LoaderAnim";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedChat } from "../../Redux/userSlice";

const UserSingle = ({ data }) => {
  const user = useSelector((state) => state.user.currentUser);
  const userId = data._id;
  const dispatch = useDispatch();

  const accessChat = async () => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `https://talkspot-backend.onrender.com/api/chat`,
        { userId },
        config
      );
      console.log("Data Create Chat", data);
      dispatch(setSelectedChat(data));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      onClick={accessChat}
      className="flex border cursor-pointer my-3 border-gray-600 rounded-md items-center p-3"
    >
      <div className="w-1/5">
        <img src={data.pic} className="h-8 w-8  rounded-full" alt="pfp" />
      </div>
      <div className="flex w-4/5 ml-2 flex-col">
        <p className="font-bold text-gray-900">{data.name}</p>
        <p className="text-gray-600 break-words">{data.email}</p>
      </div>
    </div>
  );
};

const SearchModal = ({ setIsSearch }) => {
  const user = useSelector((state) => state?.user?.currentUser);
  const token = user?.token;
  const inputRef = useRef(null);
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const handleSubmitClick = async (e) => {
    e.preventDefault();
    console.log("Search Input", inputRef?.current?.value);
    if (!inputRef?.current?.value) {
      toast.error("Please Enter Something");
    }
    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const res1 = await axios.get(
        `https://talkspot-backend.onrender.com/api/user?search=${inputRef?.current?.value}`,
        config
      );
      console.log("Search Res1", res1);
      setLoading(false);
      setSearchResult(res1?.data);
    } catch (error) {
      setLoading(false);
      console.log("Error Occured", error);
    }
  };

  return (
    <div className={styles.SearchModal}>
      <div className="h-full p-4 flex flex-col w-full md:w-1/5 bg-white">
        <div className="flex w-full justify-between">
          <p>SEARCH USERS</p>
          <div
            onClick={() => {
              setIsSearch((prev) => !prev);
            }}
            className="justify-end cursor-pointer"
          >
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>
        <div className="h-0.5 mt-2 bg-gray-700"></div>
        <div className="flex my-4">
          <input
            type="text"
            className="border-2 p-1 w-4/5 border-blue-200 .focus:border-blue-500 rounded-md"
            ref={inputRef}
          />
          <div
            onClick={handleSubmitClick}
            className="bg-blue-200 cursor-pointer w-1/5 rounded-md ml-2 p-2 "
          >
            <p className="text-center">Go</p>
          </div>
        </div>
        {loading && <Loader />}
        <div className="overflow-y-auto">
          {searchResult &&
            searchResult?.map((e) => {
              return <UserSingle key={e._id} data={e} />;
            })}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
