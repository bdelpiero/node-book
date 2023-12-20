import http from "node:http";
import { URL } from "url";

class RequestBuilder {
  setMethod(method) {
    this.method = method;
    return this;
  }

  setURL(urlString, query = "") {
    const url = new URL(urlString);
    this.hostname = url.hostname;
    this.port = url.port;
    this.path = query ? url.pathname + `?${query}` : url.pathname;
    return this;
  }

  setHeaders(headers) {
    this.headers = headers;
    return this;
  }

  setBody(body) {
    this.body = JSON.stringify(body);
    return this;
  }

  invoke() {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: this.hostname,
        port: this.port,
        path: this.path,
        method: this.method,
        headers: this.headers,
      };

      const req = http.request(options, (res) => {
        let received = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => {
          received += chunk;
        });
        res.on("end", () => {
          resolve(`Received data: ${received}`);
        });
      });

      req.on("error", (e) => {
        reject(`problem with request: ${e.message}`);
      });

      // Write data to request body
      this.body && req.write(this.body);
      req.end();
    });
  }
}

function main() {
  const request = new RequestBuilder()
    .setURL("https://jsonplaceholder.typicode.com/posts")
    .setMethod("post")
    .setHeaders({
      "Content-type": "application/json; charset=UTF-8",
    })
    .setBody({
      title: "foo",
      body: "bar",
      userId: 1,
    });

  request.invoke().then(console.log).catch(console.error);
}

main();
