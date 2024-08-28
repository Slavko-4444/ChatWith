import React, { useEffect, useState } from "react";
import "../css/FriendInfo.css";
import { useRecoilValue } from "recoil";
import {
  activefriendsListAtom,
  currentFriendAtom,
} from "../recoil/atoms/friendsAtoms";
import { useBeforeUnload } from "react-router-dom";

const ImagesData = () => {
  return (
    <div className="data-show m-4 h-auto  rounded overflow-y-auto grid grid-cols-1 xl:grid-cols-2">
      <div className="h-40 border">1</div>
      <div className="h-40 border">1</div>
      <div className="h-40 border">1</div>
      <div className="h-40 border">1</div>
      <div className="h-40 border">1</div>
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
