import React, { useEffect, useRef, useState } from "react";
import "../css/Messenger.css";
import FriendInfo from "./FriendInfo";
import FriendsArea from "./FriendsArea";
import ShortFriendInfo from "./ShortFriendInfo";
import MessageSend from "./MessageSend";
import MessageContent from "./MessageContent";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  activefriendsListAtom,
  currentFriendAtom,
} from "../recoil/atoms/friendsAtoms";
import { userAtom } from "../recoil/atoms/userAtoms";
import { io } from "socket.io-client";

import axios from "axios";
import { MessagesAtom } from "../recoil/atoms/messageAtoms";
import { jwtDecode } from "jwt-decode";

const Messenger = () => {
  const scrollRef = useRef();
  const afSocket = useRef();
  const decoded = jwtDecode(localStorage.getItem("authToken"));

  const currFriend = useRecoilValue(currentFriendAtom);
  const [currentFriends, setCurrentFrineds] = useRecoilState(
    activefriendsListAtom
  );
  const [userData, setUserData] = useRecoilState(userAtom);
  const [message, setMessage] = useRecoilState(MessagesAtom);
  const [isChecked, setIsChecked] = useState(false);
  const [text, setText] = useState("");
  const [socketMessage, setSocketMessage] = useState("");

  const getMessage = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      let data = { status: "seen" };
      const response = await axios.put(
        `/api/api/chat-with/get-messages/${currFriend._id}`,
        data,
        config
      );
      setMessage(response.data.message);
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    if (!userData.id)
      setUserData({
        id: decoded.id,
        email: decoded.email,
        userName: decoded.userName,
        image: `/images/${decoded.image}`,
      });

    afSocket.current = io("ws://localhost:8000");

    afSocket.current.on("getMessage", (data) => {
      setSocketMessage(data);
    });
  }, []);

  useEffect(() => {
    if (socketMessage && currFriend)
      if (
        socketMessage.senderId === currFriend._id &&
        socketMessage.receiverId === userData.id
      ) {
        setMessage([...message, socketMessage]);
        setSocketMessage("");
      }
  }, [socketMessage]);

  useEffect(() => {}, [message]);

  useEffect(() => {
    const userInfo = {
      id: decoded.id,
      email: decoded.email,
      userName: decoded.userName,
      image: `/images/${decoded.image}`,
    };
    afSocket.current.emit("addUser", userInfo);
  }, []);

  useEffect(() => {
    afSocket.current.on("getActives", (data) => {
      setCurrentFrineds(data);
    });
    afSocket.current.on("getUser", (data) => {
      setCurrentFrineds(data);
    });
  }, []);

  useEffect(() => {
    afSocket.current.on("getActives", (data) => {
      setCurrentFrineds(data);
    });
  }, []);

  useEffect(() => {
    getMessage();
  }, [currFriend]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  }, [message]);

  const getClass = () => {
    return isChecked
      ? "absolute h-full top-0 pi border-l"
      : "absolute h-full top-0 right-0 w-4/12  pi border-l";
  };

  const handleCheck = () => {
    setIsChecked(!isChecked);
  };

  const sendMessage = async () => {
    const messageBlock = {
      senderName: userData.userName,
      receiverId: currFriend._id,
      message: text,
    };
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await axios.post(
        "/api/api/chat-with/send-message",
        messageBlock,
        config
      );
      afSocket.current.emit("sendMessage", {
        senderId: userData.id,
        senderName: userData.userName,
        receiverId: currFriend._id,
        time: new Date(),
        message: {
          text: text,
          image: "",
        },
      });

      getMessage();
      setText("");
    } catch (error) {
      console.log(error.response);
    }
  };

  return (
    <div className="h-screen w-full flex box-conent">
      <div className="w-3/12 bg-white-800">
        <FriendsArea />
      </div>
      <div className="w-9/12 flex main-side">
        <input
          type="checkbox"
          id="dot"
          className="hidden"
          onChange={handleCheck}
        />

        <div className="w-4/6 z-10 message-box">
          <ShortFriendInfo />
          <MessageContent
            message={message}
            senderId={userData.id}
            scrollRef={scrollRef}
          />
          <MessageSend
            text={text}
            setText={setText}
            sendMessage={sendMessage}
          />
        </div>

        <div className={getClass()}>
          <FriendInfo />
        </div>
      </div>
    </div>
  );
};

export default Messenger;
