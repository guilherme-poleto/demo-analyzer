import { parseEvent, parseTicks, parseHeader } from "@laihoe/demoparser2";
import bignumber from "bignumber.js";

const match = {
    demoFileName: '003705972854169272532_1291040932.dem',
    accountId: 932595367
}
let gameEndTick = Math.max(
    ...parseEvent(`./demo-files/${match.demoFileName}`, "round_end").map(
        (x) => x.tick
    )
);

let fields = [
    "kills_total",
    "deaths_total",
    "assists_total",
    "mvps",
    "headshot_kills_total",
    "ace_rounds_total",
    "damage_total",
    "score",
    "rank_if_win",
    "team_name",
    "is_matchmaking",
    "match_making_mode",
    "comp_rank_type",
    "team_rounds_total",
];
let scoreboard = parseTicks(`./demo-files/${match.demoFileName}`, fields, [gameEndTick]);
const t = scoreboard.filter((elem) => elem.team_name == "TERRORIST");
const ct = scoreboard.filter((elem) => elem.team_name == "CT");
const userTeam = scoreboard.find(
    (elem) => steamIdToAccountId(elem.steamid) == match.accountId
).team_name;
const res = {
    CT: ct,
    T: t,
    user_team: userTeam,
};

function steamIdToAccountId(accId) {
    return new bignumber(accId).minus("76561197960265728") + "";
}
