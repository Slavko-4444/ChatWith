import React from "react";
import "../css/ActiveFriends.css";
import { useRecoilState, useRecoilValue } from "recoil";
import { currentFriendAtom } from "../recoil/atoms/friendsAtoms";
import { userAtom } from "../recoil/atoms/userAtoms";

const ActiveFriends = ({ actives }) => {
  const [currFriend, setCurrFriend] = useRecoilState(currentFriendAtom);
  const userData = useRecoilValue(userAtom);

  const handleCurrentUser = (usr) => {
    // we cannot chat with ourselves
    if (usr.id !== userData.id) {
      const imageName = usr.userData.image.split("/").pop();
      setCurrFriend({
        _id: usr.id,
        image: imageName,
        email: usr.userData.email,
        userName: usr.userData.userName,
      });
    }
  };
  return (
    <div className="friend-active-list gap-1 px-2">
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
