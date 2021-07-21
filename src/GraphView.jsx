import React from 'react'

import NodeGraph from "./NodeGraph"
import EdgeGraph from "./EdgeGraph"
import DoubleGraph from "./DoubleGraph"
import BridgeGraph from "./BridgeGraph"

const GraphView = ({ }) => (
        <div>
             <BridgeGraph />
             <EdgeGraph /> 
             <NodeGraph />
             <DoubleGraph />
        </div>
    )

export default GraphView