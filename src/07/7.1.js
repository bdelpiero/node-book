const red = "\x1b[31m";
const green = "\x1b[32m";
const blue = "\x1b[34m";
const reset = "\x1b[0m";

class ColorConsole {
  constructor() {
    this.reset = reset;
  }
  log(str) {}
}

class RedConsole extends ColorConsole {
  log(str) {
    console.log(`${red}%s${this.reset}`, str);
  }
}

class GreenConsole extends ColorConsole {
  log(str) {
    console.log(`${green}%s${this.reset}`, str);
  }
}

class BlueConsole extends ColorConsole {
  log(str) {
    console.log(`${blue}%s${this.reset}`, str);
  }
}

function createColorConsole(color) {
  if (!color) {
    throw new Error("Please specify a color");
  }

  switch (color) {
    case "red":
      return new RedConsole();
    case "blue":
      return new BlueConsole();
    case "green":
      return new GreenConsole();
    default:
      throw new Error("Color not implemented");
  }
}

function main() {
  try {
    const color = process.argv[2];
    const colorConsole = createColorConsole(color);
    colorConsole.log("First line");
    colorConsole.log("Second line");
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
}

main();
