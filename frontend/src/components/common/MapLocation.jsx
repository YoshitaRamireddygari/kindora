import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { FaMapMarkerAlt, FaExternalLinkAlt, FaLocationArrow, FaCopy, FaEye, FaEyeSlash } from 'react-icons/fa';

export default function MapLocation({
    latitude,
    longitude,
    address,
    title = "Location Details",
    showMap = true,
    showViewButton = true,
    showOpenMapButton = true,
    showNavigationButton = true,
    height = "250px",
    isAdmin = false
}) {
    const [isMapVisible, setIsMapVisible] = useState(showMap);
    const [copySuccess, setCopySuccess] = useState(false);
    const [copyCoordsSuccess, setCopyCoordsSuccess] = useState(false);

    const hasCoordinates = latitude != null && longitude != null;

    const mapCenter = hasCoordinates ? [parseFloat(latitude), parseFloat(longitude)] : null;

    const encodedAddress = address ? encodeURIComponent(address) : '';
    const mapUrl = hasCoordinates 
        ? `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}` 
        : `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
        
    const navUrl = hasCoordinates 
        ? `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}` 
        : `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(address || '');
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    const handleCopyCoords = () => {
        if (hasCoordinates) {
            navigator.clipboard.writeText(`${latitude}, ${longitude}`);
            setCopyCoordsSuccess(true);
            setTimeout(() => setCopyCoordsSuccess(false), 2000);
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm flex flex-col md:flex-row">
            
            {/* Desktop: Address -> Map -> Buttons | Mobile: Address -> Buttons -> Map */}
            <div className="flex-1 p-6 flex flex-col">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2 text-primary">
                        <FaMapMarkerAlt className="text-xl" />
                        <h4 className="font-bold text-lg text-gray-800">{title}</h4>
                    </div>
                </div>

                <div className="mb-6 flex-1">
                    {address ? (
                        <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{address}</p>
                    ) : (
                        <p className="text-gray-400 italic">Address not provided</p>
                    )}
                </div>

                {isAdmin && hasCoordinates && (
                    <div className="bg-gray-50 p-3 rounded-xl mb-4 text-xs font-mono text-gray-500">
                        <div>Lat: {latitude}</div>
                        <div>Lng: {longitude}</div>
                    </div>
                )}

                <div className="flex flex-wrap gap-3 mt-auto order-last md:order-none">
                    {showViewButton && hasCoordinates && (
                        <button 
                            onClick={() => setIsMapVisible(!isMapVisible)}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl font-medium transition-colors text-sm border border-gray-200"
                        >
                            {isMapVisible ? <FaEyeSlash /> : <FaEye />} 
                            <span>{isMapVisible ? 'Hide Map' : 'View Map'}</span>
                        </button>
                    )}

                    {address && (
                        <button 
                            onClick={handleCopy}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl font-medium transition-colors text-sm border border-gray-200"
                        >
                            <FaCopy /> 
                            <span>{copySuccess ? 'Copied Address!' : 'Copy Address'}</span>
                        </button>
                    )}

                    {hasCoordinates && (
                        <button 
                            onClick={handleCopyCoords}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl font-medium transition-colors text-sm border border-gray-200"
                        >
                            <FaCopy /> 
                            <span>{copyCoordsSuccess ? 'Copied Coordinates!' : 'Copy Coordinates'}</span>
                        </button>
                    )}

                    {showOpenMapButton && (address || hasCoordinates) && (
                        <a 
                            href={mapUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl font-bold transition-colors text-sm"
                        >
                            <FaExternalLinkAlt /> Open in Maps
                        </a>
                    )}

                    {showNavigationButton && (address || hasCoordinates) && (
                        <a 
                            href={navUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-white hover:bg-secondary rounded-xl font-bold transition-colors text-sm"
                        >
                            <FaLocationArrow /> Navigate
                        </a>
                    )}
                </div>
            </div>

            {/* Map Section */}
            {isMapVisible && hasCoordinates && (
                <div className={`w-full md:w-[400px] border-t md:border-t-0 md:border-l border-gray-100 bg-gray-50 order-2 md:order-last z-0`} style={{ height }}>
                    <MapContainer
                        center={mapCenter}
                        zoom={15}
                        scrollWheelZoom={false}
                        style={{ width: '100%', height: '100%', zIndex: 0 }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={mapCenter} />
                    </MapContainer>
                </div>
            )}
        </div>
    );
}
