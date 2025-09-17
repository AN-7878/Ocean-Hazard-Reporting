import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const houseIconUrl = '/house.png'; // place in public folder
mapboxgl.accessToken = 'pk.eyJ1IjoicHJhbmphbGlpaSIsImEiOiJjbWY5Z3N1a3owMXdqMmlzY3Nzc2t6Y3hyIn0.gfBZwn2BJlRD8QqCeC7kJQ';

interface Shelter {
  id: number;
  name: string;
  address: string;
  capacity: number;
  available: number;
  contact: string;
  distance: string;
  facilities: string[];
  lat: number;
  lng: number;
}

interface Props {
  shelters: Shelter[];
}

const DisasterMap: React.FC<Props> = ({ shelters }) => {
  const [selectedMap, setSelectedMap] = useState<'hazard' | 'reports'>('hazard');
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Destroy existing map instance when switching
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [80.2707, 13.0827],
      zoom: 5,
    });

    map.on('load', () => {
      if (selectedMap === 'hazard') {
        // Ocean hazards layer
        map.addSource('oceanHazards', {
          type: 'geojson',
          data: '/ocean_hazards.geojson',
        });

        map.addLayer({
          id: 'ocean-hazard-layer',
          type: 'fill',
          source: 'oceanHazards',
          paint: {
            'fill-color': [
              'match',
              ['get', 'zone'],
              'Very High', '#7f1d1d',
              'High', '#f97316',
              'Moderate', '#facc15',
              'Low', '#22c55e',
              '#ccc',
            ],
            'fill-opacity': 0.5,
          },
        });

        map.addLayer({
          id: 'ocean-hazard-borders',
          type: 'line',
          source: 'oceanHazards',
          paint: {
            'line-color': '#ccc',
            'line-width': 1,
          },
        });

        // Hover popup for hazards
        const hazardPopup = new mapboxgl.Popup({ closeButton: false, closeOnClick: false });
        map.on('mousemove', 'ocean-hazard-layer', (e) => {
          const feature = e.features && e.features[0];
          if (!feature) return;
          const props = feature.properties as any;
          const html = `
            <div style="font-size:12px;">
              <strong>${props.name || 'Location'}</strong><br/>
              Zone: ${props.zone || '-'}<br/>
              Buildings: ${props.buildings || '-'}<br/>
              Population: ${props.population || '-'}
            </div>
          `;
          hazardPopup.setLngLat((e as any).lngLat).setHTML(html).addTo(map);
        });
        map.on('mouseleave', 'ocean-hazard-layer', () => {
          hazardPopup.remove();
        });

        // Add shelters only on hazard map
        shelters.forEach((shelter) => {
          const el = document.createElement('div');
          el.style.backgroundImage = `url(${houseIconUrl})`;
          el.style.width = '32px';
          el.style.height = '32px';
          el.style.backgroundSize = 'cover';
          el.style.backgroundRepeat = 'no-repeat';
          el.style.cursor = 'pointer';

          new mapboxgl.Marker(el)
            .setLngLat([shelter.lng, shelter.lat])
            .setPopup(
              new mapboxgl.Popup({ offset: 25 }).setHTML(`
                <strong>${shelter.name}</strong><br/>
                📍 ${shelter.address}<br/>
                Capacity: ${shelter.capacity}<br/>
                Available: ${shelter.available}<br/>
                ☎ ${shelter.contact}
              `),
            )
            .addTo(map);
        });
      } else if (selectedMap === 'reports') {
        // Reports layer
        map.addSource('reports', {
          type: 'geojson',
          data: '/reports.geojson',
        });

        map.addLayer({
          id: 'reports-layer',
          type: 'fill',
          source: 'reports',
          paint: {
            'fill-color': [
              'match',
              ['get', 'verification'],
              'Official', '#9333ea',   // purple
              'AI', '#000000',         // black
              'Community', '#2563eb',  // blue
              '#ccc',
            ],
            'fill-opacity': 0.5,
          },
        });

        map.addLayer({
          id: 'reports-borders',
          type: 'line',
          source: 'reports',
          paint: {
            'line-color': '#ccc',
            'line-width': 1,
          },
        });
      }
    });

    mapRef.current = map;
  }, [selectedMap, shelters]);

  return (
    <div>
      {/* Dropdown selector */}
      <div className="mb-4">
        <select
          value={selectedMap}
          onChange={(e) => setSelectedMap(e.target.value as 'hazard' | 'reports')}
          className="px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-600"
        >
          <option value="hazard">Ocean Hazard Map</option>
          <option value="reports">Reports Map</option>
        </select>
      </div>

      {/* Map container */}
      <div
        ref={mapContainer}
        style={{
          width: '100%',
          height: '500px',
          borderRadius: '12px',
          overflow: 'hidden',
        }}
      />
    </div>
  );
};

export default DisasterMap;
