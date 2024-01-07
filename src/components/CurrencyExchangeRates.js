import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './commonStyles.css';

const CurrencyExchangeRates = () => {
  const [exchangeRates, setExchangeRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchExchangeRates = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        'https://api.iex.cloud/v1/fx/latest?symbols=USDCAD,GBPUSD,USDJPY&token=pk_9cc55ff7bf2148acb10e7592795eaa07'
      );
      setExchangeRates(response.data);
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
      setError('Error fetching exchange rates. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExchangeRates(); 

    const intervalId = setInterval(() => {
      fetchExchangeRates(); // Fetch data every 10 seconds
    }, 10000);

    return () => clearInterval(intervalId); 
  }, []);

  const handleRefresh = () => {
    fetchExchangeRates(); 
  };

  return (
    <div className="container">
      <h2>Currency Exchange Rates</h2>
      {loading ? (
        <p>Loading exchange rates...</p>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>Currency Pair</th>
                <th>Last Price</th>
              </tr>
            </thead>
            <tbody>
              {exchangeRates.map((rate) => (
                <tr key={rate.symbol}>
                  <td>{rate.symbol}</td>
                  <td>{rate.rate}</td>
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

export default CurrencyExchangeRates;
