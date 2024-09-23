import { useEffect, useState } from "react";
import "./Stats.css";
import {
    VictoryChart,
    VictoryPie,
    VictoryLine,
    VictoryAxis,
    VictoryScatter,
} from "victory";
import { BusyIndicator } from "../BusyIndicator";
import axios from "axios";
import Constants from "../../utils/Constants";
import ClutchingCard from "../cards/ClutchingCard";

export default function StatsPage() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({});

    useEffect(() => {
        document.title = "Demo Analyzer :: Stats";
        axios
            .get(Constants.GET_STATS)
            .then((response) => {
                const data = response.data;
                console.log(data);
                setStats(data);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return loading ? (
        <BusyIndicator></BusyIndicator>
    ) : (
        <>
            <div style={{ padding: "0px 30px 30px 30px" }}>
                <h2>General Data</h2>
                <div className="stats-row">
                    <div className="small-cards-container">
                        <div className="card">
                            <h1>Win Rate</h1>
                            <span style={{ fontSize: "22px" }}>
                                {stats.wr.percentage}
                            </span>
                            <div className="winrate-bar-container">
                                <span>{stats.wr.wins} wins</span>
                                <div className="winrate-bar">
                                    <div
                                        style={{
                                            backgroundColor: "#f84982",
                                            height: "100%",
                                            width: stats.wr.percentage,
                                        }}
                                    ></div>
                                </div>
                                <span>{stats.wr.losses} losses</span>
                            </div>
                        </div>
                        <div className="card">
                            <h1>K/D Ratio</h1>
                            <span style={{ fontSize: "22px" }}>
                                {stats.kd.rate}
                            </span>
                            <div className="winrate-bar-container">
                                <span>{stats.kd.kills} kills</span>
                                <div className="winrate-bar">
                                    <div
                                        style={{
                                            backgroundColor: "#f84982",
                                            height: "100%",
                                            width: `${stats.kd.rate * 50}%`,
                                        }}
                                    ></div>
                                </div>
                                <span>{stats.kd.deaths} deaths</span>
                            </div>
                        </div>
                    </div>
                    <div className="card">
                        <h1>Headshot Rate</h1>
                        <span
                            style={{ fontSize: "22px", marginBottom: "30px" }}
                        >
                            {stats.totalMatches} Matches
                        </span>
                        <div
                            style={{
                                position: "relative",
                                width: 200,
                                height: 200,
                            }}
                        >
                            <VictoryPie
                                padAngle={0}
                                innerRadius={100}
                                width={200}
                                height={200}
                                data={[
                                    { key: "", y: 100 - stats.hsRate },
                                    { key: "", y: stats.hsRate },
                                ]}
                                colorScale={["#101010", "#f84982"]}
                                labels={() => null}
                            />
                            <div
                                style={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",
                                    fontSize: "24px",
                                }}
                            >
                                {`${stats.hsRate}%`}
                            </div>
                        </div>
                    </div>
                </div>

                <h2>
                    Analyzed Matches - {stats.analyzed.parsedMatches} parsed
                </h2>
                <div className="stats-row">
                    <ClutchingCard stats={stats}></ClutchingCard>
                    <div className="card">
                        <h1>Rating History</h1>
                        <VictoryChart
                            maxDomain={{
                                y:
                                    Math.max(
                                        ...stats.analyzed.rankGraph.data.map(
                                            (data) => data.y
                                        )
                                    ) + 100,
                            }}
                            minDomain={{
                                y:
                                    Math.min(
                                        ...stats.analyzed.rankGraph.data.map(
                                            (data) => data.y
                                        )
                                    ) - 100,
                            }}
                            height={200}
                            padding={{
                                top: 10,
                                left: 60,
                                right: 10,
                                bottom: 5,
                            }}
                        >
                            <VictoryAxis
                                dependentAxis
                                style={{
                                    axis: { stroke: "#101010" },
                                    tickLabels: {
                                        fill: "#8d8b8f",
                                        fontFamily: "Poppins",
                                        fontSize: "14px",
                                    },
                                }}
                            />
                            <VictoryAxis
                                tickFormat={() => ""}
                                style={{
                                    axis: { stroke: "#101010" },
                                }}
                            />
                            <VictoryLine
                                animate={{
                                    duration: 1000,
                                    onLoad: { duration: 1000 },
                                }}
                                interpolation={"natural"}
                                data={stats.analyzed.rankGraph.data}
                                style={{
                                    data: { stroke: "#f84982" },
                                }}
                            />
                            <VictoryScatter
                                data={stats.analyzed.rankGraph.data}
                                size={3}
                                style={{
                                    data: { fill: "white" },
                                }}
                            />
                        </VictoryChart>
                    </div>
                </div>
            </div>
        </>
    );
}
