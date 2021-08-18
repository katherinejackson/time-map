export const onClick = (val) => {
    if (window.itemClicked) {
        window.itemClicked(val)
    } else {
        console.log('The clicked item was ' + val)
    }
}

export const onHover = (val) => {
    if (window.itemHovered) {
        window.itemHovered(val)
    } else {
        console.log('The hovered item was ' + val)
    }
}

export const onZoom = (newZoom) => {
    if (window.onZoom) {
        window.onZoom(newZoom)
    } else {
        console.log('The new zoom level is ' + newZoom)
    }
}