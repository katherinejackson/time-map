import React from 'react'

import { shapes, encodings } from './constants'

const ViewSelector = ({ encoding, handleShapeChange, handleEncodingChange, shape }) => (
    <div className="row justify-content-center gap-3">
        <label className="col-form-label w-auto">Shape</label>
        <select className="form-select w-auto" defaultValue={shape} onChange={handleShapeChange} name="Display type">
            {Object.keys(shapes).map(shape => <option key={`shape-${shapes[shape].id}`} value={shapes[shape].id}>{shapes[shape].name}</option>)}
        </select>

        <label className="col-form-label w-auto">Encoding</label>
        <select className="form-select w-auto" defaultValue={encoding} onChange={handleEncodingChange} name="Display type">
            {Object.keys(encodings).map(e => <option key={`shape-${encodings[e].id}`} value={encodings[e].id}>{encodings[e].name}</option>)}
        </select>
    </div>

)

export default ViewSelector