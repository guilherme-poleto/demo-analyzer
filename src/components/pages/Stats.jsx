import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import "./Stats.css";
import { Chart } from "react-google-charts";
import { BusyIndicator } from "../BusyIndicator";

export default function StatsPage() {
    const [loading, setLoading] = useState(false);

    return loading ? (
        <BusyIndicator></BusyIndicator>
    ) : (
        <>
            <div className="stats-row">
                <div className="winrate-card">
                    <h1>Win rate</h1>
                    <span style={{fontSize: "24px"}}>51%</span>
                    <div className="winrate-bar-container">
                        <span>12 wins</span>
                        <div className="winrate-bar">
                            <div
                                style={{
                                    backgroundColor: "#f84982",
                                    height: "100%",
                                    width: "51%",
                                }}
                            ></div>
                        </div>
                        <span>13 losses</span>
                    </div>
                </div>
            </div>
            <div className="stats-row">
                <div className="winrate-card">
                    <h1>Win rate</h1>
                    <span style={{fontSize: "24px"}}>51%</span>
                    <div className="winrate-bar-container">
                        <span>12 wins</span>
                        <div className="winrate-bar">
                            <div
                                style={{
                                    backgroundColor: "#f84982",
                                    height: "100%",
                                    width: "51%",
                                }}
                            ></div>
                        </div>
                        <span>13 losses</span>
                    </div>
                </div>
            </div>
        </>
    );
}
