import React, { useState, useEffect } from "react";
import "./VideoPlayer.scss";
import ReactPlayer from "react-player";
import {
  MdPlayCircleOutline,
  MdPauseCircleOutline,
  MdVolumeMute,
  MdVolumeUp,
} from "react-icons/md";
import { FaStepBackward, FaStepForward } from "react-icons/fa";
import moment from "moment";
import RequestList from "../RequestList/RequestList";
import { useSocketState } from "react-socket-io-hooks";

const defaultSong = {
  id: "1",
  user: "vezrolive",
  videoURL: "https://www.youtube.com/watch?v=W4ocPPhtglU",
  title: "Mac Miller - Come Back To Life",
  thumbnail: "https://i.ytimg.com/vi/0gzmFo8UiJQ/mqdefault.jpg",
  time: new Date(),
};

const VideoPlayer = ({
  activeSong = defaultSong,
  handleNextSong,
  handlePrevSong,
  prevClickable,
  nextClickable,
  activeIndex,
}) => {
  const ref = React.createRef();
  const [seeking, setSeeking] = useState(false);
  const [playing, togglePlaying] = useState(true);
  const [duration, setDuration] = useState(0);
  const [timePlayed, setTimePlayed] = useState(0);
  const [volume, setVolume] = useState(0.2);
  const { requests } = useSocketState();

  useEffect(() => {
    ref.current.seekTo(0);
  }, [activeSong]);

  const handleProgress = (videoProgress) => {
    if (!seeking) {
      setTimePlayed(parseFloat(parseInt(videoProgress.playedSeconds)));
    }
  };

  const handlePlayToggle = () => {
    togglePlaying((playing) => !playing);
  };

  const handlePlayerSeek = ({ target }) => {
    setTimePlayed(parseFloat(target.value));
    ref.current.seekTo(timePlayed);
  };

  const handlePlayerSeekMouseUp = () => {
    setSeeking(false);
  };

  const handlePlayerSeekMouseDown = () => {
    setSeeking(true);
  };

  const handleVolumeChange = ({ target }) => {
    setVolume(target.value);
  };

  const PauseButton = () => {
    return (
      <button onClick={() => handlePlayToggle()} className="PauseButton">
        <MdPauseCircleOutline />
      </button>
    );
  };

  const PlayButton = () => {
    return (
      <button onClick={() => handlePlayToggle()} className="PlayButton">
        <MdPlayCircleOutline />
      </button>
    );
  };

  const PrevSongButton = () => {
    return (
      <button
        className={`PrevSongButton ${prevClickable ? "enabled" : "disabled"}`}
        onClick={() => handlePrevSong()}
      >
        <FaStepBackward />
      </button>
    );
  };

  const NextSongButton = () => {
    return (
      <button
        className={`NextSongButton ${nextClickable ? "enabled" : "disabled"}`}
        onClick={() => handleNextSong()}
      >
        <FaStepForward />
      </button>
    );
  };

  const formattedDuration = moment("2015-01-01")
    .startOf("day")
    .seconds(duration)
    .format("mm:ss");

  const formattedTimePlayed = moment("2015-01-01")
    .startOf("day")
    .seconds(timePlayed)
    .format("mm:ss");

  return (
    <section className="VideoPlayer">
      <ReactPlayer
        ref={ref}
        className="Player"
        url={activeSong.videoURL}
        onDuration={setDuration}
        onChange={handlePlayerSeek}
        onProgress={handleProgress}
        value={timePlayed}
        volume={volume}
        playing={playing}
      ></ReactPlayer>

      <div className="SongContainer">
        <div className="Info">
          <h2>
            Current Video ({requests.length ? activeIndex + 1 : 0} /{" "}
            {requests.length}
            ):
          </h2>
          <p className="activesong-title">{activeSong.title}</p>
          <p className="activesong-user">Requested by {activeSong.user}</p>
        </div>

        <div className="PlayerControls">
          <div className="Slider">
            <p className="activesong-timeplayed">{formattedTimePlayed}</p>
            <input
              className="slider-input"
              type="range"
              onChange={handlePlayerSeek}
              max={duration}
              onMouseDown={handlePlayerSeekMouseDown}
              onMouseUp={handlePlayerSeekMouseUp}
              value={timePlayed}
            />
            <p className="activesong-duration">{formattedDuration}</p>
          </div>

          <div className="player-buttons">
            <PrevSongButton />
            {playing ? <PauseButton /> : <PlayButton />}
            <NextSongButton />
          </div>

          <div className="volume-control">
            <MdVolumeMute />
            <input
              className="volume-input"
              type="range"
              min="0"
              max="1"
              step="any"
              value={volume}
              onChange={handleVolumeChange}
            ></input>
            <MdVolumeUp />
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoPlayer;
