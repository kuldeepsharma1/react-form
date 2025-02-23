import React from 'react';
import BasicForm from './components/BasicForm';

const App: React.FC = () => {
  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mt-4 mb-4">Basic Form Example</h1>
      <BasicForm />
    </div>
  );
};

export default App;
