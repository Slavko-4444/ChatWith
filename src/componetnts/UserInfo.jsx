import React, { useEffect, useState } from "react";
import "../css/ActiveFriends.css";
import { GrUserSettings } from "react-icons/gr";
import { IoMdLogOut } from "react-icons/io";
import { useRecoilState } from "recoil";
import { userAtom } from "../recoil/atoms/userAtoms";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { duration } from "moment/moment";

const UserInfo = ({ open }) => {
  const [userInfo, setUserInfo] = useRecoilState(userAtom);

  useEffect(() => {
    if (!userInfo.token || !userInfo.token.length) {
      const tk = localStorage.getItem("authToken");
      const decoded = jwtDecode(tk);
      setUserInfo({
        ...userInfo,
        token: tk ? tk : "",
        userName: decoded.userName,
        id: decoded.id,
        email: decoded.email,
        image: `/images/${decoded.image}`,
      });
    }
  }, []);

  useEffect(() => {}, [userInfo, userInfo]);

  return (
    <div className="flex flex-col pt-1 mb-1">
      <img
        src={userInfo.image}
        className="self-center cursor-pointer friend-image border border-white"
        alt="photo"
      />
      <hr
        className={`my-2 ${open ? "invisible" : "visible delay-[225ms]"} mx-2`}
      />
      <h1
        className={`text-2xl origin-left  duration-200 ${
          !open && "hidden duration-500"
        } text-white text-center capitalize mt-2`}
      >
        {userInfo.userName}
      </h1>

      {/* <div className="text-2xl text-white  w-full flex justify-center items-center capitalize">
        {userInfo.userName}
      </div>
      <div className="flex flex-col justify-evenly w-12">
        <div className="h-[40%]  border rounded-[10%] bg-white flex hover:cursor-pointer justify-center items-center">
          <GrUserSettings className="text-slate-800 hover:text-lg transition-all" />
        </div>
        <div
          className="h-[40%]  border rounded-[10%] bg-white flex justify-center items-center hover:text-lg hover:cursor-pointer transition-all"
          onClick={toggleModal}
        >
          <IoMdLogOut className="text-slate-800" />
        </div>
      </div> */}
    </div>
  );
};

export default UserInfo;
