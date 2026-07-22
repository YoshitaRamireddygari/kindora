import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { FaMapMarkerAlt, FaCrosshairs, FaSearch } from 'react-icons/fa';

const defaultCenter = {
    lat: 20.5937,
    lng: 78.9629 // Center of India
};

export default function LocationSelector({ onLocationSelect, initialLocation }) {
    const [location, setLocation] = useState(initialLocation || null);
    const [addressText, setAddressText] = useState(initialLocation?.address || '');
    const [searchInput, setSearchInput] = useState(initialLocation?.address || '');
    const [loading, setLoading] = useState(false);
    const [loadingText, setLoadingText] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    
    // Map controller to center map and handle clicks
    function MapEvents() {
        const map = useMapEvents({
            click(e) {
                fetchAddressFromCoordinates(e.latlng.lat, e.latlng.lng);
            }
        });
        
        useEffect(() => {
            if (location) {
                map.flyTo([location.lat, location.lng], map.getZoom());
            }
        }, [location?.lat, location?.lng, map]);
        return null;
    }

    useEffect(() => {
        if (initialLocation) {
            setLocation(initialLocation);
            setAddressText(initialLocation.address || '');
            setSearchInput(initialLocation.address || '');
        }
    }, [initialLocation]);

    const extractAddressDetails = (addressData) => {
        if (!addressData) return {};
        
        return {
            city: addressData.city || addressData.town || addressData.village || '',
            district: addressData.county || addressData.state_district || '',
            state: addressData.state || '',
            country: addressData.country || '',
            pincode: addressData.postcode || ''
        };
    };

    // Reverse Geocode (Lat/Lng -> Address) using Nominatim
    const fetchAddressFromCoordinates = async (lat, lng) => {
        setLoading(true);
        setLoadingText('📍 Fetching address...');
        setErrorMsg('');
        
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
            const data = await res.json();
            
            const fullAddress = data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
            const details = extractAddressDetails(data.address);
            
            const newLocation = { 
                lat, 
                lng, 
                address: fullAddress,
                fullAddress,
                ...details
            };
            
            setLocation(newLocation);
            setAddressText(fullAddress);
            setSearchInput(fullAddress);
            onLocationSelect(newLocation);
        } catch (error) {
            console.error("Reverse geocoding failed", error);
            const fallbackAddress = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
            const newLocation = { lat, lng, address: fallbackAddress, fullAddress: fallbackAddress };
            
            setLocation(newLocation);
            setAddressText(fallbackAddress);
            setSearchInput(fallbackAddress);
            onLocationSelect(newLocation);
            setErrorMsg('Address not found. Using coordinates instead.');
        } finally {
            setLoading(false);
            setLoadingText('');
        }
    };

    // Forward Geocode (Address -> Lat/Lng) using Nominatim
    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        if (!searchInput.trim()) return;
        
        setLoading(true);
        setLoadingText('📍 Searching address...');
        setErrorMsg('');
        
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchInput)}&limit=1&addressdetails=1`);
            const data = await res.json();
            
            if (data && data.length > 0) {
                const lat = parseFloat(data[0].lat);
                const lng = parseFloat(data[0].lon);
                const fullAddress = data[0].display_name;
                const details = extractAddressDetails(data[0].address);
                
                const newLocation = { 
                    lat, 
                    lng, 
                    address: fullAddress,
                    fullAddress,
                    ...details
                };
                
                setLocation(newLocation);
                setAddressText(fullAddress);
                setSearchInput(fullAddress);
                onLocationSelect(newLocation);
            } else {
                setErrorMsg("Address not found. Try a different search term.");
            }
        } catch (error) {
            console.error("Search failed", error);
            setErrorMsg("Error searching for location. Please try again.");
        } finally {
            setLoading(false);
            setLoadingText('');
        }
    };

    const handleCurrentLocation = () => {
        if (navigator.geolocation) {
            setLoading(true);
            setLoadingText('📍 Detecting your location...');
            setErrorMsg('');
            
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    fetchAddressFromCoordinates(lat, lng);
                },
                (error) => {
                    console.error("Geolocation error:", error);
                    setErrorMsg("Location permission denied. Please search manually or enable location services.");
                    setLoading(false);
                    setLoadingText('');
                }
            );
        } else {
            setErrorMsg("Geolocation is not supported by your browser.");
        }
    };

    const markerRef = useRef(null);
    
    const eventHandlers = useMemo(
        () => ({
            dragend() {
                const marker = markerRef.current;
                if (marker != null) {
                    const position = marker.getLatLng();
                    fetchAddressFromCoordinates(position.lat, position.lng);
                }
            },
        }),
        []
    );

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative flex">
                    <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
                    <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSearch(); } }}
                        placeholder="Search for an address..."
                        className="w-full pl-10 pr-24 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-gray-700 shadow-sm"
                        disabled={loading}
                    />
                    <button 
                        type="button"
                        onClick={handleSearch}
                        disabled={loading}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                    >
                        <FaSearch size={12} /> Search
                    </button>
                </div>
                <button
                    type="button"
                    onClick={handleCurrentLocation}
                    disabled={loading}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-primary/10 text-primary font-bold rounded-xl hover:bg-primary/20 transition-colors whitespace-nowrap disabled:opacity-50"
                >
                    <FaCrosshairs /> Use Current
                </button>
            </div>

            {loadingText && (
                <div className="text-sm font-medium text-blue-600 bg-blue-50 p-3 rounded-xl border border-blue-100 animate-pulse">
                    {loadingText}
                </div>
            )}
            
            {errorMsg && (
                <div className="text-sm font-medium text-red-600 bg-red-50 p-3 rounded-xl border border-red-100">
                    {errorMsg}
                </div>
            )}

            <div className="rounded-xl overflow-hidden border border-gray-200 shadow-inner relative z-0" style={{ height: '300px' }}>
                <MapContainer
                    center={location ? [location.lat, location.lng] : [defaultCenter.lat, defaultCenter.lng]}
                    zoom={location ? 15 : 4}
                    scrollWheelZoom={false}
                    style={{ width: '100%', height: '100%', zIndex: 0, cursor: 'crosshair' }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapEvents />
                    
                    {location && (
                        <Marker 
                            position={[location.lat, location.lng]} 
                            draggable={true}
                            eventHandlers={eventHandlers}
                            ref={markerRef}
                        />
                    )}
                </MapContainer>
            </div>
            
            <p className="text-xs text-gray-500 italic mt-2">
                Tip: You can click anywhere on the map or drag the marker to pinpoint your exact location.
            </p>
        </div>
    );
}
