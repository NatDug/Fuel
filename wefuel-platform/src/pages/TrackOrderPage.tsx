import React from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px"
};

const userPosition = { lat: -26.2041, lng: 28.0473 }; // Johannesburg
const driverPosition = { lat: -26.2023, lng: 28.0436 };

const TrackOrderPage: React.FC = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "YOUR_GOOGLE_MAPS_API_KEY" // Replace with your key
  });

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-8">
      <h2 className="text-2xl font-bold mb-4">Track Your Order</h2>
      <div className="w-full max-w-2xl">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={userPosition}
          zoom={13}
        >
          <Marker position={userPosition} label="You" />
          <Marker position={driverPosition} label="Driver" />
        </GoogleMap>
      </div>
      <div className="mt-6 p-4 bg-white rounded shadow max-w-2xl w-full">
        <div className="font-semibold">Order Status: </div>
        <div>Driver is on the way!</div>
      </div>
    </div>
  );
};

export default TrackOrderPage;