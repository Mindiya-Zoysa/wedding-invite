import React, { useState } from 'react';
import HeartCover from './components/HeartCover';
import Envelope from './components/Envelope'; // Make sure this file exists from before
import MainPage from './components/MainPage';

function App() {
  const [step, setStep] = useState('heart');

  return (
    <div className="App">
      {step === 'heart' && (
        <HeartCover onFinish={() => setStep('envelope')} />
      )}
      
      {step === 'envelope' && (
        <Envelope onComplete={() => setStep('main')} />
      )}

      {step === 'main' && (
        <MainPage /> 
      )}
    </div>
  );
}

export default App;