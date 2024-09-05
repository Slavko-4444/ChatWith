import React, { useEffect } from "react";
import "../css/FriendsArea.css";
import UserInfo from "./UserInfo";
import ActiveFriends from "./ActiveFriends";
import FriendsList from "./FriendsList";
import controlImg from "../control.png";

import {
  activefriendsListAtom,
  currentFriendAtom,
  friendsListAtom,
} from "../recoil/atoms/friendsAtoms";
import { useRecoilState, useRecoilValue } from "recoil";
import axios from "axios";

const FriendsArea = ({ open, setOpen }) => {
  const [currFriend, setCurrFriend] = useRecoilState(currentFriendAtom);
  const [friends, setFriends] = useRecoilState(friendsListAtom);
  const currentFriends = useRecoilValue(activefriendsListAtom);

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

  return (
    <div
      className={`
      bg-dark-purple transition-[width] h-screen  pt-4 duration-300
       absolute sm:relative 
      flex flex-col z-50
       ${open ? "sm:w-3/12 w-10/12 px-5" : "sm:w-28 w-0"}
    `}
    >
      <img
        src={controlImg}
        className={`absolute cursor-pointer sm:-right-3 sm:top-9 sm:w-7 z-50 border-dark-purple
              border-2 rounded-full  ${!open && "rotate-180"}
              sm:visible invisible
           `}
        onClick={() => setOpen(!open)}
      />
      <UserInfo open={open} />

      <div className={`h-12 px-2 ${open ? "visible" : "hidden"}`}>
        <div>
          <label
            htmlFor="small-input"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          ></label>
          <input
            type="text"
            id="small-input"
            className="w-full p-2 text-gray-600 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search"
          />
        </div>
      </div>
      <ActiveFriends actives={currentFriends} open={open} />
      {/* 
      <FriendsList /> */}
    </div>
  );
};

export default FriendsArea;
