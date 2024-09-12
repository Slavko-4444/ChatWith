import React, { useEffect, useRef, useState } from "react";
import "../css/MessageSend.css";
import { FaRegImage } from "react-icons/fa6";
import { FaRegPaperPlane } from "react-icons/fa";
import { BsEmojiWink } from "react-icons/bs";
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
  const [trackImageState, setTrackImageState] = useState("hidden");
  const [showPicker, setShowPicker] = useState(false);
  const textareaRef = useRef(null);
  const [onFocus, setOnFocus] = useState(false);
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

  // event listener for focusing on input area...
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === "k") {
        event.preventDefault();
        textareaRef.current.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Checks is the enter key pressed...
  const handleKeyDown = (event) => {
    if (event.key === "Enter" && event.ctrlKey) {
      event.preventDefault();
      let newText = "\n";
      if (text && text.length) newText = text + "\n";
      setText(newText);
    } else if (event.key === "Enter" && !event.ctrlKey && !event.shiftKey) {
      // Trigger form submit on Enter (without Ctrl or Shift)
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="absolute flex bottom-0 h-16 bg-slate-50 border-y message-send pr-5 items-center">
      {/* button animation */}
      <div className={trackImageState} onClick={handleTracking}>
        <TbPhotoQuestion className="text-white text-4xl" />
      </div>

      {/* div buttons */}
      <div className="flex w-28">
        {/* 1. image button div */}
        <div className="send-item w-11 h-10 rounded-[50%] m-1">
          <input
            onChange={updateImage}
            type="file"
            id="pic"
            className="hidden"
          />
          <label htmlFor="pic" className="hover:cursor-pointer">
            {" "}
            <FaRegImage size={16} />{" "}
          </label>
        </div>

        {/* 2. emojis button div */}
        <div className="m-1">
          <div
            className="send-item w-11 h-10 rounded-[50%]"
            onClick={() =>
              setTimeout(() => {
                setShowPicker(!showPicker);
              })
            }
          >
            <BsEmojiWink size={16} />
          </div>
          <div className="z-10 absolute bottom-[4.2rem] left-1">
            {showPicker && (
              <Picker
                data={data}
                onEmojiSelect={handleSelect}
                theme={"light"}
                onClickOutside={() => setShowPicker(false)}
              />
            )}
          </div>
        </div>
      </div>

      {/* input part for writing the message */}
      <div className="mx-1 flex-1">
        <label className="relative block">
          <span className="absolute inset-y-0 left-0 md:flex items-center pl-2 hidden">
            {/* <SiLiberadotchat size={15} color="gray" /> */}
            <kbd className="px-1 py-1 text-xs font-semibold text-white bg-gray-300 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
              Ctrl
            </kbd>
            <span className="text-gray-300">+</span>
            <kbd className="px-1 py-1 text-xs font-semibold text-white bg-gray-300 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
              K
            </kbd>
          </span>
          <textarea
            ref={textareaRef}
            className="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-xl py-2 pl-3 md:pl-20 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm resize-none overflow-hidden"
            placeholder="Text me..."
            name="search"
            rows="1"
            style={{ maxHeight: "3rem" }}
            value={text}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
          ></textarea>
        </label>
      </div>

      {/* sending message button */}
      <div
        className="send-letter hidden md:flex items-center justify-center"
        onClick={handleSubmit}
      >
        <FaRegPaperPlane size={21} />
      </div>
    </div>
  );
};

export default MessageSend;
