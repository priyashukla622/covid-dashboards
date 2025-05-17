import React from 'react';


const formatNumber = (value) => {
  if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + 'M';
  } else if (value >= 1000) {
    return (value / 1000).toFixed(1) + 'K';
  }
  return value.toString();
};

const StatCard = ({ title, value, color }) => {
  const formattedValue = formatNumber(value);
  
  const getPercentage = () => {
    if (title === "Deaths") {
      return "0.007";
    }
    return "0.002";
  };
  
  return (
    <div className="stat-card" style={{ display: 'flex', borderRadius: '8px', overflow: 'hidden', margin: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <div className="stat-info" style={{ 
        backgroundColor: color, 
        padding: '8px',
        width: '150px',
        color: 'white'
      }}>
        <div className="stat-title" style={{ fontWeight: 'bold', fontSize: '16px' }}>{title}</div>
        <div className="stat-percentage" style={{ fontSize: '10px', opacity: 0.8 }}>{getPercentage()}%</div>
      </div>
      <div className="stat-value-container" style={{ 
        backgroundColor: 'white',
        padding: '8px',
        width: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div className="stat-value" style={{ fontWeight: 'bold', fontSize: '18px' }}>{formattedValue}</div>
      </div>
    </div>
  );
};
export default StatCard;

