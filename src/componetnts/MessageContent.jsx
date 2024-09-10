import React, { useEffect, useState } from "react";
import "../css/MessageContent.css";
import { currentFriendAtom } from "../recoil/atoms/friendsAtoms";
import { useRecoilState, useRecoilValue } from "recoil";
import { VscEyeClosed } from "react-icons/vsc";
import { PiEyeBold } from "react-icons/pi";
import { SelectedImageAtom } from "../recoil/atoms/notificationAtoms";

const Message = ({
  type,
  text,
  status,
  date,
  scrollRef,
  image,
  messageId,
  senderId,
  senderName,
}) => {
  const [dt, time] = date.split("T");
  const [hours, minutes] = time.split(":");
  const [textPosition, setTextPosition] = useState();
  const [selectedImage, setSelectedImage] = useRecoilState(SelectedImageAtom);

  useEffect(() => {
    if (type === "sending") setTextPosition("message-text text-end");
    else setTextPosition("message-text");
  }, [type]);

  const handleImageClick = () => {
    setSelectedImage({
      createdAt: date,
      image: image,
      senderId: senderId,
      senderName: senderName,
    });
  };
  console.log("first", messageId, image, status);
  return (
    <div ref={scrollRef} className={`message ${type} max-w-[90%]`}>
      {image ? (
        <img
          src={`/images/${image}`}
          className="max-h-80 w-full h-auto  max-w-96 2xl:max-w-[26rem] 2xl:max-h-96 object-contain hover:cursor-pointer rounded"
          onClick={handleImageClick}
        />
      ) : (
        ""
      )}
      <p className={textPosition}>{text}</p>
      <div className="message-info">
        {type === "sending" ? (
          <>
            {status && status === "unseen" ? (
              <VscEyeClosed className="size-5 text-slate-500 mr-2" />
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
  const [isWordAdded, setIsWordAdded] = useState(false);

  useEffect(() => {
    if (
      typingMessage &&
      typingMessage.cleanTypeDots === false &&
      typingMessage.senderId === currFriend._id
    ) {
      if (!isWordAdded) {
        setIsWordAdded(true);
        scrollRef.current?.scrollIntoView({
          block: "end",
          inline: "nearest",
        });
      }
    } else setIsWordAdded(false);
  }, [typingMessage]);

  return (
    <div className="top-24 bottom-16  message-content">
      {message?.map((msg, index) => {
        let TYPE = msg.senderId !== senderId ? "coming" : "sending";
        return (
          <Message
            type={TYPE}
            text={msg.message.text}
            status={msg.status}
            date={msg.createdAt}
            key={index}
            scrollRef={scrollRef}
            image={msg.message.image}
            messageId={msg._id}
            senderId={msg.senderId}
            senderName={msg.senderName}
          />
        );
      })}
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
