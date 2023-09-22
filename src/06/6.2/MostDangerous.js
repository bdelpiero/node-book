import {Transform} from "stream";

export class MostDangerous extends Transform {
    constructor(options = {}) {
        options.objectMode = true;
        super(options);
        this.boroughTotals = {};
    }

    _transform({borough, value}, _, cb) {
        const crimes = Number(value);
        this.boroughTotals[borough] = this.boroughTotals[borough] || 0;
        this.boroughTotals[borough] += crimes;        
        cb()
    }   
    
    _flush(cb) {
        const boroughs = Object.keys(this.boroughTotals);

        const mostDangerousBorough = boroughs.reduce((mostDangerous, borough) => {
            return this.boroughTotals[borough] > this.boroughTotals[mostDangerous] ? borough : mostDangerous;
        }, boroughs[0]);

        console.log(`The most dangerous area of London is ${mostDangerousBorough}`);
        cb();
    }
}
