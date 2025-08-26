const http = require("http");
const fs = require("fs");
const path = require("path");

// Chuck Norris API
const API_URL = "https://api.chucknorris.io/jokes/random";

// Node.js has fetch built-in (>= v18), no need for axios
async function getJoke() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    return data.value; // joke string
  } catch (err) {
    return "Error fetching joke 🤕";
  }
}

const server = http.createServer(async (req, res) => {
  if (req.url === "/" || req.url === "/index.html") {
    // Serve frontend
    fs.readFile(path.join(__dirname, "index.html"), (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end("Error loading index.html");
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
      }
    });
  } else if (req.url === "/style.css") {
    // Serve CSS
    fs.readFile(path.join(__dirname, "style.css"), (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end("Error loading CSS");
      } else {
        res.writeHead(200, { "Content-Type": "text/css" });
        res.end(data);
      }
    });
  } else if (req.url === "/api/joke") {
    // Serve joke from external API
    const joke = await getJoke();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ joke }));
  } else {
    res.writeHead(404);
    res.end("Not Found");
  }
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
