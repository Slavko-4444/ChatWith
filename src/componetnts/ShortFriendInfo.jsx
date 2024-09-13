import React from "react";
import { BsChatDots } from "react-icons/bs";
import { HiVideoCamera } from "react-icons/hi";
import { IoMdCall } from "react-icons/io";
import "../css/ShortFriendInfo.css";
import { useRecoilValue } from "recoil";
import { currentFriendAtom } from "../recoil/atoms/friendsAtoms";

const ShortFriendInfo = () => {
  const currFriend = useRecoilValue(currentFriendAtom);

  return (
    <div className="absolute flex justify-between items-center top-0 h-24 border border-l-0 px-5 top-message">
      {/* // <div className="absolute flex justify-between items-center top-0 right-0 w-full border border-black"> */}
      <div className="flex items-center ">
        <img
          src={import.meta.env.VITE_REACT_APP_API_URL_STATIC + currFriend.image}
          className="chat-member-img chat"
          alt="photo"
        />
        <p className="text-2xl capitalize">{currFriend.userName}</p>
      </div>
      <div className="flex flex-row-reverse ">
        <div className="fancy-chat-icon">
          <label htmlFor="dot" className="inline-flex">
            <BsChatDots size={22} />
          </label>
        </div>
        <div className="fancy-chat-icon">
          <HiVideoCamera size={22} />
        </div>
        <div className="fancy-chat-icon">
          <IoMdCall size={22} />
        </div>
      </div>
    </div>
  );
};

export default ShortFriendInfo;
