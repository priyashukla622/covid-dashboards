import React, { useState, useEffect } from 'react';
import { fetchHistoricalData, fetchCountryData, fetchCountries } from '../pages/api';
import { processHistoricalData, processPieChartData } from '../utils/helpers';
import CountryDropdown from './Country';
import DateRangePicker from './DateRange';
import StatCard from './StatCard';
import LineChart from './LineChart';
import PieChart from './PieChart';
import './Dashboard.css';

const Dashboard = () => {

  const [selectedCountry, setSelectedCountry] = useState({ value: 'usa', label: 'Search Country' });
  const [countries, setCountries] = useState([]);
  const [historicalData, setHistoricalData] = useState(null);
  const [countryData, setCountryData] = useState(null);
  const [processedData, setProcessedData] = useState(null);
  const [pieChartData, setPieChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    start: '2020-10-24',
    end: '2023-12-06'
  });


  useEffect(() => {
    const getCountries = async () => {
      try {
        const countriesList = await fetchCountries();
        setCountries(countriesList);
      } catch (err) {
        setError('Failed to fetch countries');
        console.error(err);
      }
    };
    
    getCountries();
  }, []);

  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [historicalResponse, countryResponse] = await Promise.all([
          fetchHistoricalData(selectedCountry.value),
          fetchCountryData(selectedCountry.value)
        ]);
        
        setHistoricalData(historicalResponse);
        setCountryData(countryResponse);
        setError(null);
      } catch (err) {
        setError(`Failed to fetch data for ${selectedCountry.label}`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    if (selectedCountry) {
      fetchData();
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (historicalData) {
      const processed = processHistoricalData(historicalData, dateRange);
      setProcessedData(processed);
    }
    
    if (countryData) {
      const pieData = processPieChartData(countryData);
      setPieChartData(pieData);
    }
  }, [historicalData, countryData, dateRange]);

  
  const handleCountryChange = (country) => {
    setSelectedCountry(country);
  };

  const handleDateRangeChange = (range) => {
    setDateRange(range);
  };

  return (
    <div className="dashboard">
        <div className='main-dashboard'>
        <h1>COVID-19 and Population Dashboard</h1>
      
        <div className="dashboard-filters">
        <CountryDropdown 
          countries={countries} 
          selectedCountry={selectedCountry} 
          onChange={handleCountryChange} 
        />
        
        <DateRangePicker 
          dateRange={dateRange} 
          onChange={handleDateRangeChange} 
        />
      </div>
      
      {loading ? (
        <div className="loading">Loading data...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <>
          <div className="stat-cards">
            <StatCard 
              title="Total Cases" 
              value={countryData?.cases || 0} 
              color="#b4b7ff" 
             
            />
            <StatCard 
              title="Recoveries" 
              value={countryData?.recovered || 0} 
              color="#70e094" 
              
            />
            <StatCard 
              title="Deaths" 
              value={countryData?.deaths || 0} 
              color="#ff7878" 
             
            />
          </div>
          
          <div className="charts-container">
            <div className="chart">
              <h2 className='lineChart'>Line Chart</h2>
              <LineChart data={processedData} />
            </div>
            
            <div className="chart">
              <h2 className='pieChart'>Pie Chart</h2>
              <PieChart data={pieChartData} />
            </div>
          </div>
        </>
      )}
        </div>
    </div>
  );
};
export default Dashboard;