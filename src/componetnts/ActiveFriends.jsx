import React from "react";
import "../css/ActiveFriends.css";

const ActiveFriends = ({ actives }) => {
  return (
    <div className="friend-active-list gap-1 px-2">
      {actives && actives.length ? (
        actives.map((active, index) => (
          <div className="relative flex-shrink-0" key={index}>
            <img
              src={active.userData.image}
              className="friend-image"
              alt="opa"
            />
            <div className="online-status"></div>
          </div>
        ))
      ) : (
        <p className="text-pretty text-xl">You are alone :O </p>
      )}
    </div>
  );
};

export default ActiveFriends;
