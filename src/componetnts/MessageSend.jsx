import React, { useEffect, useState } from "react";
import "../css/MessageSend.css";
import { FaRegImage } from "react-icons/fa6";
import { GoGift } from "react-icons/go";
import { FaRegPaperPlane } from "react-icons/fa";
import { BsEmojiWink } from "react-icons/bs";
import { SiLiberadotchat } from "react-icons/si";
import { TbPhotoQuestion } from "react-icons/tb";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { init } from "emoji-mart";
import { validateImage } from "image-validator";
import { toast } from "react-toastify";

init({ data });

const MessageSend = ({
  text,
  setText,
  sendMessage,
  socket,
  socketdata,
  setImageToSend,
  imageToSend,
}) => {
  const [subimtClass, SetSubmitClass] = useState("send-letter");
  const [trackImageState, setTrackImageState] = useState("hidden");
  const [showPicker, setShowPicker] = useState(false);

  const handleSelect = (emoji) => {
    if (text) setText(text + emoji.native);
    else setText(emoji.native);
  };
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

  const updateImage = async (e) => {
    if (e.target.files.length !== 0)
      fileValidation(e.target.files[0]).then((res) => {
        if (res) setImageToSend(e.target.files[0]);
        else toast.error("Forwarded file is not image (or it's corrupted)!");
      });
  };

  const handleSubmit = () => {
    if ((text && text.length) || imageToSend) {
      setShowPicker(false);
      setTrackImageState("hidden");
      setTimeout(() => SetSubmitClass("send-letter"), 400);
      SetSubmitClass("send-letter send-letter-v2");
      sendMessage();
    }
  };

  const handleTracking = () => {
    if (trackImageState !== "hidden") {
      setImageToSend(null);
      setTrackImageState("hidden");
    }
  };

  const fileValidation = async (file) => {
    const isValidImage = await validateImage(file);
    return isValidImage;
    // expected output ==> true or false
  };

  useEffect(() => {
    if (imageToSend)
      setTrackImageState(
        "absolute -top-52 z-10 left-1/2 transform -translate-x-1/2 inline-flex justify-center hover:cursor-pointer items-center rounded-full bg-red-400 p-4 animate-pop-up"
      );
  }, [imageToSend]);
  return (
    <div className="absolute bottom-0 h-16 bg-slate-50 border-y message-send px-5 grid items-center grid-row grid-cols-12">
      <div className={trackImageState} onClick={handleTracking}>
        <TbPhotoQuestion className="text-white text-4xl" />
      </div>

      <div className="col-span-2 flex">
        <div className="send-item">
          <input
            onChange={updateImage}
            type="file"
            id="pic"
            className="form-control hidden"
          />
          <label htmlFor="pic" className="hover:cursor-pointer">
            {" "}
            <FaRegImage size={16} />{" "}
          </label>
        </div>
        <div className="send-item">
          <GoGift size={16} />
        </div>
        <div className="send-item">
          <BsEmojiWink size={16} onClick={() => setShowPicker(!showPicker)} />
          <div className="z-10 absolute bottom-16">
            {showPicker && <Picker data={data} onEmojiSelect={handleSelect} />}
          </div>
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
