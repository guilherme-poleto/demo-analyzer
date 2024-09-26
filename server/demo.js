import {
    parseEvents,
    parseEvent,
    listGameEvents,
    parseTicks,
    parseHeader,
} from "@laihoe/demoparser2";
import bignumber from "bignumber.js";

const match = {
    demoFileName: "test.dem",
    accountId: 932595367,
};
// let eventNames = listGameEvents(pathToDemo);
// console.log(eventNames);

//170, 255

const pathToDemo = `./demo-files/${match.demoFileName}`;

const newMatchEvent = parseEvents(pathToDemo, ["begin_new_match"]);

const startTick =
    newMatchEvent.find((event) => event.event_name === "begin_new_match")
        ?.tick || 0;
const lastTick = Math.max(
    ...parseEvent(pathToDemo, "round_end").map((x) => x.tick)
);

const wantedTicks = [];
for (let i = startTick; i < lastTick; i += 100) {
    wantedTicks.push(i);
}
wantedTicks.push(lastTick);

const cords = parseTicks(pathToDemo, ["X", "Y", "Z"], wantedTicks);
const pos = [];

cords.map((value) => {
    pos.push({
        [value.tick]: {
            name: value.name,
            x: getPosX(value.X),
            y: getPosY(value.Y),
        },
    });
});
console.log(pos);

function steamIdToAccountId(accId) {
    return new bignumber(accId).minus("76561197960265728") + "";
}
