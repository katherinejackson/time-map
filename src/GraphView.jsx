import React from 'react'

import NodeGraph from "./NodeGraph"
import EdgeGraph from "./EdgeGraph"
import DoubleGraph from "./DoubleGraph"
import BridgeGraph from "./BridgeGraph"

const GraphView = () => (
        <div className="py-8">
             <BridgeGraph />
             <br />
             <EdgeGraph /> 
             <br />
             <NodeGraph />
             <br />
             <DoubleGraph />
        </div>
    )

export default GraphView