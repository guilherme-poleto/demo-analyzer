import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Utils from "../../utils/Utils";
import "./MainPage.css";

export default function MainPage(props) {
    const navigate = useNavigate();

    const [currMatches, setCurrMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        Utils.getLastMatches()
            .then((res) => {
                const matchesData = Utils.getLastRoundData(res.data);
                console.log(matchesData);
                setCurrMatches(matchesData);
            })
            .catch((err) => {
                setError(true);
                throw err;
            })
            .finally(() => setLoading(false));
    }, []);

    const handleAnalyzeButton = async (matchData) => {
        if (matchData.isAnalyzed) {
            navigate(`/match-details/${matchData.ID}`, { state: matchData });
        } else {
            setLoading(true);
            await Utils.analyzeMatch(matchData.ID);
            matchData.isAnalyzed = true;
            const updatedMatches = currMatches.map((item) =>
                item.ID === matchData.ID ? { ...item, isAnalyzed: true } : item
            );
            setCurrMatches(updatedMatches);
            setLoading(false);
        }
    };

    const handleFetchClick = async () => {
        await Utils.fetchLastMatches();
        await Utils.getLastMatches();
    };

    if (error) return <div>Error</div>;

    return loading ? (
        <div>Loading...</div>
    ) : (
        <>
            <div className="main">
                <div className="match-list-container">
                    <table className="match-list">
                        <thead>
                            <tr className="row">
                                <th className="start">Score</th>
                                <th>Kills</th>
                                <th>Deaths</th>
                                <th>K/D</th>
                                <th>Date</th>
                                <th className="end"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {currMatches.map((match, index) => {
                                return (
                                    <tr
                                        key={index}
                                        className="row"
                                        style={{
                                            cursor: match.isAnalyzed
                                                ? "pointer"
                                                : "default",
                                        }}
                                    >
                                        <td className="start">
                                            {Utils.buildResultString(
                                                match.teamScores
                                            )}
                                        </td>
                                        <td>{match.playerScore.kills}</td>
                                        <td>{match.playerScore.deaths}</td>
                                        <td>{match.playerScore.KD}</td>
                                        <td>{match.date}</td>
                                        <td className="end">
                                            <button
                                                onClick={() =>
                                                    handleAnalyzeButton(match)
                                                }
                                            >
                                                {match.isAnalyzed
                                                    ? ">"
                                                    : "Analyze"}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    <button onClick={handleFetchClick}>Fetch</button>
                </div>
            </div>
        </>
    );
}
