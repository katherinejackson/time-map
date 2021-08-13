import React, { useState } from 'react'

import { getAllOptions, getDefaultSelections } from './helpers/selections'
import Tile from "./Tile"

const Comparison = ({ selections, shape, encoding, x, y }) => {
    const options = getAllOptions(shape)

    if (!x || !y || !options[x] || !options[y]) {
        return null
    }

    const xOptions = options[x].values
    const yOptions = options[y].values

    return (
        <span className="d-flex flex-row">
            {xOptions.map((xval) => (
                <span className="flex-col" key={`x-${x}-${xval}`}>
                    {yOptions.map((yval) => (
                        <span
                            key={`x-${x}-${xval} y-${y}-${yval}`}
                            title={options[x].name + ': ' + xval + '  ' + options[y].name + ': ' + yval}
                        >
                            <Tile
                                encoding={encoding}
                                key={`xval: ${xval} yval: ${yval}`}
                                numX={xOptions.length}
                                selections={{ ...selections, [x]: xval, [y]: yval }}
                                shape={shape}
                            />
                        </span>
                    ))}
                </span>
            ))}
        </span>
    )
}

export default Comparison