import React, { useEffect, useState } from "react";
import "../css/ActiveFriends.css";
import { GrUserSettings } from "react-icons/gr";
import { IoMdLogOut } from "react-icons/io";
import { useRecoilState } from "recoil";
import { userAtom } from "../recoil/atoms/userAtoms";
import { jwtDecode } from "jwt-decode";
import LogOutModal from "./modals/LogOutModal";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { duration } from "moment/moment";

const UserInfo = ({ open }) => {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useRecoilState(userAtom);
  const [seeLogut, setSeeLogout] = useState(false);

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

  const toggleModal = () => setSeeLogout(!seeLogut);

  const handleLogout = () => {
    setUserInfo({ token: "" });
    localStorage.removeItem("authToken");
    Cookies.remove("authToken");
    navigate("/login");
    toast.success("See you!");
  };

  return (
    <div className="flex flex-col pt-1 mb-1">
      {seeLogut ? (
        <LogOutModal
          toggleModal={toggleModal}
          seeLogut={seeLogut}
          handleLogout={handleLogout}
        />
      ) : (
        ""
      )}
      <img
        src={userInfo.image}
        className="self-center cursor-pointer friend-image border border-white"
        alt="photo"
      />
      <hr className={`my-2 ${open ? "invisible" : "visible delay-[225ms]"}`} />
      <div
        className={`text-2xl origin-left duration-200 ${
          !open && "scale-0"
        } text-white text-center capitalize mt-2`}
      >
        {userInfo.userName}
      </div>

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
