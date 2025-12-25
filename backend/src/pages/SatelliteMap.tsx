import { MapContainer, TileLayer } from "react-leaflet";

const SatelliteMap = () => {
  return (
    <MapContainer
      center={[10.7867, 76.6548]} 
      zoom={13}
      style={{ height: "250px", width: "100%", borderRadius: "12px" }}
    >
      {/* Satellite imagery */}
      <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        attribution="Tiles © Esri"
      />
    </MapContainer>
  );
};

export default SatelliteMap;
