import React, { useContext } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer } from "react-leaflet";

import Overlay from "./Overlay";
import SelectionContext from "./SelectionContext";
import { themes } from "./constants";

const initialCenter = [63, -149];   // alaska

// const initialCenter = [52, -103];  // sask

const mapWidth = 1000
const mapHeight = window.innerHeight * 0.75

const style = {
    width: mapWidth,
    height: mapHeight
}

const LeafletMap = ({ }) => {
    const { theme } = useContext(SelectionContext)

    return (
        <MapContainer
            center={initialCenter}
            style={style}
            zoom={4}
            zoomControl={false}
            zoomSnap={0.5}
        >
            {theme === themes.DEFAULT.val ? <DefaultMap /> : null}
            {theme === themes.DARK.val ? <DarkMap /> : null}
            {theme === themes.COLOUR_DARK.val ? <ColourDarkMap /> : null}
            <Overlay />
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
