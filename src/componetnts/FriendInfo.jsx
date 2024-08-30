import React, { useEffect, useState } from "react";
import "../css/FriendInfo.css";
import { useRecoilValue } from "recoil";
import {
  activefriendsListAtom,
  currentFriendAtom,
} from "../recoil/atoms/friendsAtoms";
import axios from "axios";
import { MessagesAtom } from "../recoil/atoms/messageAtoms";

const ImagesData = () => {
  const currFriend = useRecoilValue(currentFriendAtom);
  const [chatImages, setChatImages] = useState([]);
  const messages = useRecoilValue(MessagesAtom);

  const processMessage = (message) => {
    // Destructure the input message
    const {
      message: msgContent,
      _id,
      senderId,
      senderName,
      createdAt,
      __v,
    } = message;

    const outputMessage = {
      messageId: _id,
      image: msgContent.image,
      senderId: senderId,
      senderName: senderName,
      createdAt: createdAt,
    };

    return outputMessage;
  };
  useEffect(() => {
    (async () => {
      // try {
      //   const response = await axios.get(
      //     `/api/api/chat-with/get-images/${currFriend._id}`
      //   );
      //   if (response.data) setChatImages(response.data.message);
      // } catch (error) {
      //   console.log("something went wrong...", error);
      // }
      setChatImages(
        messages.filter((msg) => msg.message.image).map(processMessage)
      );
    })();
  }, [messages]);
  useEffect(() => console.log(chatImages), [chatImages]);
  return (
    <div className="data-show m-4 h-auto  rounded overflow-y-auto grid grid-cols-1 xl:grid-cols-2">
      {chatImages.map((imgData) => (
        <div className="">
          <img
            src={"/images/" + imgData.image}
            className="object-fill h-48 w-full rounded-2xl p-1"
            alt="opa"
          />
        </div>
      ))}
    </div>
  );
};

const LinksData = () => {
  return <div className="m-4 h-auto rounded">Links</div>;
};

const ChatData = () => {
  return <div>Chat data</div>;
};

const FriendInfo = () => {
  const [clickItems, setClickItems] = useState({
    images: true,
    links: false,
    chatInfo: false,
  });

  const currFriend = useRecoilValue(currentFriendAtom);
  const activeFriends = useRecoilValue(activefriendsListAtom);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (currFriend && activeFriends.length)
      if (activeFriends.some((frnd, index) => frnd.id === currFriend._id))
        setIsActive(true);
      else setIsActive(false);
  }, [activeFriends, currFriend]);

  const onClickItmeEvent = (msg) => {
    let newItems = {
      images: false,
      links: false,
      chatInfo: false,
    };
    newItems[msg] = true;
    setClickItems(newItems);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="relative h-96 w-full overflow-hidden image-friend">
        <img
          src={"/images/" + currFriend.image}
          className="absolute inset-0 w-full h-full object-cover"
          alt="image-profile"
        />
      </div>
      <div className="m-4 p-1 border border-x-0 h-14  transition-all">
        <p className="text-center text-xl capitalize">{currFriend.userName}</p>
        <p
          className={
            isActive === true
              ? "text-center text-green-600 font-semibold"
              : "text-center text-black font-semibold"
          }
        >
          {isActive === true ? "Active" : "Ofline"}
        </p>
      </div>
      <div className="p-2 m-4 h-28 xl:h-14  grid grid-row grid-cols-1 xl:grid-cols-3 gap-4">
        <div
          className="border flex justify-center items-center rounded-3xl bg-slate-100 text-gray font-semibold hover:cursor-pointer hover:bg-slate-200"
          onClick={() => onClickItmeEvent("images")}
        >
          # images
        </div>
        <div
          className="border flex justify-center items-center rounded-3xl bg-slate-100 text-gray font-semibold hover:cursor-pointer hover:bg-slate-200"
          onClick={() => onClickItmeEvent("links")}
        >
          # links
        </div>
        <div
          className="border flex justify-center items-center rounded-3xl bg-slate-100 text-gray font-semibold hover:cursor-pointer hover:bg-slate-200"
          onClick={() => onClickItmeEvent("chatInfo")}
        >
          <p># chat info</p>
        </div>
      </div>
      {clickItems.images ? <ImagesData /> : ""}
      {clickItems.links ? <LinksData /> : ""}
      {clickItems.chatInfo ? <ChatData /> : ""}
    </div>
  );
};

export default FriendInfo;
