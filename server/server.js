import express from "express";
import fs from "fs-extra";
import { fromBinary, CMsgGCCStrike15_v2_MatchListSchema } from "csgo-protobuf";
import cors from "cors";
import ServerUtils from "./ServerUtils.js";
import "dotenv/config";
import DBConnection from "./db/db-connection.js";
import Parser from "./parser.js";

const app = express();
app.use(cors());
app.use(express.json());
const PORT = 5000;

const dbUrl = process.env.DB_URI;
const db = new DBConnection(dbUrl);

app.get("/get-matches", async (req, res) => {
    const matches = await db.getAllMatches();
    res.json(matches);
});

app.get("/get-match-details", async (req, res) => {
    const matchId = req.query.id;
    const match = await db.getMatchById(matchId);
    if (match == null) {
        res.status(404);
        res.send("Match not found.");
        return;
    }
    res.status(200);
    res.json(match);
});

app.post("/analyze-match", async (req, res) => {
    const matchId = req.body.ID;
    const match = await db.getMatchById(matchId);
    if (match == null) {
        res.status(404);
        res.send("Match not found.");
        return;
    }
    await ServerUtils.downloadFile(match);
    const scoreboard = await Parser.parseMatch(match);
    await db.updateMatch(matchId, { parsedData: scoreboard });
    res.sendStatus(200);
});

app.get("/fetch-new-matches", async (req, res) => {
    await ServerUtils.execBoiler();
    const regex = /http:\/\/replay\d+\.valve\.net\/730\/(\d+_\d+\.dem)\.bz2/;
    const buffer = await fs.readFile("./boiler/match.info");
    const bytes = new Uint8Array(buffer);
    const matchListMessage = fromBinary(
        CMsgGCCStrike15_v2_MatchListSchema,
        bytes
    );
    const matchDataList = matchListMessage.matches;
    const newMatchesList = [];

    for (let match of matchDataList) {
        const roundStats = match.roundstatsall[match.roundstatsall.length - 1];
        const newMatch = new db.Match({
            ID: match.matchid.toString(),
            accountIds: roundStats.reservation.accountIds,
            matchResult: roundStats.matchResult,
            demoUrl: roundStats.map,
            demoFileName: roundStats.map.match(regex)[1],
            kills: roundStats.kills,
            deaths: roundStats.deaths,
            mvps: roundStats.mvps,
            scores: roundStats.scores,
            teamScores: roundStats.teamScores,
            headshots: roundStats.enemyHeadshots,
            matchtime: match.matchtime,
            accountId: matchListMessage.accountid,
        });
        newMatchesList.push(newMatch);
    }
    await db.saveNewMatches(newMatchesList);

    res.sendStatus(200);
});

app.listen(PORT, () => {
    console.log(`Server listening to http://localhost:${PORT}`);
});
