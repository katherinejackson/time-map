import React from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer } from "react-leaflet";

import Overlay from "./Overlay";

const practice = window.options?.practice

const style = {
    width: window.options ? 1000 : window.innerWidth * 0.95,
    height: window.innerHeight * 0.75
}

const mapOptions = {
    center: practice ? [62, -137] : [63, -149],
    scrollWheelZoom: false,
    style: style,
    zoom: practice ? 5 : 4,
    zoomControl: false,
    zoomSnap: 0.5,
}


const LeafletMap = ({ selections, shape, encoding }) => {
    const theme = selections.theme

    return (
        <MapContainer { ...mapOptions } >
            {theme === 'DEFAULT' ? <DefaultMap /> : null}
            {theme === 'DARK' ? <DarkMap /> : null}
            {theme === 'COLOUR_DARK' ? <ColourDarkMap /> : null}
            <Overlay encoding={encoding} selections={selections} shape={shape} />
        </MapContainer>
    );
}

const DefaultMap = () => (
    <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
)

const DarkMap = () => (
    <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        className="dark-unsaturated-map"
    />
)

const ColourDarkMap = () => (
    <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        className="dark-saturated-map"
    />
)

export default LeafletMap
