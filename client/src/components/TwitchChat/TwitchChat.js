import React, { useState, useEffect } from "react";
import { useSocketState } from "react-socket-io-hooks";
import "./TwitchChat.scss";
import { IoMdChatboxes } from "react-icons/io";

const TwitchChat = () => {
  const { streamer } = useSocketState();
  const [isOpen, toggleOpen] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      toggleOpen((open) => !open);
    }, 1500);
    
  }, []);

  const handleClick = () => {
    toggleOpen((open) => !open);
  };

  return (
    <div className={`TwitchChat ${isOpen ? "open" : "closed"}`}>
      <div className="chat-instructions">
        <p>
          Users in your chat can request YouTube videos by typing the following
          command:
        </p>

        <p>
          <span> !request https://www.youtube.com/watch?v=dQw4w9WgXcQ </span>
        </p>
      </div>
      <iframe
        id="chat-iframe"
        frameborder="0"
        scrolling="no"
        src={`https://www.twitch.tv/embed/${streamer}/chat?parent=streamernews.example.com`}
      ></iframe>
      <button className="toggle-button" onClick={handleClick}>
        <IoMdChatboxes />
      </button>
    </div>
  );
};

export default TwitchChat;
