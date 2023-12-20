import axios from "./axiosCache.js";
import readline from "readline";

const serverUrl = "http://localhost:3000"; // Update with your server's URL

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function sendRequest() {
  rl.question(
    "Enter the path and query parameters (e.g., /endpoint?param1=value1): ",
    async (input) => {
      console.log(input, "input");
      try {
        const response = await axios.get(serverUrl + input);

        // calling axios as a function will also work
        // const response = await axios({
        //     method: 'get',
        //     url: serverUrl + input,
        //   })

        console.log("Response:", response.data);
      } catch (error) {
        console.error("Error:", error.message);
      }

      rl.question(
        "Do you want to send another request? (yes/no): ",
        (answer) => {
          if (answer.toLowerCase() === "yes") {
            sendRequest();
          } else {
            rl.close();
          }
        },
      );
    },
  );
}

sendRequest();
