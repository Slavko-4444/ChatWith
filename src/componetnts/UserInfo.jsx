import React, { useEffect } from "react";
import "../css/ActiveFriends.css";
import { useRecoilState } from "recoil";
import { userAtom } from "../recoil/atoms/userAtoms";
import { jwtDecode } from "jwt-decode";

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
    </div>
  );
};

export default UserInfo;
