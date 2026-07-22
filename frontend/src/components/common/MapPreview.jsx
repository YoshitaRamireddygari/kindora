import React from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

export default function MapPreview({ lat, lng, height = '200px', width = '100%' }) {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: GOOGLE_MAPS_API_KEY
    });

    const containerStyle = { width, height };
    
    // Fallback coordinates if lat/lng are missing
    const center = (lat && lng) ? { lat, lng } : { lat: 20.5937, lng: 78.9629 };

    if (!isLoaded) return <div className={`w-full bg-gray-50 rounded-xl text-center text-gray-400 flex items-center justify-center animate-pulse`} style={{ height }}>Loading Map...</div>;

    return (
        <div className="rounded-xl overflow-hidden border border-gray-200 shadow-inner relative z-0" style={{ height, width }}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={(lat && lng) ? 15 : 4}
                options={{ disableDefaultUI: true, zoomControl: true }}
            >
                {lat && lng && (
                    <Marker position={{ lat, lng }} />
                )}
            </GoogleMap>
        </div>
    );
}
