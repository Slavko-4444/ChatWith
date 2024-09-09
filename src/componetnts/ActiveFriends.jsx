import React from "react";
import "../css/ActiveFriends.css";
import { useRecoilState, useRecoilValue } from "recoil";
import { currentFriendAtom } from "../recoil/atoms/friendsAtoms";
import { userAtom } from "../recoil/atoms/userAtoms";
import { IsOpenAtom } from "../recoil/atoms/customAtoms";

const ActiveFriends = ({ actives }) => {
  const [open, setOpen] = useRecoilState(IsOpenAtom);
  const [currFriend, setCurrFriend] = useRecoilState(currentFriendAtom);
  const userData = useRecoilValue(userAtom);

  const handleCurrentUser = (usr) => {
    // we cannot chat with ourselves
    if (usr.id !== userData.id) {
      const imageName = usr.userData.image.split("/").pop();
      setOpen(false);
      setCurrFriend({
        _id: usr.id,
        image: imageName,
        email: usr.userData.email,
        userName: usr.userData.userName,
      });
    }
  };
  return (
    <div
      className={`${!open && "p-0 px-0 mb-2"}
      ${!open && actives && actives.length === 1 && "flex justify-center"}
       origin-left duration-300 friend-active-list gap-1 p-2 mx-1`}
    >
      {actives && actives.length ? (
        actives.map((active, index) => (
          <div
            className="relative flex-shrink-0 hover:cursor-pointer"
            onClick={() => handleCurrentUser(active)}
            key={index}
          >
            <img
              src={active.userData.image}
              className="friend-image"
              alt="opa"
            />
            <div className="online-status"></div>
          </div>
        ))
      ) : (
        <p className="text-pretty text-xl">You are alone :O </p>
      )}
    </div>
  );
};

export default ActiveFriends;
