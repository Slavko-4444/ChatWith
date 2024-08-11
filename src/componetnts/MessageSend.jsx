import React, { useState } from "react";
import "../css/MessageSend.css";
import { FaRegImage } from "react-icons/fa6";
import { GoGift } from "react-icons/go";
import { FaRegPaperPlane } from "react-icons/fa";
import { BsEmojiWink } from "react-icons/bs";
import { SiLiberadotchat } from "react-icons/si";

const MessageSend = ({ text, setText, sendMessage, socket, socketdata }) => {
  const [subimtClass, SetSubmitClass] = useState("send-letter");

  const handleInput = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
    setText(e.target.value);

    if (socket)
      socket?.emit("typingMessage", {
        ...socketdata,
        msg: e.target.value,
        cleanTypeDots: e.target.value.length ? false : true,
      });
  };
  const handleSubmit = () => {
    if (text.length) {
      setTimeout(() => SetSubmitClass("send-letter"), 400);
      SetSubmitClass("send-letter send-letter-v2");
      sendMessage();
    }
  };
  return (
    <div className="absolute bottom-0 h-16 bg-slate-50 border-y message-send px-5 grid items-center grid-row grid-cols-12">
      <div className="col-span-2 flex">
        <div className="send-item">
          <FaRegImage size={16} />
        </div>
        <div className="send-item">
          <GoGift size={16} />
        </div>
        <div className="send-item">
          <BsEmojiWink size={16} />
        </div>
      </div>
      <div className="col-span-9 ">
        <label className="relative block">
          <span className="absolute inset-y-0 left-0 flex items-center pl-2">
            <SiLiberadotchat size={15} color="gray" />
          </span>

          <textarea
            className="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-xl py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm resize-none overflow-hidden"
            placeholder="Text me..."
            name="search"
            rows="1"
            style={{ maxHeight: "3rem" }}
            value={text}
            onInput={handleInput}
          ></textarea>
        </label>
      </div>

      <div className={subimtClass} onClick={handleSubmit}>
        <FaRegPaperPlane size={21} />
      </div>
    </div>
  );
};

export default MessageSend;
