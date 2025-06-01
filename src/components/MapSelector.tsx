import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useState } from 'react';
import L from 'leaflet';

interface MapSelectorProps {
  onLocationSelect: (value: string) => void;
}

const MapSelector: React.FC<MapSelectorProps> = ({ onLocationSelect }) => {
  const [position, setPosition] = useState<[number, number] | null>(null);

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        const pos: [number, number] = [lat, lng];
        setPosition(pos);
        onLocationSelect(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
      },
    });

    return position === null ? null : (
      <Marker position={position} icon={L.icon({ iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png' })} />
    );
  };

  return (
    <div className="h-64 w-full">
      <MapContainer center={[51.505, -0.09]} zoom={13} className="h-full w-full" scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker />
      </MapContainer>
    </div>
  );
};

export default MapSelector;
