import { createLazyBuffer } from "./createLazyBuffer.js";

const hello = "Hello";
const lazyBuffer = createLazyBuffer(hello.length);

console.log("Before initialization");
console.log(String.fromCharCode(lazyBuffer.readInt8(0)));
lazyBuffer.write(hello);
console.log("After initialization");
console.log(String.fromCharCode(lazyBuffer.readInt8(0)));
