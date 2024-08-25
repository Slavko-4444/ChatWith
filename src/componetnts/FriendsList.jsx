import React, { useEffect, useState } from "react";
import "../css/ActiveFriends.css";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  currentFriendAtom,
  friendsListAtom,
} from "../recoil/atoms/friendsAtoms";
import { HiOutlineChatBubbleOvalLeftEllipsis } from "react-icons/hi2";
import { NotificationOfCommingMessageAtom } from "../recoil/atoms/notificationAtoms";
import useSound from "use-sound";
import notificationSound from "../audio/notification.mp3";
import { FiCheck } from "react-icons/fi";

const FriendBlock = ({ friend, msgInfo }) => {
  const [notificationMessage, setNotificationMessage] = useRecoilState(
    NotificationOfCommingMessageAtom
  );
  const [currFriend, setCurrFriend] = useRecoilState(currentFriendAtom);
  const [hasUnreadMessage, setHasUnreadMessage] = useState(false);
  const [notificationSPlay] = useSound(notificationSound);

  useEffect(() => {
    if (
      notificationMessage.length &&
      notificationMessage.some((item, index) => item.senderId === friend._id) &&
      currFriend._id !== friend._id
    ) {
      notificationSPlay();
      setHasUnreadMessage(true);
    } else setHasUnreadMessage(false);
  }, [notificationMessage]);

  const toggleMessageContent = () => {
    setCurrFriend({
      userName: friend.userName,
      email: friend.email,
      image: friend.image,
      _id: friend._id,
    });

    if (hasUnreadMessage) {
      let copyList = notificationMessage.filter(
        (item) => item.senderId !== friend._id
      );
      setNotificationMessage(copyList);
    }
  };

  return (
    <div
      className="group p-2 border-y h-24 firend-element flex items-center hover:bg-slate-300 hover:cursor-pointer "
      onClick={toggleMessageContent}
    >
      <img
        src={"/images/" + friend.image}
        className="friend-image f-i"
        alt="opa"
      />
      <div className="flex ml-3 flex-col">
        <p className="font-semibold lg:text-xl text-sm capitalize flex">
          {friend.userName}
          {!hasUnreadMessage ? (
            <HiOutlineChatBubbleOvalLeftEllipsis
              className="ml-1"
              color="green"
              size={24}
            />
          ) : (
            ""
          )}
        </p>
        {msgInfo ? (
          <p className="text-pink-200 group-hover:text-slate-600 flex items-center">
            {msgInfo.senderId === friend._id
              ? msgInfo.senderName + ": "
              : "You: "}
            {msgInfo.message.text}
            <FiCheck className="ml-1 text-slate-700" size={"1.3rem"} />
            <FiCheck className=" text-slate-700" size={"1.3rem"} />
          </p>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

const FriendsList = () => {
  const friends = useRecoilValue(friendsListAtom);
  const msgInfo = {
    message: {
      text: "cao",
      image: "",
    },
    _id: "66be09e9498c4fc1e4c781d5",
    senderId: "66a1568f228fb31ade6777bf",
    senderName: "slavko sosic",
    receiverId: "66a1570e228fb31ade6777c3",
    status: "unseen",
  };

  return (
    <div className="mt-2 friend-list-all flex-1 overflow-y-auto">
      {friends.length ? (
        friends.map((friend, index) => (
          <FriendBlock friend={friend} key={index} msgInfo={friend.msgInfo} />
        ))
      ) : (
        <p className="text-sm md:text-3xl p-2">No friends found</p>
      )}
    </div>
  );
};

export default FriendsList;
