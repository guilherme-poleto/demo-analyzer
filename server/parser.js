import {
    parseEvent,
    parseEvents,
    parseTicks,
    parseHeader,
} from "@laihoe/demoparser2";
import axios from "axios";
import bignumber from "bignumber.js";
import Constants from "./constants.js";
import ServerUtils from "./ServerUtils.js";

export default class Parser {
    constructor(match) {
        this.match = match;
        this.demoPath = `./demo-files/${this.match.demoFileName}`;
    }

    async parseMatch() {
        const clutches = this.getClutchesStats();
        const chatLog = this.getChatLog();
        const matchLog = this.getMatchLog();
        const scoreboard = await this.getScoreboard();
        const res = {
            clutches: clutches,
            chatLog: chatLog,
            scoreboard: scoreboard,
            matchLog: matchLog,
        };
        ServerUtils.deleteFile(this.demoPath);
        return res;
    }

    async getSteamAvatarUrl(steamIds) {
        const commaDellimitedList = steamIds.reduce(
            (prev, curr) => prev + curr + ",",
            ""
        );
        return axios.get(Constants.API.GET_STEAM_AVATAR_URL, {
            params: {
                key: process.env.STEAM_API_KEY,
                steamids: commaDellimitedList,
            },
        });
    }

    getMatchLog() {
        const newMatchEvent = parseEvents(this.demoPath, ["begin_new_match"]);
        const startTick =
            newMatchEvent.find(
                (event) => event.event_name === "begin_new_match"
            )?.tick || 0;
        const lastTick = Math.max(
            ...parseEvent(this.demoPath, "round_end").map((x) => x.tick)
        );
        const wantedTicks = [];
        for (let i = startTick; i < lastTick; i += 100) {
            wantedTicks.push(i);
        }
        wantedTicks.push(lastTick);

        const cords = parseTicks(this.demoPath, ["X", "Y"], wantedTicks);
        const pos = {};
        cords.forEach((value) => {
            pos[value.tick] = pos[value.tick] || [];
            pos[value.tick].push({
                name: value.name,
                x: this.getPosX(value.X),
                y: this.getPosY(value.Y),
            });
        });
        return { startTick: startTick, lastTick: lastTick, allTicksData: pos };
    }

    async getScoreboard() {
        const gameEndTick = Math.max(
            ...parseEvent(this.demoPath, "round_end").map((x) => x.tick)
        );
        const regex = /Valve Counter-Strike 2 (\w+) Server/;
        const headerInfo = parseHeader(this.demoPath);
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
            "rank",
            "rank_if_win",
            "team_name",
            "is_matchmaking",
            "match_making_mode",
            "comp_rank_type",
            "team_rounds_total",
        ];
        const tickData = parseTicks(this.demoPath, fields, [gameEndTick]);
        const userData = tickData.filter(
            (elem) =>
                this.steamIdToAccountId(elem.steamid) == this.match.accountId
        )[0];
        const steamIdsList = tickData.map((element) => {
            return element.steamid;
        });
        const avatarUrls = (await this.getSteamAvatarUrl(steamIdsList)).data
            .response.players;
        tickData.forEach((element) => {
            element.avatarUrl = avatarUrls.find(
                (elem) => elem.steamid == element.steamid
            ).avatarmedium;
        });
        const teamData = tickData
            .filter((elem) => elem.team_name == userData.team_name)
            .sort((a, b) => b.kills_total - a.kills_total);
        const enemyData = tickData
            .filter((elem) => elem.team_name != userData.team_name)
            .sort((a, b) => b.kills_total - a.kills_total);
        let userResult;
        if (teamData[0].team_rounds_total > enemyData[0].team_rounds_total)
            userResult = "VICTORY";
        else if (teamData[0].team_rounds_total < enemyData[0].team_rounds_total)
            userResult = "DEFEAT";
        else userResult = "DRAW";
        const scoreboard = {
            userData: userData,
            teamData: teamData,
            enemyData: enemyData,
            userTeam: userData.team_name,
            teamScore: teamData[0].team_rounds_total,
            enemyScore: enemyData[0].team_rounds_total,
            userResult: userResult,
            server: server,
            mapName: headerInfo.map_name,
            date: this.match.matchtime,
        };
        return scoreboard;
    }

    getChatLog() {
        const messageEvents = parseEvent(this.demoPath, "chat_message");
        const chatLog = [];
        messageEvents.map((value) => {
            chatLog.push({
                user: value.user_name,
                message: value.chat_message,
            });
        });
        return chatLog;
    }

    getClutchesStats() {
        let deaths = parseEvents(
            this.demoPath,
            ["player_death", "begin_new_match"],
            []
        );

        const matchStartTick =
            deaths.find((event) => event.event_name === "begin_new_match")
                ?.tick || 0;
        deaths = deaths.filter((event) => event.tick > matchStartTick);

        const wantedTicks = deaths.map((v) => v.tick);

        const allTicksArray = parseTicks(
            this.demoPath,
            ["is_alive", "team_name", "total_rounds_played"],
            wantedTicks
        );

        const round_ends = parseEvent(this.demoPath, "round_end");
        const clutchesArr = [];
        const roundSet = new Set();
        for (let tick of wantedTicks) {
            const tickDataSlice = allTicksArray.filter(
                (elem) => elem.tick == tick
            );
            const round = tickDataSlice[0].total_rounds_played;
            if (round >= round_ends.length) break;
            if (roundSet.has(round)) continue;

            const userIndex = tickDataSlice.findIndex(
                (data) =>
                    this.steamIdToAccountId(data.steamid) ==
                    this.match.accountId
            );
            if (!tickDataSlice[userIndex]?.is_alive) {
                continue;
            }
            const userTeam = tickDataSlice[userIndex].team_name;
            const enemyAlive = tickDataSlice.filter(
                (data) => data.is_alive && data.team_name != userTeam
            ).length;
            const teamAlive = tickDataSlice.filter(
                (data) => data.is_alive && data.team_name == userTeam
            ).length;
            if (teamAlive > 1 || enemyAlive <= 0) {
                continue;
            }
            const winner = round_ends[round].winner;
            const result = {
                round: round + 1,
                situation: `1v${enemyAlive}`,
                success: winner == userTeam,
            };
            roundSet.add(round);
            clutchesArr.push(result);
        }
        return clutchesArr;
    }

    steamIdToAccountId(accId) {
        return new bignumber(accId).minus("76561197960265728") + "";
    }

    getPosX(pos_x) {
        return (Math.abs(pos_x + 2476) / 4.4 / 2).toFixed(2);
    }
    getPosY(pos_y) {
        return (Math.abs(pos_y - 3239) / 4.4 / 2).toFixed(2);
    }
}
