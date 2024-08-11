import React, { useEffect, useState } from "react";
import "../css/MessageContent.css";
import { currentFriendAtom } from "../recoil/atoms/friendsAtoms";
import { useRecoilValue } from "recoil";

const Message = ({ type, text, status, date, scrollRef }) => {
  const [dt, time] = date.split("T");
  const [hours, minutes] = time.split(":");
  return (
    <div ref={scrollRef} className={`message ${type}`}>
      <p className="message-text inline">{text}</p>
      <div className="message-info">
        {type === "sending" ? (
          <span className={`message-status ${status.toLowerCase()}`}>
            {status}
          </span>
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
