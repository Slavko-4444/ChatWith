import React, { useEffect } from "react";
import "../css/ActiveFriends.css";
import { useRecoilState, useRecoilValue } from "recoil";
import { userAtom } from "../recoil/atoms/userAtoms";
import { jwtDecode } from "jwt-decode";
import { IsOpenAtom } from "../recoil/atoms/customAtoms";

const UserInfo = () => {
  const open = useRecoilValue(IsOpenAtom);

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
        image: decoded.image,
      });
    }
  }, []);

  useEffect(() => {}, [userInfo, userInfo]);

  return (
    <div
      className={`${
        !open && "scale-0 sm:scale-100"
      } origin-left duration-300 flex flex-col pt-1 mb-1`}
    >
      <img
        src={import.meta.env.VITE_REACT_APP_API_URL_STATIC + userInfo.image}
        className="self-center cursor-pointer friend-image border border-white"
        alt="photo"
      />
      <hr
        className={`my-2 ${open ? "invisible" : "visible delay-[225ms]"} mx-2`}
      />
      <h1
        className={`text-2xl origin-center duration-300 ${
          !open && "scale-0 sm:hidden"
        } text-white text-center capitalize mt-2`}
      >
        {userInfo.userName}
      </h1>
    </div>
  );
};

export default UserInfo;
