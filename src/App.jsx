import React from 'react'

import './App.css';
import DataSelector from './DataSelector';

let view = 'MAP'

const App = () => {
    return (
        <DataSelector view={view} />
    );
}

export default App;
