import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import "./MatchPage.css";
import axios from "axios";
import Constants from "../../utils/Constants";
import Utils from "../../utils/Utils";
import { BusyIndicator } from "../BusyIndicator";

export default function MatchPage() {
    const { id } = useParams();
    const [match, setMatch] = useState();
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .get(Constants.GET_MATCH_DETAILS, {
                params: {
                    id: id,
                },
            })
            .then((res) => {
                const parsedData = res.data.parsedData;
                console.log(res.data);
                document.title = `Demo Analyzer :: ${parsedData.teamScore}:${parsedData.enemyScore} - ${parsedData.mapName}`;
                setMatch(res.data);
                setLoading(false);
            });
    }, []);

    if (error) return <>Match not found.</>;

    return loading ? (
        <BusyIndicator></BusyIndicator>
    ) : (
        <>
            <div>
                <div className="score-header">
                    <div className="match-result">
                        <div>{`${match.parsedData.userResult} ${match.parsedData.teamScore}:${match.parsedData.enemyScore}`}</div>
                    </div>
                    <div className="match-info-container">
                        <div className="match-info">
                            <div>{match.parsedData.mapName}</div>
                        </div>
                        <div className="match-info">
                            <div>{match.parsedData.server}</div>
                        </div>
                        <div className="match-info">
                            <div>{match.date}</div>
                        </div>
                    </div>
                </div>
                <div className="score-table">
                    <ScoreTable
                        side="team"
                        data={match.parsedData}
                    ></ScoreTable>
                    <ScoreTable
                        side="enemy"
                        data={match.parsedData}
                    ></ScoreTable>
                </div>
            </div>
        </>
    );
}

const handleAvatarClick = (steamId) => {
    window.open(`https://steamcommunity.com/profiles/${steamId}/`, "_blank");
};

function ScoreTable(props) {
    const data =
        props.side == "team" ? props.data.teamData : props.data.enemyData;
    return (
        <>
            <table className="scoreboard">
                <thead>
                    <tr className="row">
                        <th>
                            {props.side == "team" ? "My Team" : "Enemy Team"}
                        </th>
                        <th>Kills</th>
                        <th>Deaths</th>
                        <th>Assists</th>
                        <th>K/D</th>
                        <th>HS Percentage</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((value) => {
                        return (
                            <tr key={value.steamid}>
                                <td style={{ width: "25%" }}>
                                    <div className="avatar-column">
                                        <img
                                            className="avatar"
                                            src={value.avatarUrl}
                                            onClick={() => {
                                                handleAvatarClick(
                                                    value.steamid
                                                );
                                            }}
                                        ></img>
                                        <div>{value.name}</div>
                                    </div>
                                </td>
                                <td style={{ width: "15%" }}>
                                    {value.kills_total}
                                </td>
                                <td style={{ width: "15%" }}>
                                    {value.deaths_total}
                                </td>
                                <td style={{ width: "15%" }}>
                                    {value.assists_total}
                                </td>
                                <td style={{ width: "15%" }}>
                                    {Utils.getKDRatio(value)}
                                </td>
                                <td style={{ width: "15%" }}>
                                    {Utils.getHsPercentage(value)}%
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </>
    );
}
