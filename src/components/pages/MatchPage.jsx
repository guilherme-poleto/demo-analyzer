import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import "./MatchPage.css";
import axios from "axios";
import Constants from "../../utils/Constants";
import Utils from "../../utils/Utils";

export default function MatchPage() {
    const { id } = useParams();
    const location = useLocation();
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
                console.log(res.data);
                setMatch(res.data.parsedData);
                setLoading(false);
            });
    }, []);

    if (error) return <>Match not found.</>;

    return loading ? (
        <>Loading...</>
    ) : (
        <>
            <div>
                <div className="score-header">
                    <div className="match-result">
                        <div>{`${match.userResult} ${match.teamScore}:${match.enemyScore}`}</div>
                    </div>
                    <div className="match-info-container">
                        <div className="match-info">
                            <div>{match.mapName}</div>
                        </div>
                        <div className="match-info">
                            <div>{match.server}</div>
                        </div>
                        <div className="match-info">
                            <div>{Utils.getMatchDate(match.date)}</div>
                        </div>
                    </div>
                </div>
                <div className="score-table">
                    <ScoreTable side="team" data={match}></ScoreTable>
                    <ScoreTable side="enemy" data={match}></ScoreTable>
                </div>
            </div>
        </>
    );
}

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
                    {data.map((value, index) => {
                        return (
                            <tr key={value.steamid}>
                                <td style={{width: '25%'}}>
                                    <div className="avatar-column">
                                        <img className="avatar" src={value.avatarUrl}></img>
                                        <div>{value.name}</div>
                                    </div>
                                </td>
                                <td style={{width: '15%'}}>{value.kills_total}</td>
                                <td style={{width: '15%'}}>{value.deaths_total}</td>
                                <td style={{width: '15%'}}>{value.assists_total}</td>
                                <td style={{width: '15%'}}>{Utils.getKDRatio(value)}</td>
                                <td style={{width: '15%'}}>{Utils.getHsPercentage(value)}%</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </>
    );
}
