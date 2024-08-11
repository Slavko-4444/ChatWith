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

const FriendBlock = ({ friend }) => {
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
      className="p-2 border-y h-24 firend-element flex items-center hover:bg-slate-300 hover:cursor-pointer "
      onClick={toggleMessageContent}
    >
      <img
        src={"/images/" + friend.image}
        className="friend-image f-i"
        alt="opa"
      />
      <p className="ml-3 font-semibold lg:text-xl text-sm capitalize flex">
        {friend.userName}
        {hasUnreadMessage ? (
          <HiOutlineChatBubbleOvalLeftEllipsis
            className="ml-1"
            color="green"
            size={24}
          />
        ) : (
          ""
        )}
      </p>
    </div>
  );
};

const FriendsList = () => {
  const friends = useRecoilValue(friendsListAtom);
  return (
    <div className="mt-2 friend-list-all flex-1 overflow-y-auto">
      {friends.length ? (
        friends.map((friend, index) => (
          <FriendBlock friend={friend} key={index} />
        ))
      ) : (
        <p className="text-sm md:text-3xl p-2">No friends found</p>
      )}
    </div>
  );
};

export default FriendsList;
