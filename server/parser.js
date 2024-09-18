import { parseEvent, parseTicks, parseHeader } from "@laihoe/demoparser2";
import axios from "axios";
import bignumber from "bignumber.js";
import Constants from "./constants.js";
import ServerUtils from "./ServerUtils.js";

export default class Parser {
    static async parseMatch(match) {
        const demoPath = `./demo-files/${match.demoFileName}`;
        let gameEndTick = Math.max(
            ...parseEvent(demoPath, "round_end").map((x) => x.tick)
        );
        const regex = /Valve Counter-Strike 2 (\w+) Server/;
        const headerInfo = parseHeader(demoPath);
        const server = headerInfo.server_name.match(regex)[1];

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
        let scoreboard = parseTicks(demoPath, fields, [gameEndTick]);
        const steamIdsList = scoreboard.map((element) => {
            return element.steamid;
        });
        const avatarUrls = (await this.getSteamAvatarUrl(steamIdsList)).data.response.players;
        scoreboard.forEach(element => {
            element.avatarUrl = avatarUrls.find(elem => elem.steamid == element.steamid).avatarmedium;
        });
        const userTeam = scoreboard.find(
            (elem) => this.steamIdToAccountId(elem.steamid) == match.accountId
        ).team_name;
        const teamData = scoreboard
            .filter((elem) => elem.team_name == userTeam)
            .sort((a, b) => b.kills_total - a.kills_total);
        const enemyData = scoreboard
            .filter((elem) => elem.team_name != userTeam)
            .sort((a, b) => b.kills_total - a.kills_total);
        let userResult;
        if (teamData[0].team_rounds_total > enemyData[0].team_rounds_total)
            userResult = "VICTORY";
        else if (teamData[0].team_rounds_total < enemyData[0].team_rounds_total)
            userResult = "DEFEAT";
        else userResult = "DRAW";
        const res = {
            teamData: teamData,
            enemyData: enemyData,
            userTeam: userTeam,
            teamScore: teamData[0].team_rounds_total,
            enemyScore: enemyData[0].team_rounds_total,
            userResult: userResult,
            server: server,
            mapName: headerInfo.map_name,
            date: match.matchtime,
        };
        ServerUtils.deleteFile(demoPath);
        return res;
    }

    static steamIdToAccountId(accId) {
        return new bignumber(accId).minus("76561197960265728") + "";
    }

    static async getSteamAvatarUrl(steamIds) {
        const commaDellimitedList = steamIds.reduce((prev, curr) => prev + curr + ',', '');
        return axios.get(Constants.API.GET_STEAM_AVATAR_URL, {
            params: {
                key: process.env.STEAM_API_KEY,
                steamids: commaDellimitedList,
            },
        });
    }
}
