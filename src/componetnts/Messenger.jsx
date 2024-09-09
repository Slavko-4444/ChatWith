import React, { useEffect, useRef, useState } from "react";
import "../css/Messenger.css";
import FriendInfo from "./FriendInfo";
import FriendsArea from "./FriendsArea";
import ShortFriendInfo from "./ShortFriendInfo";
import MessageSend from "./MessageSend";
import MessageContent from "./MessageContent";
import controlImg from "../control.png";

import { useRecoilState, useRecoilValue } from "recoil";
import {
  activefriendsListAtom,
  currentFriendAtom,
  friendsListAtom,
} from "../recoil/atoms/friendsAtoms";
import { userAtom } from "../recoil/atoms/userAtoms";
import { io } from "socket.io-client";
import axios from "axios";
import { MessagesAtom } from "../recoil/atoms/messageAtoms";
import { jwtDecode } from "jwt-decode";
import {
  NotificationOfCommingMessageAtom,
  SelectedImageAtom,
} from "../recoil/atoms/notificationAtoms";
import sendingSound from "../audio/message-sending.mp3";
import receivingSound from "../audio/sending2.mp3";
import useSound from "use-sound";
import LogOutModal from "./modals/LogOutModal";
import { IsOpenAtom, LogOutAtom } from "../recoil/atoms/customAtoms";

const Messenger = () => {
  const scrollRef = useRef();
  const afSocket = useRef();
  const [typingMessage, setTypingMessage] = useState();
  const [imageToSend, setImageToSend] = useState();
  const decoded = jwtDecode(localStorage.getItem("authToken"));
  const [open, setOpen] = useRecoilState(IsOpenAtom);

  const currFriend = useRecoilValue(currentFriendAtom);
  const [currentFriends, setCurrentFrineds] = useRecoilState(
    activefriendsListAtom
  );
  const seeLogut = useRecoilValue(LogOutAtom);

  const [friends, setFriends] = useRecoilState(friendsListAtom);
  const [userData, setUserData] = useRecoilState(userAtom);
  const [message, setMessage] = useRecoilState(MessagesAtom);
  const [selectedImage, setSelectedImage] = useRecoilState(SelectedImageAtom);

  const [notificationMessage, setNotificationMessage] = useRecoilState(
    NotificationOfCommingMessageAtom
  );
  const [isChecked, setIsChecked] = useState(false);
  const [text, setText] = useState();
  const [socketMessage, setSocketMessage] = useState("");

  //sound instances...
  const [sendingSPlay] = useSound(sendingSound);
  const [receivingSPlay] = useSound(receivingSound);

  // take all messages of the current chat box...
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

      const currIsActive = currentFriends.some((friend) => {
        if (friend.id === currFriend._id) return true;
        return false;
      });

      // update notification for seen status of message...
      if (currIsActive) setSeen(currFriend._id, userData.id);

      setMessage(response.data.message);
    } catch (error) {
      console.log(error.response);
    }
  };

  function updateMessageStatusToSeen(senderId, newStatus) {
    setFriends((prevFriends) =>
      prevFriends.map((friend) => {
        if (friend.msgInfo && friend.msgInfo.senderId === senderId) {
          return {
            ...friend,
            msgInfo: {
              ...friend.msgInfo,
              status: newStatus,
            },
          };
        }
        return friend;
      })
    );
  }

  // update last message info in friends list...
  function updateMessageInFriendList(msgInfo) {
    setFriends((prevFriends) =>
      prevFriends.map((friend) => {
        if (
          friend._id === msgInfo.senderId ||
          friend._id === msgInfo.receiverId
        ) {
          return {
            ...friend,
            msgInfo: msgInfo,
          };
        }
        return friend;
      })
    );
  }

  function setSeen(senderId, receiverId) {
    afSocket.current.emit("seenMessage", {
      receiverId: receiverId,
      senderId: senderId,
      status: "seen",
    });
  }

  useEffect(() => {
    if (!userData.id)
      setUserData({
        id: decoded.id,
        email: decoded.email,
        userName: decoded.userName,
        image: `/images/${decoded.image}`,
      });

    afSocket.current = io("http://localhost:5000");
    afSocket.current.on("getMessage", (data) => {
      setSocketMessage(data);
    });
  }, []);

  useEffect(() => {
    afSocket.current.on("updateMessageStatus", (data) => {
      updateMessageStatusToSeen(data.senderId, data.status);
    });
  }, []);

  useEffect(() => {
    afSocket.current.on("typingMessageGet", (data) => {
      if (data.cleanTypeDots === true) setTypingMessage({});
      else setTypingMessage(data);
    });
  }, []);

  useEffect(() => {
    // this is for last message notification on side bar...
    updateMessageInFriendList(socketMessage);

    if (socketMessage && currFriend) {
      if (
        socketMessage.senderId === currFriend._id &&
        socketMessage.receiverId === userData.id
      ) {
        // setting last received message into live chat box
        setMessage([...message, socketMessage]);
        receivingSPlay();
        setSeen(socketMessage.senderId, userData.id);
      } else if (
        socketMessage.senderId !== currFriend._id &&
        socketMessage.receiverId === userData.id
      ) {
        setSocketMessage("");
        setNotificationMessage([...notificationMessage, socketMessage]);
      }
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
    if (currFriend._id) {
      getMessage();
      setImageToSend(null);
    }
  }, [currFriend]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({
      block: "end",
      inline: "nearest",
    });
  }, [message]);

  const handleCheck = () => {
    setIsChecked(!isChecked);
  };

  // sending text...
  const sendMessage = async () => {
    sendingSPlay();
    let newImageName;
    if (imageToSend) newImageName = Date.now() + imageToSend.name;

    const formData = new FormData();
    formData.append("senderName", userData.userName);
    formData.append("imageName", newImageName);
    formData.append("receiverId", currFriend._id);
    formData.append("image", imageToSend);
    if (text) formData.append("text", text);

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    try {
      const response = await axios.post(
        "/api/api/chat-with/send-message-full",
        formData,
        config
      );
      const socketdata = { receiverId: currFriend._id, senderId: userData.id };

      afSocket?.current.emit("typingMessage", {
        ...socketdata,
        msg: "",
        cleanTypeDots: true,
      });

      const currTime = new Date();
      afSocket.current.emit("sendMessage", {
        senderId: userData.id,
        senderName: userData.userName,
        receiverId: currFriend._id,
        time: currTime,
        message: {
          text: text,
          image: newImageName,
        },
      });

      updateMessageInFriendList({
        senderId: userData.id,
        senderName: userData.userName,
        receiverId: currFriend._id,
        time: currTime,
        status: "unseen",
        message: {
          text: text,
          image: newImageName,
        },
      });

      getMessage();
      setText("");
      setImageToSend(null);
    } catch (error) {
      console.log(error.response);
    }
  };

  const closeModal = () => {
    setSelectedImage({
      createdAt: null,
      image: null,
      messageId: null,
      senderId: null,
      senderName: null,
    });
  };
  return (
    <div className="h-full w-full flex relative overflow-hidden">
      {/* left sidebar */}
      <FriendsArea />

      {/* loging out modal */}
      {seeLogut && <LogOutModal />}

      {/* button trigger for sidebar */}
      <img
        src={controlImg}
        alt="da vidimo"
        className={`absolute cursor-pointer z-50 border-dark-purple
          border-2 rounded-full  ${!open && "rotate-180"}
          sm:invisible visible w-12 
          duration-300 transition-[left]
          top-9
          
       `}
        onClick={() => setOpen(!open)}
        style={{
          left: open ? "calc(83.33% - 24px)" : "-1.3rem",
        }}
      />

      {/* shadow div for small screen when our left sidebar is open */}
      <div
        className={`${
          open ? "visible sm:invisible" : "invisible"
        } absolute z-40 inset-0 bg-black bg-opacity-50 shadow-lg`}
        onClick={() => setOpen(!open)}
      ></div>
      {/* shadow div for small screen when our right sidebar is open */}
      <div
        className={`${
          isChecked ? "visible lg:invisible" : "invisible"
        } absolute z-[50] inset-0 bg-black bg-opacity-50 shadow-lg`}
        onClick={() => setIsChecked(!isChecked)}
      ></div>

      {/* message content */}
      <div className="h-screen flex flex-1">
        <input
          type="checkbox"
          id="dot"
          className="hidden"
          onChange={handleCheck}
        />

        <div className="w-full z-10 message-box relative">
          <ShortFriendInfo />
          <MessageContent
            message={message}
            senderId={userData.id}
            scrollRef={scrollRef}
            socket={afSocket.current}
            typingMessage={typingMessage}
          />

          <MessageSend
            text={text}
            setText={setText}
            sendMessage={sendMessage}
            socket={afSocket.current}
            socketdata={{ receiverId: currFriend._id, senderId: userData.id }}
            imageToSend={imageToSend}
            setImageToSend={setImageToSend}
          />
        </div>
      </div>

      {/* right side bar for friend-info */}
      <div
        className={`${
          isChecked ? "lg:w-[25vw]" : "lg:w-0"
        } lg:duration-500 lg:relative lg:visible invisible`}
      ></div>

      <div
        className={`${
          isChecked && "lg:-translate-x-[25vw] lg:border-l -translate-x-[83vw]"
        } transform transition-transform duration-500 bg-white lg:-right-[25vw] z-[55] ease-in-out absolute lg:w-[25vw] w-[83vw] h-full -right-[83vw]`}
      >
        <FriendInfo />
      </div>

      {/* modal for images pop-up */}
      {selectedImage.image && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
          onClick={closeModal} // Close modal when clicking outside the image
          style={{ zIndex: 1000 }}
        >
          <div className="relative">
            <img
              src={"/images/" + selectedImage.image}
              className="object-contain max-h-[95vh] max-w-[95vw] rounded-2xl"
              alt="Full View"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className="absolute top-2 right-2 text-white text-3xl font-bold"
              onClick={closeModal} // Close modal on button click
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messenger;
