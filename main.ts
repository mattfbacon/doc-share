import express = require("express");
import path = require("path");
import socketio = require("socket.io");
import http = require("http");
import dmp_mod = require("diff-match-patch");

const app = express();
const server = http.createServer(app);
const io = new socketio.Server(server);
const dmp = new dmp_mod.diff_match_patch();

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

server.listen(3000, () => {
	console.log("listening on port 3000");
});
