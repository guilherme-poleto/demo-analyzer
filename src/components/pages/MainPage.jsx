import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Utils from '../../utils/Utils';
import './MainPage.css'
import { AppContext } from '../AppContext';

export default function MainPage() {
  const navigate = useNavigate();
  const { sharedValue, setSharedValue } = useContext(AppContext);

  const [currMatches, setCurrMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    Promise.all([Utils.getLastMatches(), Utils.getDownloadedMatches()])
      .then(res => {
        const lastRoundData = Utils.getLastRoundData(res[0].data, res[1].data);
        console.log(lastRoundData);
        setCurrMatches(lastRoundData);
      })
      .catch(err => {
        setError(true);
        throw new Error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDownloadButton = async (matchData) => {
    if (matchData.isDownloaded) {

    } else {
      setLoading(true);
      await Utils.downloadDemo(matchData.map);
      matchData.isDownloaded = true;
      const updatedMatches = currMatches.map((item) =>
        item.ID === matchData.ID ? { ...item, isDownloaded: true } : item
      );
      setCurrMatches(updatedMatches);
      setLoading(false);
    }
  }

  if (error) return <div>Error</div>;

  return loading ? <div>Loading...</div> :
    <>
      <div className='match-list-container'>
        <table className='match-list'>
          <thead>
            <tr className='row'>
              <th className='start'>Score</th>
              <th>Kills</th>
              <th>Deaths</th>
              <th>K/D</th>
              <th>Duration</th>
              <th className='end'></th>
            </tr>
          </thead>
          <tbody>
            {currMatches.map((match, index) => {
              return (
                <tr key={index} className='row' style={{cursor: match.isDownloaded ? 'pointer' : 'default'}}>
                  <td className='start'>{Utils.buildResultString(match.teamScores)}</td>
                  <td>{match.playerScore.kills}</td>
                  <td>{match.playerScore.deaths}</td>
                  <td>{match.playerScore.KD}</td>
                  <td>{match.matchDuration} minutes</td>
                  <td className='end'>
                    <button
                      onClick={() => handleDownloadButton(match)}>
                      {match.isDownloaded ? '>' : 'Download'}
                    </button>
                  </td>
                </tr>)
            })}
          </tbody>
        </table>
      </div>
    </>
}
