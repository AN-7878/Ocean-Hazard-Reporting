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

const severityColors: Record<string, string> = {
  Critical: '#dc2626',
  High: '#f97316',
  Moderate: '#facc15',
  Low: '#22c55e',
  default: '#64748b',
};

const DisasterMap: React.FC<Props> = ({ shelters }) => {
  const [selectedMap, setSelectedMap] = useState<'hazard' | 'reports'>('hazard');
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Clean up previous map and markers
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [80.2707, 13.0827],
      zoom: 6,
    });

    map.on('load', () => {
      if (selectedMap === 'hazard') {
        // Ocean hazards pentagon polygons
        map.addSource('oceanHazards', {
          type: 'geojson',
          data: '/ocean_hazards.geojson',
        });

        // Fill polygons by severity
        map.addLayer({
          id: 'ocean-hazard-polygon',
          type: 'fill',
          source: 'oceanHazards',
          paint: {
            'fill-color': [
              'match',
              ['get', 'severity'],
              'Critical', severityColors.Critical,
              'High', severityColors.High,
              'Moderate', severityColors.Moderate,
              'Low', severityColors.Low,
              severityColors.default,
            ],
            'fill-opacity': 0.5,
          },
        });

        // Pentagon borders
        map.addLayer({
          id: 'ocean-hazard-borders',
          type: 'line',
          source: 'oceanHazards',
          paint: {
            'line-color': '#334155',
            'line-width': 2,
          },
        });

        // Polygon hover popup
        const hazardPopup = new mapboxgl.Popup({ closeButton: false, closeOnClick: false });
        map.on('mousemove', 'ocean-hazard-polygon', (e) => {
          const feature = e.features && e.features[0];
          if (!feature) return;
          const props = feature.properties as any;
          const html = `
            <div style="font-size:13px;">
              <strong>${props.name || 'Area'}</strong><br/>
              Severity: <b>${props.severity || '-'}</b><br/>
              Zone: ${props.zone || '-'}<br/>
              Buildings: ${props.buildings || '-'}<br/>
              Population: ${props.population || '-'}
            </div>
          `;
          hazardPopup.setLngLat((e as any).lngLat).setHTML(html).addTo(map);
        });
        map.on('mouseleave', 'ocean-hazard-polygon', () => {
          hazardPopup.remove();
        });

        // no-op: hotspots will be added below for both modes
      } else if (selectedMap === 'reports') {
        // Reports pentagon polygons
        map.addSource('reports', {
          type: 'geojson',
          data: '/reports.geojson',
        });

        map.addLayer({
          id: 'reports-polygon',
          type: 'fill',
          source: 'reports',
          paint: {
            'fill-color': [
              'match',
              ['get', 'severity'],
              'Critical', severityColors.Critical,
              'High', severityColors.High,
              'Moderate', severityColors.Moderate,
              'Low', severityColors.Low,
              severityColors.default,
            ],
            'fill-opacity': 0.5,
          },
        });

        map.addLayer({
          id: 'reports-borders',
          type: 'line',
          source: 'reports',
          paint: {
            'line-color': '#334155',
            'line-width': 2,
          },
        });

        // Polygon hover popup for reports
        const reportPopup = new mapboxgl.Popup({ closeButton: false, closeOnClick: false });
        map.on('mousemove', 'reports-polygon', (e) => {
          const feature = e.features && e.features[0];
          if (!feature) return;
          const props = feature.properties as any;
          const html = `
            <div style="font-size:13px;">
              <strong>${props.title || 'Report'}</strong><br/>
              Severity: <b>${props.severity || '-'}</b><br/>
              Type: ${props.type || '-'}<br/>
              Status: ${props.status || '-'}<br/>
              Description: ${props.description || '-'}
            </div>
          `;
          reportPopup.setLngLat((e as any).lngLat).setHTML(html).addTo(map);
        });
        map.on('mouseleave', 'reports-polygon', () => {
          reportPopup.remove();
        });
      }

      // Build severity-based hotspot points from polygons (centroids) and add layer
      const buildSeverityHotspots = async (sourceKey: 'ocean' | 'reports') => {
        const url = sourceKey === 'ocean' ? '/ocean_hazards.geojson' : '/reports.geojson';
        let geojson: any = { type: 'FeatureCollection', features: [] };
        try {
          const res = await fetch(url);
          if (res.ok) {
            geojson = await res.json();
          }
        } catch (_) {
          // ignore fetch errors; we'll still show manual hotspots
        }

        const toCentroid = (coords: number[][]): [number, number] => {
          let area = 0;
          let cx = 0;
          let cy = 0;
          for (let i = 0, j = coords.length - 1; i < coords.length; j = i++) {
            const p1 = coords[i];
            const p2 = coords[j];
            const f = p1[0] * p2[1] - p2[0] * p1[1];
            area += f;
            cx += (p1[0] + p2[0]) * f;
            cy += (p1[1] + p2[1]) * f;
          }
          area *= 0.5;
          if (area === 0) {
            const sx = coords.reduce((s, c) => s + c[0], 0) / coords.length;
            const sy = coords.reduce((s, c) => s + c[1], 0) / coords.length;
            return [sx, sy];
          }
          return [cx / (6 * area), cy / (6 * area)];
        };

        const features: any[] = [];
        for (const f of geojson.features || []) {
          const severity = (f.properties && (f.properties.severity || f.properties.zone)) || 'default';
          if (String(severity) === 'Low') continue; // remove green

          if (f.geometry && f.geometry.type === 'Polygon') {
            const rings = (f.geometry.coordinates as number[][][])[0];
            const [x, y] = toCentroid(rings);
            features.push({
              type: 'Feature',
              geometry: { type: 'Point', coordinates: [x, y] },
              properties: { severity: String(severity), name: f.properties?.name || f.properties?.title || 'Hotspot' },
            });
          } else if (f.geometry && f.geometry.type === 'MultiPolygon') {
            const polys = f.geometry.coordinates as number[][][][];
            if (polys.length > 0) {
              const rings = polys[0][0];
              const [x, y] = toCentroid(rings);
              features.push({
                type: 'Feature',
                geometry: { type: 'Point', coordinates: [x, y] },
                properties: { severity: String(severity), name: f.properties?.name || f.properties?.title || 'Hotspot' },
              });
            }
          } else if (f.geometry && f.geometry.type === 'Point') {
            features.push({
              type: 'Feature',
              geometry: f.geometry,
              properties: { severity: String(severity), name: f.properties?.name || f.properties?.title || 'Hotspot' },
            });
          }
        }

        // Manual hotspots: Mumbai (Critical/red), Visakhapatnam (High/orange), Kochi (Moderate/yellow)
        const manualFeatures: any[] = [
          { type: 'Feature', geometry: { type: 'Point', coordinates: [72.8777, 19.0760] }, properties: { name: 'Mumbai Hotspot', severity: 'Critical' } },
          { type: 'Feature', geometry: { type: 'Point', coordinates: [83.2185, 17.6868] }, properties: { name: 'Visakhapatnam Hotspot', severity: 'High' } },
          { type: 'Feature', geometry: { type: 'Point', coordinates: [76.2673, 9.9312] }, properties: { name: 'Kochi Hotspot', severity: 'Moderate' } },
        ];
        features.push(...manualFeatures);

        if (map.getSource('severity-hotspots')) {
          (map.getSource('severity-hotspots') as mapboxgl.GeoJSONSource).setData({ type: 'FeatureCollection', features });
        } else {
          map.addSource('severity-hotspots', { type: 'geojson', data: { type: 'FeatureCollection', features } });
          map.addLayer({
            id: 'severity-hotspots-layer',
            type: 'circle',
            source: 'severity-hotspots',
            paint: {
              'circle-radius': [ 'interpolate', ['linear'], ['zoom'], 5, 6, 10, 10, 14, 16 ],
              'circle-color': [
                'match', ['get', 'severity'],
                'Critical', severityColors.Critical,
                'High', severityColors.High,
                'Moderate', severityColors.Moderate,
                severityColors.default
              ],
              'circle-stroke-width': 1.5,
              'circle-stroke-color': '#111827',
              'circle-opacity': 0.95,
            },
          });
          map.on('mouseenter', 'severity-hotspots-layer', () => { map.getCanvas().style.cursor = 'pointer'; });
          map.on('mouseleave', 'severity-hotspots-layer', () => { map.getCanvas().style.cursor = ''; });
          map.on('click', 'severity-hotspots-layer', (e) => {
            const feature = e.features && e.features[0] as any;
            if (!feature) return;
            const p = feature.properties || {};
            const html = `
              <div style=\"font-size:13px;\">\n                <strong>${p.name || 'Hotspot'}</strong><br/>\n                Severity: <b>${p.severity || '-'}<\/b>\n              <\/div>
            `;
            new mapboxgl.Popup({ offset: 12 })
              .setLngLat((e as any).lngLat)
              .setHTML(html)
              .addTo(map);
          });
        }
      };

      // Build based on selected map's dataset
      buildSeverityHotspots(selectedMap === 'hazard' ? 'ocean' : 'reports');
    });

    mapRef.current = map;

    // Clean up on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
    };
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
