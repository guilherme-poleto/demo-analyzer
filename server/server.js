import express from 'express';
import fs from 'fs-extra';
import { fromBinary, CMsgGCCStrike15_v2_MatchListSchema } from "csgo-protobuf";
import cors from 'cors';
import { parseEvent, parseTicks, parseHeader } from '@laihoe/demoparser2';
import ServerUtils from './ServerUtils.js';

const app = express();
app.use(cors());
app.use(express.json());
const PORT = 5000;

const pathToDemo = "./demo-files/003704871658914316419_2091458204.dem";

app.get('/get-matches', async (req, res) => {
    const buffer = await fs.readFile('./boiler/match.info');
    const bytes = new Uint8Array(buffer);
    const matchListMessage = fromBinary(CMsgGCCStrike15_v2_MatchListSchema, bytes);
    const matchDataList = matchListMessage.matches;

    for (let match of matchDataList) {
        const roundStats = match.roundstatsall[match.roundstatsall.length - 1];
        delete roundStats['reservationid'];
        delete match['matchid'];
        delete match['watchablematchinfo'];
        delete match['$typeName'];
    }

    res.json(matchListMessage);
});

app.get('/get-crosshair', async (req, res) => {
    const pathToDemo = "./src/assets/demo-test.dem";

    let gameEndTick = Math.max(...parseEvent(pathToDemo, "round_end").map(x => x.tick))
    let players = parseTicks(pathToDemo, ["crosshair_code"], [gameEndTick])

    console.log(players)

    res.json(players);
});

app.get('/get-match-result', async (req, res) => {
    res.json(ServerUtils.getMatchResult(pathToDemo));
});

app.get('/get-map', async (req, res) => {
    res.json(ServerUtils.getMapName(pathToDemo));
});

app.get('/get-downloaded-matches', async (req, res) => {
    const files = fs.readdirSync('./demo-files/');
    res.status(200);
    res.json(files);
});

app.post('/download-demo', async (req, res) => {
    const result = await ServerUtils.downloadFile(req.body.url);
    res.status(result.code);
    res.send(result.msg);
});

app.listen(PORT, () => {
    console.log(`Server listening to http://localhost:${PORT}`);
});
