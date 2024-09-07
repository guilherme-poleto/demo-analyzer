import { parseEvent, parseTicks, parseHeader } from "@laihoe/demoparser2";
import http from "http";
import fs from "fs";
import unbzip2Stream from "unbzip2-stream";
import { execFile as execCallback } from "node:child_process";
import { promisify } from "node:util";

export default class ServerUtils {
    static async execBoiler() {
        const execFile = promisify(execCallback);
        return execFile("./boiler/bin-linux/boiler-writter", [
            "./boiler/match.info",
        ]);
    }

    static getMatchResult = (pathToDemo) => {
        let gameEndTick = Math.max(
            ...parseEvent(pathToDemo, "round_end").map((x) => x.tick)
        );
        let fields = [
            "kills_total",
            "deaths_total",
            "mvps",
            "headshot_kills_total",
            "ace_rounds_total",
            "score",
            "team_rounds_total",
        ];
        return parseTicks(pathToDemo, fields, [gameEndTick]);
    };

    static getMapName = (pathToDemo) => {
        console.log(parseHeader(pathToDemo));
        return "";
    };

    static async downloadFile(db, matchId) {
        const match = await db.getMatchById(matchId);
        const filePath = `./demo-files/${match.demoFileName}`;
        return new Promise((resolve, reject) => {
            if (fs.existsSync(filePath)) {
                console.log("Demo file already downloaded.");
                resolve({ code: 304, msg: "Demo file already downloaded." });
            }

            const outputPath = `${filePath}.bz2`;
            console.log("Downloading to path:" + outputPath);
            const file = fs.createWriteStream(outputPath);

            file.on("finish", async () => {
                file.close();
                console.log("Download concluído.");
                await this.decompressFile(outputPath, filePath);
                resolve({
                    code: 200,
                    msg: "Demo file was downloaded and parsed sucessfully.",
                });
            });

            http.get(match.demoUrl, (response) => {
                if (response.statusCode !== 200) {
                    return;
                }
                response.pipe(file);
            }).on("error", (error) => {
                fs.unlink(outputPath, () => {
                    console.error(`Erro ao fazer download: ${error.message}`);
                });
            });
        });
    }

    static decompressFile(filePath, outputPath) {
        return new Promise((resolve, reject) => {
            const readStream = fs
                .createReadStream(filePath)
                .pipe(unbzip2Stream())
                .pipe(fs.createWriteStream(outputPath));

            readStream.on("finish", async () => {
                readStream.close();
                console.log("Decompression finished.");
                this.deleteFile(filePath);
                resolve();
            });
        });
    }

    static deleteFile(filePath) {
        fs.unlinkSync(filePath);
    }
}
