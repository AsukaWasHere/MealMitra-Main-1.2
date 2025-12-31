import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { io } from "socket.io-client";
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import API from '../api';
import { useCart } from "../context/CartContext";

const socket = io("http://localhost:5001");

// --- MARKER ICONS ---
const donorIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const receiverIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const generalIcon = new L.Icon({
  iconUrl: 'https://img.icons8.com/emoji/48/000000/green-circle-emoji.png',
  iconSize: [40, 40],
});

// Routing Component with Hours/Mins Logic
function Routing({ waypoints, onRouteFound }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !waypoints || waypoints.length < 2) return;

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(waypoints[0][0], waypoints[0][1]), 
        L.latLng(waypoints[1][0], waypoints[1][1])  
      ],
      router: L.Routing.osrmv1({
        serviceUrl: 'https://router.project-osrm.org/route/v1',
        profile: 'car'
      }),
      lineOptions: {
        styles: [{ color: "#10b981", weight: 6, opacity: 0.8 }]
      },
      show: false,
      fitSelectedRoutes: true,
      createMarker: () => null,
    }).addTo(map);

    routingControl.on('routesfound', (e) => {
      const summary = e.routes[0].summary;
      const totalMinutes = Math.round(summary.totalTime / 60);
      const hours = Math.floor(totalMinutes / 60);
      const mins = totalMinutes % 60;
      const timeDisplay = hours > 0 ? `${hours}h ${mins}m` : `${mins} mins`;

      onRouteFound({
        distance: (summary.totalDistance / 1000).toFixed(1),
        time: timeDisplay
      });
    });

    return () => map.removeControl(routingControl);
  }, [map, waypoints, onRouteFound]);

  return null;
}

// Improved geocoding with fallback for broad addresses like "Tamil nadu"
const geocodeAddress = async (address) => {
  const apiKey = 'e809430e7727472da5e0607b1a3ee3ec';
  try {
    const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${apiKey}`);
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry;
      return [Number(lat), Number(lng)];
    }
    return [20.5937, 78.9629]; 
  } catch (error) {
    return [20.5937, 78.9629];
  }
};

const ListingPopup = ({ listing, onClaim }) => {
    const [qty, setQty] = useState(1);

    return (
        <div style={{ minWidth: '150px' }}>
            <h4 style={{ margin: '0 0 5px 0' }}>{listing.title}</h4>
            <p style={{ margin: '0 0 5px 0', fontSize: '12px' }}>By: {listing.donor?.name || 'User'}</p>
            <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', color: '#16a34a' }}>Available: {listing.quantity}</p>
            <div style={{ display: 'flex', gap: '5px' }}>
                <input 
                    type="number" value={qty} min="1" max={listing.quantity} 
                    onChange={(e) => setQty(Number(e.target.value))}
                    style={{ width: '50px', padding: '5px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
                <button 
                    onClick={() => onClaim(listing._id, qty)}
                    style={{ background: '#16a34a', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                >
                    Claim
                </button>
            </div>
        </div>
    );
};

export default function FoodMap({ routePoints = null }) {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [routeStats, setRouteStats] = useState({ distance: null, time: null });
  const { addToCart } = useCart();

  const fetchListings = useCallback(async () => {
    if (routePoints) return;
    
    setLoading(true);
    try {
      const { data } = await API.get('/api/listings');
      if (data.success) {
        const geocoded = await Promise.all(data.listings.map(async (l) => {
          const pos = await geocodeAddress(l.location);
          return { ...l, position: pos };
        }));
        setListings(geocoded);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [routePoints]);

  useEffect(() => {
    fetchListings();
    socket.on("update-listings", fetchListings); 
    return () => socket.off("update-listings");
  }, [fetchListings]);

  // UPDATED: handleClaim logic to remove items when quantity reaches 0
  const handleClaim = async (listingId, claimQuantity) => {
    try {
      const response = await API.post(`/api/listings/claim/${listingId}`, { claimQuantity });
      if (response.data.success) {
        const item = listings.find(l => l._id === listingId);
        if (item) {
          addToCart(item, claimQuantity, item.price || 0);
          
          // Update local state and REMOVE the item if quantity hits 0
          setListings(prev => prev
            .map(l => l._id === listingId ? { ...l, quantity: l.quantity - claimQuantity } : l)
            .filter(l => l.quantity > 0) // This line removes "Out of Stock" items from view
          );
        }
        alert(`✅ Added ${claimQuantity} servings to cart!`);
      }
    } catch (err) {
      alert("Error claiming item. Please try again.");
    }
  };

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>
      {routePoints && routeStats.distance && (
        <div style={{ position: 'absolute', top: '15px', left: '50%', transform: 'translateX(-50%)', zIndex: 1000, backgroundColor: 'white', padding: '10px 20px', borderRadius: '15px', border: '2px solid #10b981', display: 'flex', gap: '20px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
          <div><b>DISTANCE:</b> {routeStats.distance} km</div>
          <div><b>EST. TIME:</b> {routeStats.time}</div>
        </div>
      )}

      <MapContainer center={[22.5, 78.9]} zoom={5} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        
        {routePoints ? (
          <>
            <Routing waypoints={routePoints} onRouteFound={setRouteStats} />
            <Marker position={routePoints[0]} icon={receiverIcon} />
            <Marker position={routePoints[1]} icon={donorIcon} />
          </>
        ) : (
          listings.map(l => (
            <Marker key={l._id} position={l.position} icon={generalIcon}>
              <Popup><ListingPopup listing={l} onClaim={handleClaim} /></Popup>
            </Marker>
          ))
        )}
      </MapContainer>
    </div>
  );
}