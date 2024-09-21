import Constants from "./Constants";
import axios from "axios";

class Utils {
    static getLastMatches() {
        return axios.get(Constants.GET_MATCHES_URL);
    }

    static buildResultString(result, switchedTeams) {
        return `${result[0]} - ${result[1]}`;
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

    static getScoreColor = (result) => {
        switch (result) {
            case "DRAW":
                return "#fff";
            case "VICTORY":
                return "#00b087";
            case "DEFEAT":
                return "#de425b";
        }
    };
}

export default Utils;
