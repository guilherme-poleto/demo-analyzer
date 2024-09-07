import bignumber from "bignumber.js";
import Constants from "./Constants";
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

class Utils {
    static getLastMatches() {
        return axios.get(Constants.GET_MATCHES_URL);
    }

    static getLastRoundData(data, downloadedMatchesList) {
        for (let match of data) {
            match.playerIds = match.accountIds.map(e => this.accountIdToSteamId(e));
            match.playerScore = this.getPlayerScore(match);
            match.date = this.getMatchDate(match.matchtime);
            match.isDownloaded = downloadedMatchesList.includes(match.demoFileName);
        }
        return data;
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
        const index = matchData.accountIds.findIndex(e => e == accId);
        const kills = matchData.kills[index];
        const deaths = matchData.deaths[index];
        return { kills: kills, deaths: deaths, KD: (kills / deaths).toFixed(2) }
    }

    static getMatchDate(time) {
        const date = new Date(time * 1000);
        return date.toDateString();
    }

    static accountIdToSteamId(accId) {
        return new bignumber(accId).plus('76561197960265728') + "";
    }

    static downloadDemo(id) {
        return axios.post(Constants.DOWNLOAD_DEMO, {
            ID: id
        });
    }

    static getDownloadedMatches() {
        return axios.get(Constants.GET_DOWNLOADED_MATCHES);
    }
}

export default Utils;
