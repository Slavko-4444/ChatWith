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
import { IsOpenAtom } from "../recoil/atoms/customAtoms";

const FriendBlock = ({ friend, msgInfo }) => {
  const [open, setOpen] = useRecoilState(IsOpenAtom);
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
    setOpen(false);
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

  function summarizeString(str) {
    const words = str.trim().split(/\s+/);

    if (words.length <= 3 && str.length <= 25) return str;

    if (words.length > 3) return words.slice(0, 3).join(" ") + "...";

    if (str.length > 25) return str.slice(0, 15) + "...";

    return str;
  }

  return (
    <div className="group flex flex-col hover:cursor-pointer my-2 hover:bg-slate-50/[.08] rounded">
      <div
        className={` ${
          !open && "flex justify-center"
        } group p-2 h-min-24  firend-element flex items-center`}
        onClick={toggleMessageContent}
      >
        <img
          src={"/images/" + friend.image}
          className="friend-image f-i"
          alt="opa"
        />
        <div
          className={`${
            !open && "hidden"
          } flex ml-3 flex-col transition delay-500`}
        >
          <p className="font-semibold lg:text-xl text-sm text-teal-100 capitalize flex">
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
          {msgInfo ? (
            <div
              className={`${
                !open && "hidden"
              } text-slate-400 transition delay-500 group-hover:text-slate-200 flex items-center sm:flex-col md:flex-col md:text-base lg:flex-row`}
            >
              {msgInfo.senderId === friend._id
                ? msgInfo.senderName.split(" ")[0] + ": "
                : "You: "}
              {msgInfo.message.text ? (
                summarizeString(msgInfo.message.text)
              ) : msgInfo.message.image ? (
                <i> image</i>
              ) : (
                ""
              )}
              {msgInfo.senderId != friend._id ? (
                <div className="flex">
                  <FiCheck
                    className={`${
                      msgInfo && msgInfo.status === "seen"
                        ? "ml-1 text-green-600 group-hover:text-green-300"
                        : "ml-1 text-slate-400 group-hover:text-slate-300"
                    }`}
                    size={"1.3rem"}
                  />
                  <FiCheck
                    className={`${
                      msgInfo && msgInfo.status === "seen"
                        ? "text-green-600 group-hover:text-green-300"
                        : "text-slate-400 group-hover:text-slate-300"
                    }`}
                    size={"1.3rem"}
                    style={{ marginLeft: "-0.8rem" }}
                  />
                </div>
              ) : (
                ""
              )}
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
      <hr className="group-hover:hidden border-light-white mx-[20%]" />
    </div>
  );
};

const FriendsList = () => {
  const friends = useRecoilValue(friendsListAtom);

  return (
    <div className="mt-5 friend-list-all flex-1 overflow-y-auto">
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
