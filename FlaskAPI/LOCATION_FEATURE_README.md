# Location Name Feature - Implementation Guide

## Overview
This document describes the new location name fetching and map plotting feature added to the Road Accident Risk Prediction system.

## What's New

### 1. **Automatic Location Name Fetching**
When you enter latitude and longitude coordinates, the system now:
- Automatically fetches the human-readable location name (city, state, country)
- Displays the location name prominently in the result page
- Uses OpenStreetMap's Nominatim API for reverse geocoding

### 2. **Enhanced Result Display**
Both result pages now show:
- **Location Name**: Human-readable address (e.g., "Houston, Texas, USA")
- **Coordinates**: Original latitude/longitude below the location name
- All other prediction details (risk level, confidence, weather, etc.)

### 3. **Interactive Map Integration**
New "View on Map" button that:
- Takes you directly to the hotspot map
- Automatically zooms to your predicted location
- Shows a special pulsating marker for your assessment
- Displays a detailed popup with:
  - Location name
  - Risk level with color-coded badge
  - Confidence percentage
  - Coordinates

## How to Use

### Step 1: Make a Prediction
1. Go to http://localhost:5000/new
2. Enter coordinates (e.g., Houston: `29.7604`, `-95.3698`)
3. Fill in other details (date, weather, temperature, etc.)
4. Click "Scan Risk Level"

### Step 2: View Results
The result page will show:
- **Location Name**: "Houston, Texas, United States" (fetched automatically)
- **Risk Assessment**: Safe/Unsafe with confidence level
- **All Input Parameters**: Weather, temperature, visibility, etc.

### Step 3: View on Map
Click the **"View on Map"** button to:
- Navigate to the interactive hotspot map
- See your location marked with a special animated marker
- View the location in context with other accident hotspots
- Explore nearby high-risk areas

## Technical Implementation

### Backend Changes (`app.py`)

#### 1. Added Reverse Geocoding Function
```python
def get_location_name(lat: float, lng: float) -> str:
    """Fetch human-readable location name from coordinates"""
    # Uses Nominatim API (OpenStreetMap)
    # Returns: "City, State, Country"
    # Fallback: "Location: lat, lng" if API fails
```

#### 2. Updated Predict Route
```python
@app.route('/predict', methods=['POST'])
def predict():
    # ... existing code ...
    
    # NEW: Get location name
    location_name = get_location_name(lat, lng)
    
    # Add to result data
    result_data = {
        'location_name': location_name,
        'latitude': lat,
        'longitude': lng,
        # ... other fields ...
    }
```

### Frontend Changes

#### 1. Enhanced Result Display (`result_new.html`)
```html
<div class="detail-item">
    <div class="detail-label">
        <i class="ph ph-map-pin"></i>
        Location
    </div>
    <div class="detail-value">
        {{ location_name }}
    </div>
    <div style="font-size: 0.75rem; color: var(--text-muted);">
        {{ input_data.latitude }}, {{ input_data.longitude }}
    </div>
</div>
```

#### 2. View on Map Function
```javascript
function viewOnMap() {
    // Store prediction data in sessionStorage
    const locationData = {
        lat: {{ latitude }},
        lng: {{ longitude }},
        location_name: "{{ location_name }}",
        risk_level: "{{ risk_level }}",
        confidence: {{ confidence }},
        prediction: {{ prediction }}
    };
    sessionStorage.setItem('predictionLocation', JSON.stringify(locationData));
    
    // Navigate to map
    window.location.href = "{{ url_for('hotspot_map') }}";
}
```

#### 3. Map Display (`map.js`)
```javascript
function checkPredictionLocation() {
    // Check for stored prediction data
    const predictionData = sessionStorage.getItem('predictionLocation');
    
    if (predictionData) {
        const location = JSON.parse(predictionData);
        
        // Zoom to location
        map.setView([location.lat, location.lng], 13);
        
        // Create animated marker
        const marker = L.marker([location.lat, location.lng], {
            icon: customPredictionIcon
        });
        
        // Add detailed popup
        marker.bindPopup(popupContent).addTo(map);
        marker.openPopup();
    }
}
```

## API Response Format

### `/predict` Endpoint
```python
{
    'prediction': 0 or 1,
    'confidence': 85.5,
    'risk_level': 'Safe' or 'Unsafe',
    'location_name': 'Houston, Texas, United States',
    'latitude': 29.7604,
    'longitude': -95.3698,
    'input_data': { ... }
}
```

### `/api/predict` Endpoint (JSON API)
```json
{
    "prediction": 0,
    "confidence": 85.5,
    "risk_level": "Safe",
    "location_name": "Houston, Texas, United States",
    "latitude": 29.7604,
    "longitude": -95.3698,
    "status": "success"
}
```

## Styling Features

### Prediction Marker on Map
- **Pulsating animation** to draw attention
- **Color-coded** based on risk level:
  - 🟢 Green for Safe
  - 🔴 Red for Unsafe
- **Crosshair icon** to indicate assessed location
- **Smooth zoom** transition to location

### Risk Badges
```css
.risk-badge.low {
    background: rgba(16, 185, 129, 0.2);
    color: #10B981;
    border: 1px solid rgba(16, 185, 129, 0.5);
}

.risk-badge.high {
    background: rgba(239, 68, 68, 0.2);
    color: #EF4444;
    border: 1px solid rgba(239, 68, 68, 0.5);
}
```

## Testing Examples

### Example Locations to Test

1. **Houston, Texas**
   - Latitude: `29.7604`
   - Longitude: `-95.3698`
   - Expected: "Houston, Harris County, Texas, United States"

2. **Dallas, Texas**
   - Latitude: `32.7767`
   - Longitude: `-96.7970`
   - Expected: "Dallas, Dallas County, Texas, United States"

3. **Austin, Texas**
   - Latitude: `30.2672`
   - Longitude: `-97.7431`
   - Expected: "Austin, Travis County, Texas, United States"

4. **San Antonio, Texas**
   - Latitude: `29.4241`
   - Longitude: `-98.4936`
   - Expected: "San Antonio, Bexar County, Texas, United States"

## Error Handling

### Geocoding API Failures
If the Nominatim API fails:
- **Timeout**: Returns "Location: lat, lng" after 5 seconds
- **API Error**: Logs warning and returns coordinates
- **Network Error**: Graceful fallback to coordinates display

### Rate Limiting
Nominatim API has usage limits:
- **Free tier**: 1 request per second
- **User-Agent required**: Already configured in the code
- For production: Consider caching or alternative geocoding service

## Dependencies

### New Package Added
```
requests==2.32.3
```

Install with:
```bash
pip install requests
```

## Future Enhancements

1. **Geocoding Cache**: Store frequently accessed locations
2. **Batch Geocoding**: Process multiple locations efficiently
3. **Alternative APIs**: Support for Google Maps, Mapbox, etc.
4. **Location Search**: Allow users to search by name instead of coordinates
5. **Route Visualization**: Draw the complete route on map
6. **Historical Data**: Show past assessments for the same location

## Troubleshooting

### Issue: Location name not showing
**Solution**: Check if `requests` package is installed and Nominatim API is accessible

### Issue: Map marker not appearing
**Solution**: Ensure JavaScript console shows no errors and sessionStorage has the data

### Issue: API timeout errors
**Solution**: Check internet connection; the API has a 5-second timeout

### Issue: Generic "Location: lat, lng" showing
**Solution**: This is the fallback when geocoding fails - it's working as intended

## API Credits
This feature uses the **Nominatim API** by OpenStreetMap:
- Free and open-source
- No API key required
- Requires proper User-Agent header
- Please use responsibly

## Contact & Support
For issues or questions about this feature, refer to the main project README or check the Flask application logs.

---

**Last Updated**: 2024  
**Version**: 2.0  
**Status**: ✅ Production Ready
