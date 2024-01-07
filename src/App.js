import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Registration from './components/Registration';
import Dashboard from './components/Dashboard';
import Logout from './components/Logout';
import IpoCalendar from './components/IpoCalendar';
import CurrencyExchangeRates from './components/CurrencyExchangeRates';
import axios from 'axios';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [ipoData, setIpoData] = useState([]);
  const [exchangeRates, setExchangeRates] = useState([]);

  useEffect(() => {
    const fetchIpoData = async () => {
      try {
        const response = await axios.get(
          'https://api.iex.cloud/v1/data/CORE/UPCOMING_IPOS/market?token=pk_9cc55ff7bf2148acb10e7592795eaa07'
        );

        setIpoData(response.data);
      } catch (error) {
        console.error('Error fetching IPO data:', error);
      }
    };

    fetchIpoData();
  }, []);

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await axios.get(
          'https://api.iex.cloud/v1/fx/latest?symbols=USDCAD,GBPUSD,USDJPY&token=pk_9cc55ff7bf2148acb10e7592795eaa07'
        );

        setExchangeRates(response.data);
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
      }
    };

    fetchExchangeRates();
  }, []);

 
  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <Router>
      <nav className="navbar">
        <div className="navbar-container">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/registration">Register</Link>
            </li>
            {user && (
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
            )}
            {user && (
              <li>
                <Link to="/logout">Logout</Link>
              </li>
            )}
          </ul>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/dashboard" />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
        <Route path="/registration" element={<Registration />} />
        <Route
          path="/dashboard"
          element={
            user ? (
              <Dashboard user={user} onLogout={handleLogout}  />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
         path="/dashboard/ipo-calendar"
         element={<IpoCalendar ipoData={ipoData} />}
        />
        <Route
          path="/dashboard/exchange-rates"
          element={<CurrencyExchangeRates exchangeRates={exchangeRates} />}
        />
        <Route
          path="/logout"
          element={<Logout onLogout={handleLogout} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
