import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './commonStyles.css';

const IpoCalendar = () => {
  const [ipoData, setIpoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchIpoData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        'https://api.iex.cloud/v1/data/CORE/UPCOMING_IPOS/market?token=pk_9cc55ff7bf2148acb10e7592795eaa07'
      );
      setIpoData(response.data);
    } catch (error) {
      console.error('Error fetching IPO data:', error);
      setError('Error fetching IPO data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIpoData();

    const intervalId = setInterval(() => {
      fetchIpoData(); // Fetch data every 10 seconds
    }, 10000);

    return () => clearInterval(intervalId); 
  }, []);

  const handleRefresh = () => {
    fetchIpoData(); 
  };

  return (
    <div className="container">
      <h2>IPO Calendar</h2>
      {loading ? (
        <p>Loading IPO data...</p>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>Company Name</th>
                <th>Symbol</th>
              </tr>
            </thead>
            <tbody>
              {ipoData.map((ipo) => (
                <tr key={ipo.id}>
                  <td>{ipo.companyName}</td>
                  <td>{ipo.symbol}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleRefresh}>Refresh</button>
          <br />
          <br />
          <Link to="../dashboard">Back to Dashboard</Link>
        </>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default IpoCalendar;
