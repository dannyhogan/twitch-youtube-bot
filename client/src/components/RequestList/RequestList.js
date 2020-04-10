import React, { useEffect } from "react";
import "./RequestList.scss";
import { useSocketState, useSocketDispatch } from "react-socket-io-hooks";
import { FaRegPlayCircle } from "react-icons/fa";
import { AiOutlineDelete } from "react-icons/ai";
import moment from "moment";

const RequestList = ({ handlePlay, handleDelete }) => {
  const { requests } = useSocketState();

  const requestItems = requests.map((request, i) => {
    return (
      <li key={i}>
        <a href={request.videoURL} target="_blank">
          <img src={request.thumbnail} />
        </a>
        <p className="request-title">{request.title}</p>
        <div className="request-data">
          <p className="request-user">{request.user}</p>
          <p className="request-time">{moment().calendar()}</p>
        </div>
        <button className="li-play-button" onClick={() => handlePlay(i)}>
          <FaRegPlayCircle />
        </button>
        <button
          className="li-delete-button"
          onClick={() => handleDelete(request)}
        >
          <AiOutlineDelete />
        </button>
      </li>
    );
  });

  return (
    <div className="RequestList">
      <h2>Song Request Queue</h2>
      {requestItems.length ? (
        <ul className="requests-list">{requestItems}</ul>
      ) : (
        <div className="no-requests">
          <h2 className="no-requests-header">No Video Requests</h2>
        </div>
      )}
    </div>
  );
};

export default RequestList;
