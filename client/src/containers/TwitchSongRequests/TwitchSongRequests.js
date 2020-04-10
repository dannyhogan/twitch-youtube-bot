import React, { useState, useEffect } from "react";
import "./TwitchSongRequests.scss";
import VideoPlayer from "../../components/VideoPlayer/VideoPlayer";
import RequestList from "../../components/RequestList/RequestList";
import TwitchChat from "../../components/TwitchChat/TwitchChat";
import { useSocketDispatch, useSocketState } from "react-socket-io-hooks";
import { useHistory } from "react-router-dom";

const TwitchSongRequests = () => {
  const dispatch = useSocketDispatch();
  const history = useHistory();
  const { streamer, requests } = useSocketState();
  const [prevClickable, setPrevClickable] = useState(false);
  const [nextClickable, setNextClickable] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (activeIndex !== 0 && requests[activeIndex - 1]) {
      setPrevClickable(true);
    } else {
      setPrevClickable(false);
    }

    if (requests[activeIndex + 1]) {
      setNextClickable(true);
    } else {
      setNextClickable(false);
    }

  }, [activeIndex, requests]);

  if (!streamer) {
    history.push("/");
  }

  const handleRequestItemPlay = (index) => {
    setActiveIndex(index);
  };

  const handleNextSong = () => {
    if (nextClickable) {
      setActiveIndex((index) => index + 1);
    }
  };

  const handlePrevSong = () => {
    if (prevClickable) {
      setActiveIndex((index) => index - 1);
    }
  };

  const handleDelete = (request) => {
    dispatch({ type: "DELETE_SONG_REQUEST", payload: request.id });
  };

  return (
    <section className="TwitchSongRequests">
      <VideoPlayer
        activeSong={requests[activeIndex]}
        handleNextSong={handleNextSong}
        handlePrevSong={handlePrevSong}
        nextClickable={nextClickable}
        prevClickable={prevClickable}
        activeIndex={activeIndex}
      />
      <RequestList
        handlePlay={handleRequestItemPlay}
        handleDelete={handleDelete}
      />
      <TwitchChat />
    </section>
  );
};

export default TwitchSongRequests;
