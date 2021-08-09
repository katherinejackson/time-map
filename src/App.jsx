import React from 'react'
import './App.css';
import DataSelector from './DataSelector';

let options = window.options || { view: 'MAP', 'shape': 1 };

const App = () => (
    <DataSelector view={options.view} shape={options.shape} />
)

export default App;
