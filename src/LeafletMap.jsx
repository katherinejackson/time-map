import React, { useContext } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer } from "react-leaflet";

import Overlay from "./Overlay";
import SelectionContext from "./SelectionContext";

const initialCenter = [52, -103];

const mapWidth = window.innerWidth * 0.95
const mapHeight = window.innerHeight * 0.75

const style = {
    width: mapWidth,
    height: mapHeight
}

const LeafletMap = ({ }) => {
    const { darkMode } = useContext(SelectionContext)
    
    return (
        <div className="position-relative">
            <MapContainer
                center={initialCenter}
                style={style}
                zoom={6}
                zoomControl={false}
                zoomSnap={0.5}
            >
                {darkMode ? <DarkMap /> : <DefaultMap />}
                <Overlay />
            </MapContainer>
        </div>
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
        url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
    />
)

export default LeafletMap
