
const FilterPanel = ({
    axis,
    format,
    handleSelect,
    handleAxisSelect,
    handlePinCheck,
    pinView,
    selections,
    variables
}) => (
    <div className="container row row-col-2 mt-3">
        {axis ? (
            <div class="col">
                <div className="row mb-2">
                    <div className="col d-flex justify-content-end">
                        <label for="x-axis" class="col-form-label w-auto">x-axis</label>
                    </div>
                    <div className="col">
                        <select class="form-select" defaultValue="select" id='x-axis' onChange={(e) => handleAxisSelect(e, 'x-axis')} name='x-axis'>
                            <option disabled value="select" id="select-x"> -- select an option -- </option>
                            {Object.keys(variables).map(id => <option key={`x-axis-${id}`} value={id}>{variables[id].name}</option>)}
                        </select>
                    </div>
                </div>
                <div className="row mb-2">
                    <div className="col d-flex justify-content-end">
                        <label for="y-axis" class="col-form-label w-auto">y-axis</label>
                    </div>
                    <div className="col">
                        <select class="form-select" defaultValue="select" id='y-axis' onChange={(e) => handleAxisSelect(e, 'y-axis')} name='y-axis'>
                            <option disabled value="select" id="select-y"> -- select an option -- </option>
                            {Object.keys(variables).map(id => <option key={`y-axis-${id}`} value={id}>{variables[id].name}</option>)}
                        </select>
                    </div>
                </div>
            </div>
        ) : null}

<div className="flex col justify-content-center gap-3">
    {Object.keys(variables).map(id => (
        <div className="row mb-2" key={`${format}-${id}`}>
            <div className="col d-flex justify-content-end">
                <label class="form-label" htmlFor={`${format}-${id}`}>{variables[id].name}</label>
            </div>
            <div className="col">
                <select
                    className="form-select w-50"
                    defaultValue={selections[id]}
                    disabled={axis ? axis["x-axis"] === parseInt(id) || axis["y-axis"] === parseInt(id) : false}
                    id={`${format}-${id}`}
                    key={`${format}-${id}-${Math.random().toString().slice(0, 6)}`}
                    onChange={(e) => handleSelect(e, id)}
                    name={variables[id].name}
                >
                    {variables[id].values.map(val => <option id={`${id}-${val}`} key={`${id}-${val}`} value={val}>{val}</option>)}
                </select>
            </div>
        </div>
    ))}

    <div className="row">
        <div className="col d-flex justify-content-end">
            <label lass="col col-form-label w-auto">View as map pin</label>
        </div>
        <div className="col">
            <input class="form-check" type="checkbox" defaultChecked={pinView} onChange={handlePinCheck} />
        </div>
    </div>
</div>
    </div >
)

export default FilterPanel
