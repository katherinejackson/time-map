import React from 'react'

import { getAllOptions } from './helpers/selections'
import Tile from "./Tile"
import { getShapeSize } from './shapes'

const Comparison = ({ selections, shape, encoding, x, y }) => {
    const options = getAllOptions(shape)

    if (!x || !y || !options[x] || !options[y]) {
        return null
    }

    const xOptions = options[x].values
    const yOptions = options[y].values

    const getSizeString = (xval, yval) => {
        const {width, height} = getShapeSize({ ...selections, [x]: xval, [y]: yval }, shape)

        return `width: ${Math.round(width)}  height: ${Math.round(height)}`
    }

    return (
        <span className="d-flex flex-row">
            {xOptions.map((xval) => (
                <span className="flex-col" key={`x-${x}-${xval}`}>
                    {yOptions.map((yval) => (
                        <div
                            className='small'
                            key={`x-${x}-${xval} y-${y}-${yval}`}
                            // title={options[x].name + ': ' + xval + '  ' + options[y].name + ': ' + yval }
                        >
                            {options[x].name + ': ' + xval + '  ' + options[y].name + ': ' + yval + '  '}
                            {getSizeString(xval, yval)}
                            <Tile
                                encoding={encoding}
                                key={`xval: ${xval} yval: ${yval}`}
                                numX={xOptions.length}
                                selections={{ ...selections, [x]: xval, [y]: yval }}
                                shape={shape}
                            />
                        </div>
                    ))}
                </span>
            ))}
        </span>
    )
}

export default Comparison