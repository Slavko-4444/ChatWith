import React, { useEffect, useState } from "react";
import "../css/MessageContent.css";
import { currentFriendAtom } from "../recoil/atoms/friendsAtoms";
import { useRecoilValue } from "recoil";
import { PiEyeClosedDuotone } from "react-icons/pi";
import { PiEyeBold } from "react-icons/pi";

const Message = ({ type, text, status, date, scrollRef, image }) => {
  const [dt, time] = date.split("T");
  const [hours, minutes] = time.split(":");
  const [textPosition, setTextPosition] = useState();
  useEffect(() => {
    if (type === "sending") setTextPosition("message-text text-end");
    else setTextPosition("message-text");
  }, [type]);
  return (
    <div ref={scrollRef} className={`message ${type}`}>
      {image ? <img src={`/images/${image}`} className="h-80 w-96" /> : ""}
      <p className={textPosition}>{text}</p>
      <div className="message-info">
        {type === "sending" ? (
          <>
            {status && status === "unseen" ? (
              <PiEyeClosedDuotone className="size-5 text-slate-500 mr-2" />
            ) : (
              <PiEyeBold className="size-5 text-slate-500 mr-2" />
            )}
          </>
        ) : (
          ""
        )}

        <span className="message-date">
          {hours}:{minutes}
        </span>
      </div>
    </div>
  );
};
const MessageContent = ({ message, senderId, scrollRef, typingMessage }) => {
  const currFriend = useRecoilValue(currentFriendAtom);
  return (
    <div className="top-24 bottom-16  message-content">
      {message?.map((msg, index) => {
        let TYPE = msg.senderId !== senderId ? "coming" : "sending";

        return (
          <Message
            type={TYPE}
            text={msg.message.text}
            status={msg.status}
            date={msg.updatedAt}
            key={index}
            scrollRef={scrollRef}
            image={msg.message.image}
          />
        );
      })}
      {/* check this variable here */}
      {typingMessage &&
      typingMessage.cleanTypeDots === false &&
      typingMessage.senderId === currFriend._id ? (
        <div ref={scrollRef} className="text-gray-400 pl-3">
          {currFriend.userName.split(" ")[0]}'s typing...
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default MessageContent;
