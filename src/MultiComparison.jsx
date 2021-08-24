import React from 'react'

import { getAllOptions } from './helpers/selections'
import Tile from "./Tile"
import { getShapeSize } from './shapes'
import { shapes, encodings } from './constants'

const MultiComparison = ({ selections}) => {
    const getSizeString = (shape) => {
        const {width, height} = getShapeSize(selections, shape)

        return `width: ${Math.round(width)}  height: ${Math.round(height)}`
    }

    return (
        <span className="d-flex flex-row">
            {Object.keys(encodings).map((encoding) => (
                <span className="flex-col" key={`x-${encoding}`}>
                    {Object.keys(shapes).map((shape) => (
                        <div
                            className='small'
                            key={`x-${shape} y-${encoding}`}
                        >
                            {/* {`shape: ${shape} encoding: ${encoding}`} */}
                            {getSizeString(shapes[shape].id)}
                            <Tile
                                encoding={encodings[encoding].id}
                                key={`shape: ${shape} encoding: ${encoding}`}
                                numX={Object.keys(shapes).length}
                                selections={selections}
                                shape={shapes[shape].id}
                            />
                        </div>
                    ))}
                </span>
            ))}
        </span>
    )
}

export default MultiComparison