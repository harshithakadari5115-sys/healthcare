import React from 'react';

function ProgressBar({ currentStep, totalSteps, steps }) {
  return (
    <div style={{ marginBottom: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        {steps.map((step, index) => (
          <div
            key={index}
            style={{
              flex: 1,
              textAlign: 'center',
              position: 'relative'
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: index < currentStep ? '#667eea' : index === currentStep ? '#667eea' : '#e0e0e0',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                fontWeight: 'bold',
                transition: 'all 0.3s'
              }}
            >
              {index < currentStep ? '✓' : index + 1}
            </div>
            <div
              style={{
                marginTop: '10px',
                fontSize: '12px',
                color: index <= currentStep ? '#667eea' : '#999',
                fontWeight: index === currentStep ? 'bold' : 'normal'
              }}
            >
              {step}
            </div>
          </div>
        ))}
      </div>
      
      <div
        style={{
          height: '4px',
          background: '#e0e0e0',
          borderRadius: '2px',
          position: 'relative',
          marginTop: '-30px',
          zIndex: -1
        }}
      >
        <div
          style={{
            height: '100%',
            background: '#667eea',
            borderRadius: '2px',
            width: `${(currentStep / (totalSteps - 1)) * 100}%`,
            transition: 'width 0.3s'
          }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;