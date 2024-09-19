import Constants from "./Constants";
import axios from "axios";
import moment from "moment";

class Utils {
    static getLastMatches() {
        return axios.get(Constants.GET_MATCHES_URL);
    }

    static getLastRoundData(data) {
        for (let match of data) {
            match.playerScore = this.getPlayerScore(match);
            match.date = this.getMatchDate(match.matchtime);
            match.isAnalyzed = match.parsedData != undefined;
        }
        return data;
    }

    static buildResultString(result, switchedTeams) {
        return `${result[0]} - ${result[1]}`;
    }

    static getMapName() {
        return axios.get(Constants.GET_MAP_NAME);
    }

    static getPlayerScore(matchData) {
        const accId = matchData.accountId;
        const index = matchData.accountIds.findIndex((e) => e == accId);
        const kills = matchData.kills[index];
        const deaths = matchData.deaths[index];
        return {
            kills: kills,
            deaths: deaths,
            KD: (kills / deaths).toFixed(2),
        };
    }

    static getMatchDate(time) {
        const date = moment().unix(time * 1000);
        return moment(time * 1000).format('DD/MM/YYYY');
    }

    static analyzeMatch(id) {
        return axios.post(Constants.ANALYZE_MATCH, {
            ID: id,
        });
    }

    static fetchLastMatches() {
        return axios.get(Constants.FETCH_NEW_MATCHES);
    }

    static getHsPercentage(match) {
        return Math.floor((match.headshot_kills_total / match.kills_total) * 100);
    }

    static getKDRatio(match) {
        return (match.kills_total / match.deaths_total).toFixed(2);
    }
}

export default Utils;
