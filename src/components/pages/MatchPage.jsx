import { useEffect, useRef, useState } from "react";
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
    const slider = useRef();
    const [currTick, setCurrTick] = useState();
    const [matchLog, setMatchLog] = useState({ pos: [] });

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
                document.title = `Demo Analyzer :: ${parsedData.scoreboard.teamScore}:${parsedData.scoreboard.enemyScore} - ${parsedData.scoreboard.mapName}`;
                const allPlayersAvatars = parsedData.scoreboard.teamData
                    .concat(parsedData.scoreboard.enemyData)
                    .map((value) => {
                        return { name: value.name, avatarUrl: value.avatarUrl };
                    });
                res.data.parsedData.scoreboard.allPlayersAvatars =
                    allPlayersAvatars;
                setMatch(res.data);
                setLoading(false);
                setCurrTick(res.data.parsedData.matchLog.startTick);
            })
            .catch(() => {
                setError(true);
            });
    }, []);

    useEffect(() => {
        if (loading) return;
        const pos = match.parsedData.matchLog.allTicksData[currTick] || [];
        setMatchLog({ pos: pos });
    }, [currTick]);

    const handleSliderChange = () => {
        setCurrTick(parseInt(slider.current.value));
    };

    if (error) return <>Match not found.</>;

    return loading ? (
        <BusyIndicator></BusyIndicator>
    ) : (
        <>
            <div>
                <div className="score-header">
                    <div className="match-result">
                        <div>{`${match.parsedData.scoreboard.userResult} ${match.parsedData.scoreboard.teamScore}:${match.parsedData.scoreboard.enemyScore}`}</div>
                    </div>
                    <div className="match-info-container">
                        <div className="match-info">
                            <div>{match.parsedData.scoreboard.mapName}</div>
                        </div>
                        <div className="match-info">
                            <div>{match.parsedData.scoreboard.server}</div>
                        </div>
                        <div className="match-info">
                            <div>{match.date}</div>
                        </div>
                    </div>
                </div>
                <div style={{ padding: "20px" }}>
                    <div className="score-table">
                        <div>Scoreboard</div>
                        <ScoreTable
                            side="team"
                            data={match.parsedData.scoreboard}
                        ></ScoreTable>
                        <ScoreTable
                            side="enemy"
                            data={match.parsedData.scoreboard}
                        ></ScoreTable>
                    </div>
                    <div className="game-log-container">
                        <div>Game Log</div>
                        <div className="game-log">
                            <div className="game-data">
                                <div className="radar">
                                    {matchLog.pos.map((value, index) => {
                                        return (
                                            <div key={index}>
                                                <div
                                                    style={{
                                                        position: "absolute",
                                                        left: `${value.x}px`,
                                                        top: `${value.y}px`,
                                                        transform:
                                                            "translate(-50%, -50%)",
                                                    }}
                                                >
                                                    <span className="player-name">
                                                        {value.name}
                                                    </span>
                                                    <div
                                                        className="position"
                                                        style={{
                                                            display:
                                                                !value.teamName
                                                                    ? "none"
                                                                    : "block",
                                                            backgroundImage: `url(${
                                                                value.isAlive
                                                                    ? match.parsedData.scoreboard.allPlayersAvatars.find(
                                                                          (
                                                                              elem
                                                                          ) =>
                                                                              elem.name ==
                                                                              value.name
                                                                      )
                                                                          ?.avatarUrl
                                                                    : "/src/assets/images/dead-icon.webp"
                                                            })`,
                                                            backgroundSize:
                                                                "cover",
                                                            outline: `${value.isAlive ? `3px solid ${
                                                                value.teamName ==
                                                                "TERRORIST"
                                                                    ? "#d39a40"
                                                                    : "#5e78ad"
                                                            }` : "0px"} `,
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="time-line">
                                <div className="slider-container">
                                    <input
                                        id="range-slider"
                                        ref={slider}
                                        className="slider"
                                        type="range"
                                        min={
                                            match.parsedData.matchLog.startTick
                                        }
                                        max={match.parsedData.matchLog.lastTick}
                                        step="100"
                                        value={currTick}
                                        onChange={handleSliderChange}
                                    ></input>
                                </div>
                                <button
                                    onClick={() => {
                                        setCurrTick((prev) => prev - 100);
                                    }}
                                >
                                    {"<"}
                                </button>
                                <button
                                    onClick={() => {
                                        setCurrTick((prev) => prev + 100);
                                    }}
                                >
                                    {">"}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="chat-log-container">
                        <div>Chat Log</div>
                        <textarea
                            className="chat-log"
                            value={match.parsedData.chatLog
                                .map((msg) => `• ${msg.user}: ${msg.message}`)
                                .join("\n")}
                            readOnly
                        />
                    </div>
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
