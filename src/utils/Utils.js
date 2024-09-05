import bignumber from "bignumber.js";
import Constants from "./Constants";
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

class Utils {
    static getLastMatches() {
        return axios.get(Constants.GET_MATCHES_URL);
    }

    static getLastRoundData(data, downloadedMatchesList) {
        const matches = data.matches;
        let res = [];
        for (let match of matches) {
            const lastRoundData = match.roundstatsall[match.roundstatsall.length - 1];
            lastRoundData.playerIds = lastRoundData.reservation.accountIds.map(e => this.accountIdToSteamId(e));
            lastRoundData.accountId = data.accountid;
            lastRoundData.playerScore = this.getPlayerScore(lastRoundData);
            lastRoundData.matchDuration = this.getMatchTime(match.matchtime);
            lastRoundData.isDownloaded = downloadedMatchesList.includes(this.getFileName(lastRoundData.map));
            lastRoundData.ID = uuidv4();
            res.push(lastRoundData);
        }
        return res;
    }

    static buildResultString(result, switchedTeams) {
        return `${result[0]} - ${result[1]}`;
    }

    static getMatchData() {
        return axios.get(Constants.GET_MATCH_DATA);
    }

    static getMapName() {
        return axios.get(Constants.GET_MAP_NAME);
    }

    static getPlayerScore(matchData) {
        const accId = matchData.accountId;
        const index = matchData.reservation.accountIds.findIndex(e => e == accId);
        const kills = matchData.kills[index];
        const deaths = matchData.deaths[index];
        return { kills: kills, deaths: deaths, KD: (kills / deaths).toFixed(2) }
    }

    static getMatchTime(time) {
        const date = new Date(time * 1000);
        return date.getMinutes();
    }

    static accountIdToSteamId(accId) {
        return new bignumber(accId).plus('76561197960265728') + "";
    }

    static downloadDemo(url) {
        return axios.post(Constants.DOWNLOAD_DEMO, {
            url: url
        });
    }

    static getDownloadedMatches() {
        return axios.get(Constants.GET_DOWNLOADED_MATCHES);
    }

    static getFileName(url) {
        const regex = /http:\/\/replay\d+\.valve\.net\/730\/(\d+_\d+\.dem)\.bz2/;
        return url.match(regex)[1];
    }
}

export default Utils;
