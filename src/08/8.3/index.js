const red = "\x1b[31m";
const green = "\x1b[32m";
const yellow = "\x1b[33m";
const reset = "\x1b[0m";

function decorateConsole(console) {
  console.red = (message) => console.log(`${red}%s${reset}`, message);
  console.green = (message) => console.log(`${green}%s${reset}`, message);
  console.yellow = (message) => console.log(`${yellow}%s${reset}`, message);
}

decorateConsole(console);

console.red("hello world");
console.green("hello world");
console.yellow("hello world");
