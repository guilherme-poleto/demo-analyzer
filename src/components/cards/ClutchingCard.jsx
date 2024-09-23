import { useState } from "react";
import "./Cards.css";

export default function ClutchingCard(props) {
    const [activeTab, setActiveTab] = useState("Overall");
    const stats = props.stats;

    const CardContent = () => {
        if (stats.clutches[activeTab].total <= 0)
            return <div style={{ color: "#afa9bc" }}>NO DATA</div>;
        const successRate = Math.round(
            (stats.clutches[activeTab].success /
                stats.clutches[activeTab].total) *
                100
        );
        return (
            <>
                <div style={{ color: "#afa9bc" }}>WIN RATE</div>
                <div className="progress-bar-container">
                    <span
                        style={{
                            color: "#00b087",
                            fontSize: "25px",
                            fontWeight: "bold",
                        }}
                    >
                        {successRate}%
                    </span>
                    <span
                        style={{
                            color: "#de425b",
                            fontSize: "25px",
                            fontWeight: "bold",
                        }}
                    >
                        {100 - successRate}%
                    </span>
                </div>
                <div className="progress-bar">
                    <div
                        style={{
                            width: `${successRate}%`,
                            borderRight:
                                successRate > 0 ? "3px solid #24212b" : "0",
                        }}
                        className="success-bar"
                    ></div>
                </div>
                <div className="progress-bar-container">
                    <span style={{ color: "#afa9bc", fontSize: "12px" }}>
                        {`${stats.clutches[activeTab].success} CLUTCHES WON`}
                    </span>
                    <span style={{ color: "#afa9bc", fontSize: "12px" }}>
                        {`${
                            stats.clutches[activeTab].total -
                            stats.clutches[activeTab].success
                        } CLUTCHES LOST`}
                    </span>
                </div>
            </>
        );
    };

    return (
        <div className="card" style={{ padding: "15px 0px 0px 0px" }}>
            <h1 style={{marginBottom: "10px"}}>Clutches</h1>
            <div className="tabs">
                <CardTab
                    tab="Overall"
                    setTab={[activeTab, setActiveTab]}
                ></CardTab>
                <CardTab tab="1v1" setTab={[activeTab, setActiveTab]}></CardTab>
                <CardTab tab="1v2" setTab={[activeTab, setActiveTab]}></CardTab>
                <CardTab tab="1v3" setTab={[activeTab, setActiveTab]}></CardTab>
                <CardTab tab="1v4" setTab={[activeTab, setActiveTab]}></CardTab>
                <CardTab tab="1v5" setTab={[activeTab, setActiveTab]}></CardTab>
            </div>
            <div className="card-content">
                {activeTab === "Overall" && <CardContent></CardContent>}
                {activeTab === "1v1" && <CardContent></CardContent>}
                {activeTab === "1v2" && <CardContent></CardContent>}
                {activeTab === "1v3" && <CardContent></CardContent>}
                {activeTab === "1v4" && <CardContent></CardContent>}
                {activeTab === "1v5" && <CardContent></CardContent>}
            </div>
        </div>
    );
}

const CardTab = (props) => {
    const tab = props.tab;
    const [activeTab, setActiveTab] = props.setTab;

    return (
        <button
            className={`tab-button ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
        >
            {tab}
        </button>
    );
};
