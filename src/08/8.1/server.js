import http from "http";

const server = http.createServer((req, res) => {
    console.log("Request URL: ", req.url);
    console.log("Request Headers: ", req.headers);

    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Req url " + req.url);
});

const port = 3000;
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
