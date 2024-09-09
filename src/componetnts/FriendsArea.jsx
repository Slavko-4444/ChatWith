import React, { useEffect } from "react";
import "../css/FriendsArea.css";
import UserInfo from "./UserInfo";
import ActiveFriends from "./ActiveFriends";
import FriendsList from "./FriendsList";
import controlImg from "../control.png";
import { IoIosArrowDown } from "react-icons/io";
import { HiOutlineLogin } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

import {
  activefriendsListAtom,
  currentFriendAtom,
  friendsListAtom,
} from "../recoil/atoms/friendsAtoms";
import { useRecoilState, useRecoilValue } from "recoil";
import axios from "axios";
import LogOutModal from "./modals/LogOutModal";
import { IsOpenAtom, LogOutAtom } from "../recoil/atoms/customAtoms";

const FriendsArea = () => {
  const [open, setOpen] = useRecoilState(IsOpenAtom);
  const [currFriend, setCurrFriend] = useRecoilState(currentFriendAtom);
  const [friends, setFriends] = useRecoilState(friendsListAtom);
  const currentFriends = useRecoilValue(activefriendsListAtom);
  const [seeLogut, setSeeLogout] = useRecoilState(LogOutAtom);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("/api/api/chat-with/get-last-message");

        setFriends(response.data.friends);
        setCurrFriend({
          userName: response.data.friends[0].userName,
          email: response.data.friends[0].email,
          image: response.data.friends[0].image,
          _id: response.data.friends[0]._id,
        });
      } catch (error) {
        console.log(error.response.data.error.errorMessage);
      }
    }

    fetchData();
  }, []);
  const toggleModal = () => setSeeLogout(!seeLogut);
  return (
    <div
      className={`
      bg-dark-purple transition-[width, padding] h-screen  pt-4 duration-300
       absolute sm:relative 
      flex flex-col z-50
       ${open ? "sm:w-3/12 w-10/12 px-5" : "sm:w-28 w-0 px-0"}
    `}
    >
      <img
        src={controlImg}
        className={`absolute cursor-pointer sm:-right-3 sm:top-[calc(6rem-0.875rem)] sm:w-7 z-50 border-dark-purple
              border-2 rounded-full  ${!open && "rotate-180"}
              sm:visible invisible
           `}
        onClick={() => setOpen(!open)}
      />
      <UserInfo />
      <div
        className={`h-12 ${
          open ? "px-2" : "sm:hidden"
        }  transition-[padding] duration-300`}
      >
        <div>
          <label
            htmlFor="small-input"
            className="mb-2 transition duration-300 block text-sm font-medium text-gray-900 dark:text-white"
          ></label>
          <input
            type="text"
            id="small-input"
            className={`${
              open ? "p-2" : "p-0"
            } w-full text-gray-600 transition-[padding] duration-300 border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
            placeholder="Search"
          />
        </div>
      </div>
      <ActiveFriends actives={currentFriends} />

      <h1
        className={`origin-center transition duration-300 sm:text-3xl md:text-4xl  text-2xl font-bold ${
          !open && "scale-0 sm:hidden"
        } text-white text-center capitalize mt-2`}
      >
        All Friends
      </h1>
      <div
        className={`flex flex-col justify-center text-4xl text-white text-center my-2 ${
          open ? "hidden" : "invisible sm:visible delay-[225ms]"
        } mx-2`}
      >
        <span className="block">Fr</span>
        <div className="flex justify-center">
          <IoIosArrowDown size={"2rem"} />
        </div>
      </div>
      <FriendsList />
      <div
        className={` ${
          !open && "hidden sm:flex"
        } absolute z-[50] bottom-0 rounded-[10%] w-full h-16 left-0 right-0 bg-dark-purple flex justify-center items-center`}
      >
        <HiOutlineLogin
          className="text-white hover:size-11 hover:cursor-pointer"
          size={"2.3rem"}
          onClick={toggleModal}
        />
      </div>
    </div>
  );
};

export default FriendsArea;
