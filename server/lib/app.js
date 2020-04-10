require("dotenv").config();
const path = require("path");
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const tmi = require("tmi.js");
const { v4 } = require("uuid");
const getVideoDetails = require("./services/youtubeApi");
const port = process.env.PORT || 8080;

console.log("PORTTTTT FROM ENV", port);

app.use(express.static(path.join(__dirname, "../../build")));
app.get("/", (req, res, next) => res.sendFile(__dirname + "./index.html"));

const handleChatConnection = (channel, socket) => {
  const options = {
    options: {
      debug: false,
    },
    connection: {
      cluster: "aws",
      reconnect: true,
    },
    identity: {
      username: "TwitchYouTubeBot",
      password: `oauth:${process.env.OAUTH}`,
    },
    channels: [channel],
  };

  const chatClient = new tmi.client(options);

  chatClient.connect().then(() => {
    chatClient.say(channel, "YouTube song request bot connected!");
  });

  chatClient.on("chat", (chatChannel, chatUser, chatMessage) => {
    const channel = chatChannel.replace("#", "");
    const user = chatUser.username;

    handleSongRequest(socket, chatMessage, user, chatClient, channel);
  });

  socket.on("disconnect", () => {
    chatClient.disconnect().then(console.log("tmi bot disconnected"));
    console.log("Client disconnected");
  });
};

const handleSongRequest = (socket, message, user, chatClient, channel) => {
  if (
    message.includes("!request") &&
    message.split(" ")[1].includes("www.youtube.com/watch?v=")
  ) {
    const videoURL = message.split(" ")[1];

    getVideoDetails(videoURL)
      .then((youtubeData) => {
        socket.emit("YOUTUBE_SONG_REQUEST", {
          id: v4(),
          user,
          videoURL,
          title: youtubeData.title,
          thumbnail: youtubeData.thumbnail,
          time: new Date(),
        });

        chatClient.say(
          channel,
          `@${user}: Your request has been added to the queue!`
        );
      })
      .catch((err) => {
        chatClient.say(channel, `@${user}: Unable to find Youtube video.`);
      });
  }
};

io.on("connection", (socket) => {
  socket.on("STREAMER", (channel) => {
    handleChatConnection(channel, socket);
  });
});

server.listen(port, () => {
  console.log("Server started on port: ", port);
});
