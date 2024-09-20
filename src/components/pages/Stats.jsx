import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import "./Stats.css";
import { Chart } from "react-google-charts";
import { BusyIndicator } from "../BusyIndicator";
import axios from "axios";
import Constants from "../../utils/Constants";

export default function StatsPage() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({});

    useEffect(() => {
        axios
            .get(Constants.GET_STATS)
            .then((response) => {
                const data = response.data;
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
            <div className="stats-row">
                <div className="card">
                    <h1>Win rate</h1>
                    <span style={{ fontSize: "24px" }}>
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
                    <h1>Headshot rate</h1>
                    <span style={{ fontSize: "24px" }}>
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
            </div>
        </>
    );
}
