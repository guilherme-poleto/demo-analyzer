import { parseEvent, parseTicks, parseHeader } from "@laihoe/demoparser2";
import http from "http";
import fs from "fs";
import { execFile as execCallback } from "node:child_process";
import { promisify } from "node:util";
import axios from "axios";

export default class ServerUtils {
    static async execBoiler() {
        const execFile = promisify(execCallback);
        const filePath =
            this.getOS() == "linux"
                ? "./boiler/bin-linux/boiler-writter"
                : "./boiler/bin-win/boiler-writter";
        return execFile(filePath, ["./boiler/match.info"]);
    }

    static async downloadFile(match) {
        const filePath = `./demo-files/${match.demoFileName}`;
        return new Promise((resolve, reject) => {
            const outputPath = `${filePath}.bz2`;
            console.log("Downloading to path:" + outputPath);
            const writer = fs.createWriteStream(outputPath);

            axios({
                method: "get",
                url: match.demoUrl,
                responseType: "stream",
            }).then((response) => {
                response.data.pipe(writer);
            });

            writer.on("finish", async () => {
                writer.close();
                console.log("Download concluído.");
                const res = await this.decompressFile(outputPath, filePath);
                resolve(res);
            });
        });
    }

    static decompressFile(filePath, outputPath) {
        return new Promise((resolve, reject) => {
            execCallback(
                "python3",
                ["decompress.py", filePath, outputPath],
                (error, stdout) => {
                    this.deleteFile(filePath);
                    if (error) {
                        reject({
                            code: 500,
                            msg: "Error while decompressing.",
                        });
                    }
                    console.log(stdout);
                    resolve({
                        code: 200,
                        msg: "Demo file was downloaded and parsed successfully.",
                    });
                }
            );
        });
    }

    static buildStats(matches) {
        const result = {
            wr: { wins: 0, losses: 0 },
            kd: { kills: 0, deaths: 0, rate: 0 },
        };
        const analyzedMatches = [];
        matches.forEach((match) => {
            if (match.result == "DEFEAT") result.wr.losses += 1;
            if (match.result == "VICTORY") result.wr.wins += 1;
            result.kd.kills += match.playerScore.kills;
            result.kd.deaths += match.playerScore.deaths;
            if (match.parsedData != undefined) analyzedMatches.push(match);
        });
        result.kd.rate = (result.kd.kills / result.kd.deaths).toFixed(2);
        result.wr.percentage = `${Math.round(
            (result.wr.wins / (result.wr.wins + result.wr.losses)) * 100
        )}%`;
        result.hsRate = Math.round(
            matches.reduce(function (acc, obj) {
                return acc + obj.playerScore.hsRate;
            }, 0) / matches.length
        );
        result.totalMatches = matches.length;
        const rankGraphData = [];
        analyzedMatches
            .sort((a, b) => a.matchtime - b.matchtime)
            .map((value, index) =>
                rankGraphData.push({
                    x: index + 1,
                    y: value.parsedData.scoreboard.userData.rank,
                })
            );
        result.analyzed = {
            parsedMatches: analyzedMatches.length,
            rankGraph: {
                data: rankGraphData,
            },
        };
        const clutches = {
            Overall: { total: 0, success: 0 },
            "1v1": { total: 0, success: 0 },
            "1v2": { total: 0, success: 0 },
            "1v3": { total: 0, success: 0 },
            "1v4": { total: 0, success: 0 },
            "1v5": { total: 0, success: 0 },
        };
        analyzedMatches.forEach((match) => {
            match.parsedData.clutches.forEach((clutch) => {
                clutches[clutch.situation].total += 1;
                clutches.Overall.total += 1;
                if (clutch.success) {
                    clutches[clutch.situation].success += 1;
                    clutches.Overall.success += 1;
                }
            });
        });
        result.clutches = clutches;
        return result;
    }

    static getMatchResult(matchData, accId) {
        if (matchData.teamScores[0] == matchData.teamScores[1]) return "DRAW";

        const winner =
            matchData.teamScores[0] > matchData.teamScores[1] ? 0 : 1;
        const index = Math.floor(
            matchData.reservation.accountIds.findIndex((el) => el == accId) / 5
        );
        return winner == index ? "VICTORY" : "DEFEAT";
    }

    static deleteFile(filePath) {
        fs.unlink(filePath, () => {});
    }

    static getOS() {
        return process.platform;
    }
}
