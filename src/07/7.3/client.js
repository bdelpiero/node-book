import { request } from "http";

const message = "Message from client";
const postData = JSON.stringify(message);

const options = {
    hostname: "localhost",
    port: 3000,
    path: "/",
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
};

const req = request(options, res => {
    let responseData = "";

    res.on("data", chunk => {
        responseData += chunk;
    });

    res.on("end", () => {
        console.log("Response from server:");
        console.log(responseData);
    });
});

req.on("error", error => {
    console.error("Error sending the request:", error);
});

req.write(postData);
req.end();
