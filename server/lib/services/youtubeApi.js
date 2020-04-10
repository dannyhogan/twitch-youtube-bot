const axios = require("axios");

const getVideoDetails = (url) => {
  const getYoutubeVideoID = (url) => {
    url = url.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    return url[2] !== undefined ? url[2].split(/[^0-9a-z_\-]/i)[0] : url[0];
  };

  const videoID = getYoutubeVideoID(url);

  return axios
    .get(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoID}&key=${process.env.API_KEY}`,
      {
        mode: "cors",
      }
    )
    .then(res => {
      if (!res.data.items[0]) throw "Could not find YoutTube video.";
      return res.data.items[0];
    })
    .then(youtubeData => ({
      title: youtubeData.snippet.title,
      thumbnail: youtubeData.snippet.thumbnails.medium.url,
    }))
};

module.exports = getVideoDetails;
