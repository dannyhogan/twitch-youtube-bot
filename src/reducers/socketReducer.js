const reducer = (state, action) => {
  console.log(state, action);
  switch (action.type) {
    case "SET_STREAMER":
      return { ...state, streamer: action.payload };
    case "INIT_SONG_REQUESTS":
      return { ...state, requests: [...action.payload, ...state.requests] };
    case "YOUTUBE_SONG_REQUEST":
      return { ...state, requests: [...state.requests, action.payload] };
    case "DELETE_SONG_REQUEST":
      return {
        ...state,
        requests: state.requests.filter(
          (request) => request.id !== action.payload
        ),
      };
    default:
      return state;
  }
};

export default reducer;
