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

const cords = parseTicks(pathToDemo, ["X", "Y", "is_alive", "team_name"], wantedTicks);
const pos = [];

cords.map((value) => {
    pos.push({
        [value.tick]: {
            name: value.name,
            x: getPosX(value.X),
            y: getPosY(value.Y),
            isAlive: value.is_alive,
            teamName: value.team_name
        },
    });
});
console.log(pos);

function steamIdToAccountId(accId) {
    return new bignumber(accId).minus("76561197960265728") + "";
}

function getPosX(pos_x) {
    return (Math.abs(pos_x + 2476) / 4.4 / 2).toFixed(2);
}
function getPosY(pos_y) {
    return (Math.abs(pos_y - 3239) / 4.4 / 2).toFixed(2);
}
