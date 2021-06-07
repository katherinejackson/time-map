function textDecoder(text) {
    let locations = []
    const lines = text.split("\n")
    lines.forEach((line, index) => {
        const vals = line.split(',')
        locations.push({
            id: index,
            name: vals[0],
            x: parseFloat(vals[1]),
            y: parseFloat(vals[2])
        })
    })

    return locations;
}

export default textDecoder