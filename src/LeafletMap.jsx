import React from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer } from "react-leaflet";

import Overlay from "./Overlay";

const initialCenter = [52, -103];

const mapWidth = window.innerWidth * 0.95
const mapHeight = window.innerHeight * 0.75

const style = {
    width: mapWidth,
    height: mapHeight
}

const LeafletMap = ({}) => {
    return (
        <div className="position-relative">
            <MapContainer
                center={initialCenter}
                style={style}
                zoom={6}
                zoomControl={false}
                zoomSnap={0.5}
            >
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Overlay />
            </MapContainer>
        </div>
    );
}

export default LeafletMap
