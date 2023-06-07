import { EventEmitter } from "events";

const ticker = (numMilliseconds: number, cb: CPSCallBack) => {
    const emitter = new EventEmitter();

    const recur = (timeLeft = numMilliseconds, ticks = 0) => {
        // exercise 3.4
        if (Date.now() % 5 == 0) {
            const err = new Error(`timestamp is divisible by 5`);
            process.nextTick(() => emitter.emit("error", err));
            return cb(err, ticks);
        }

        // exercise 3.3
        if ((ticks == 0)) {
            ticks++
            process.nextTick(() => emitter.emit("tick"));
        }

        if (timeLeft <= 0) {
            return cb(null, ticks);
        }

        setTimeout(() => {
            emitter.emit("tick");
            recur(timeLeft - 50, ticks + 1 );
        }, 50);
    };

    recur();

    return emitter;
};

ticker(500, (err, count) => {
    if (err) {
        console.error(`Error in cb ${err.message}`);
    }
    console.log(`Total count: ${count}`);
})
    .on("tick", () => console.log("ticked"))
    .on("error", err => console.error(`Error in emitter: ${err.message}`));
