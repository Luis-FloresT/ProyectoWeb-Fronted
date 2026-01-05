import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Box,
  TextField,
  InputAdornment,
  CircularProgress,
  Typography,
  Alert,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  ClickAwayListener,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SearchIcon from '@mui/icons-material/Search';
import PlaceIcon from '@mui/icons-material/Place';

// Fix Leaflet marker icon issue
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom pink marker for selected location
const PinkIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// ===== ABREVIACIONES Y CONTEXTO GEOGRÁFICO =====
const ABBREVIATIONS = {
  'av': 'avenida',
  'av.': 'avenida',
  'cll': 'calle',
  'cll.': 'calle',
  'cl': 'calle',
  'cl.': 'calle',
  'cra': 'carrera',
  'cra.': 'carrera',
  'cr': 'carrera',
  'cr.': 'carrera',
  'diag': 'diagonal',
  'diag.': 'diagonal',
  'trans': 'transversal',
  'trans.': 'transversal',
  'urb': 'urbanización',
  'urb.': 'urbanización',
  'cdla': 'ciudadela',
  'cdla.': 'ciudadela',
  'conj': 'conjunto',
  'conj.': 'conjunto',
  'edif': 'edificio',
  'edif.': 'edificio',
  'pje': 'pasaje',
  'pje.': 'pasaje',
  'mz': 'manzana',
  'mz.': 'manzana',
  'sl': 'solar',
  'sl.': 'solar',
};

const CITIES = ['quito', 'guayaquil', 'cuenca', 'ambato', 'manta', 'portoviejo', 'machala', 'loja', 'riobamba', 'ibarra', 'esmeraldas', 'santo domingo'];

// Función para expandir abreviaciones
const expandAbbreviations = (query) => {
  let expanded = query.toLowerCase();
  Object.entries(ABBREVIATIONS).forEach(([abbr, full]) => {
    // Reemplazar al inicio o después de espacio
    const regex = new RegExp(`(^|\\s)${abbr.replace('.', '\\.')}(?=\\s|$)`, 'gi');
    expanded = expanded.replace(regex, `$1${full}`);
  });
  return expanded;
};

// Función para agregar contexto geográfico si no se especifica ciudad
const addGeographicContext = (query) => {
  const lowerQuery = query.toLowerCase();
  const hasCity = CITIES.some(city => lowerQuery.includes(city));
  
  if (!hasCity && !lowerQuery.includes('ecuador')) {
    return `${query}, Quito, Ecuador`;
  }
  return query;
};

// Función para preparar la búsqueda
const prepareSearchQuery = (query) => {
  let prepared = expandAbbreviations(query.trim());
  prepared = addGeographicContext(prepared);
  return prepared;
};

// Hook para debounce
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Component to handle map click events and draggable marker
function DraggableMarker({ position, setPosition, onPositionChange }) {
  const markerRef = useRef(null);

  const eventHandlers = {
    dragend() {
      const marker = markerRef.current;
      if (marker != null) {
        const newPos = marker.getLatLng();
        setPosition([newPos.lat, newPos.lng]);
        onPositionChange(newPos.lat, newPos.lng);
      }
    },
  };

  // Also allow clicking on map to set position
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
      onPositionChange(e.latlng.lat, e.latlng.lng);
    },
  });

  return position ? (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
      icon={PinkIcon}
    />
  ) : null;
}

// Component to recenter map when searching
function MapController({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 16);
    }
  }, [center, map]);
  return null;
}

export default function LocationPicker({ 
  onLocationChange, 
  initialAddress = '',
  disabled = false 
}) {
  // Default center: Quito, Ecuador
  const defaultCenter = [-0.1807, -78.4678];
  
  const [position, setPosition] = useState(null);
  const [address, setAddress] = useState(initialAddress);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [error, setError] = useState(null);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Debounce search query (500ms)
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Fetch suggestions when debounced query changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedSearchQuery.trim() || debouncedSearchQuery.length < 3) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setSearching(true);
      setError(null);

      try {
        const preparedQuery = prepareSearchQuery(debouncedSearchQuery);
        
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(preparedQuery)}&limit=5&countrycodes=ec&addressdetails=1`,
          {
            headers: {
              'Accept-Language': 'es',
            },
          }
        );

        if (!response.ok) throw new Error('Error en búsqueda');

        const data = await response.json();
        setSuggestions(data);
        setShowSuggestions(data.length > 0);
        
        if (data.length === 0) {
          setError('No se encontraron resultados. Intenta con otra búsqueda o haz clic en el mapa.');
        }
      } catch (err) {
        console.error('Search error:', err);
        setError('Error buscando dirección. Intenta de nuevo.');
        setSuggestions([]);
      } finally {
        setSearching(false);
      }
    };

    fetchSuggestions();
  }, [debouncedSearchQuery]);

  // Reverse geocoding when marker is moved
  const handlePositionChange = async (lat, lng) => {
    setGeocoding(true);
    setError(null);
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'es',
          },
        }
      );
      
      if (!response.ok) throw new Error('Error en geocodificación');
      
      const data = await response.json();
      const displayName = data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      
      setAddress(displayName);
      
      // Notify parent component (round to 6 decimals for backend compatibility)
      onLocationChange({
        latitud: parseFloat(lat.toFixed(6)),
        longitud: parseFloat(lng.toFixed(6)),
        direccion: displayName,
      });
    } catch (err) {
      console.error('Geocoding error:', err);
      // Still update coordinates even if address lookup fails (round to 6 decimals)
      const fallbackAddress = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      setAddress(fallbackAddress);
      onLocationChange({
        latitud: parseFloat(lat.toFixed(6)),
        longitud: parseFloat(lng.toFixed(6)),
        direccion: fallbackAddress,
      });
    } finally {
      setGeocoding(false);
    }
  };

  // Handle suggestion selection
  const handleSelectSuggestion = (suggestion) => {
    const lat = parseFloat(suggestion.lat);
    const lng = parseFloat(suggestion.lon);
    
    setPosition([lat, lng]);
    setMapCenter([lat, lng]);
    setSearchQuery(suggestion.display_name);
    setSuggestions([]);
    setShowSuggestions(false);
    handlePositionChange(lat, lng);
  };

  // Close suggestions on click away
  const handleClickAway = () => {
    setShowSuggestions(false);
  };

  return (
    <Box sx={{ mb: 2 }}>
      {/* Search Input with Autocomplete */}
      <ClickAwayListener onClickAway={handleClickAway}>
        <Box sx={{ position: 'relative' }}>
          <TextField
            fullWidth
            placeholder="Buscar dirección (ej: av amazonas, la carolina)"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (e.target.value.length >= 3) {
                setShowSuggestions(true);
              }
            }}
            onFocus={() => {
              if (suggestions.length > 0) {
                setShowSuggestions(true);
              }
            }}
            disabled={disabled}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#FF6B9D' }} />
                </InputAdornment>
              ),
              endAdornment: searching ? (
                <InputAdornment position="end">
                  <CircularProgress size={20} sx={{ color: '#FF6B9D' }} />
                </InputAdornment>
              ) : null,
            }}
            sx={{ mb: 0.5 }}
          />
          
          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <Paper
              elevation={8}
              sx={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                zIndex: 1500,
                maxHeight: 250,
                overflow: 'auto',
                borderRadius: '12px',
                border: '1px solid #FFE3ED',
              }}
            >
              <List dense disablePadding>
                {suggestions.map((suggestion, index) => (
                  <ListItem key={index} disablePadding>
                    <ListItemButton 
                      onClick={() => handleSelectSuggestion(suggestion)}
                      sx={{
                        '&:hover': {
                          bgcolor: '#FFF5F8',
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <PlaceIcon sx={{ color: '#FF6B9D', fontSize: 20 }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={suggestion.display_name}
                        primaryTypographyProps={{
                          fontSize: '0.85rem',
                          noWrap: false,
                          sx: { 
                            lineHeight: 1.3,
                            color: '#333',
                          }
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
        </Box>
      </ClickAwayListener>

      {/* Helper text */}
      <Typography 
        variant="caption" 
        sx={{ 
          color: '#888', 
          display: 'block',
          mb: 1,
          fontSize: '0.7rem',
        }}
      >
        💡 Puedes usar abreviaciones: av, cll, cdla, urb, edif...
      </Typography>

      {/* Map Container */}
      <Box
        sx={{
          height: 250,
          borderRadius: '12px',
          overflow: 'hidden',
          border: '2px solid #FFE3ED',
          mb: 1,
          position: 'relative',
        }}
      >
        <MapContainer
          center={mapCenter}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <MapController center={mapCenter} />
          <DraggableMarker
            position={position}
            setPosition={setPosition}
            onPositionChange={handlePositionChange}
          />
        </MapContainer>
        
        {/* Loading overlay */}
        {geocoding && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: 'rgba(255,255,255,0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
            }}
          >
            <CircularProgress size={30} sx={{ color: '#FF6B9D' }} />
          </Box>
        )}
      </Box>

      {/* Instructions */}
      {!position && (
        <Typography 
          variant="caption" 
          sx={{ 
            color: '#FF6B9D', 
            fontWeight: 600,
            display: 'block',
            textAlign: 'center',
            mb: 1,
          }}
        >
          📍 Haz clic en el mapa o busca tu dirección para seleccionar la ubicación
        </Typography>
      )}

      {/* Address Display */}
      <TextField
        fullWidth
        label="Dirección del Evento"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        disabled={disabled}
        multiline
        rows={2}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LocationOnIcon sx={{ color: '#FF6B9D' }} />
            </InputAdornment>
          ),
        }}
        helperText={position ? '✓ Ubicación seleccionada' : 'Selecciona un punto en el mapa'}
        FormHelperTextProps={{
          sx: { 
            color: position ? '#4CAF50' : '#FF6348',
            fontWeight: 600,
          }
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: position ? '#4CAF50' : '#FFE3ED',
            },
          },
        }}
      />

      {/* Error Alert */}
      {error && (
        <Alert severity="warning" sx={{ mt: 1, borderRadius: '12px' }}>
          {error}
        </Alert>
      )}
    </Box>
  );
}
