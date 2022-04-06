const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const path = require("path");
const dmp = new (require("diff-match-patch"))();

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "/index.html"));
});

app.use("/res", express.static("res"));

var text = "test";

io.on("connection", (socket) => {
	console.log("connection");
	socket.emit("init", text);
	socket.on("change", (diff) => {
		text = dmp.patch_apply(dmp.patch_make(diff), text)[0];
		socket.broadcast.emit("change", diff);
	});
	socket.on("disconnect", () => {
		console.log("disconnection");
	});
});

http.listen(3000, () => {
	console.log("listening on port 3000");
});
