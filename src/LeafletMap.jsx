import React from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer } from "react-leaflet";

import Overlay from "./Overlay";

const initialCenter = [63, -149];   // alaska

// const initialCenter = [52, -103];  // sask

const mapWidth = window.options ? 1000 : window.innerWidth * 0.95
const mapHeight = window.innerHeight * 0.75

const style = {
    width: mapWidth,
    height: mapHeight
}

const LeafletMap = ({ selections, shape, encoding }) => {
    const theme = selections.theme

    return (
        <MapContainer
            center={initialCenter}
            scrollWheelZoom={false}
            style={style}
            zoom={4}
            zoomControl={false}
            zoomSnap={0.5}
        >
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
