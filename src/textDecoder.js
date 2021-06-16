function textDecoder(text) {
    let locations = []
    const lines = text.split("\n")
    lines.forEach((line, index) => {
        const vals = line.split(',')
        locations.push({
            id: vals[0],
            name: vals[1],
            x: parseFloat(vals[2]),
            y: parseFloat(vals[3])
        })
    })

    return locations;
}

export default textDecoder