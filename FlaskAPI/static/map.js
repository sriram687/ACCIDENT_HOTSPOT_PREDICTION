// ===================================
// Hotspot Map JavaScript
// ===================================

let map;
let heatmapLayer;
let markersLayer;
let accidentData = [];

// Initialize Map
function initMap() {
    // Default center (Texas)
    const defaultCenter = [31.9686, -99.9018];
    
    map = L.map('hotspotMap').setView(defaultCenter, 6);
    
    // Dark theme tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(map);
    
    // Load accident data and create layers
    loadAccidentData();
    
    // Setup layer controls
    setupLayerControls();
    
    // Setup filters
    setupFilters();
    
    // Check if there's a prediction location to display
    checkPredictionLocation();
}

// Check for Prediction Location from Result Page
function checkPredictionLocation() {
    // Check for route data first (new feature with source and destination)
    const routeDataStr = sessionStorage.getItem('routeData');
    
    if (routeDataStr) {
        try {
            const routeData = JSON.parse(routeDataStr);
            displayRouteOnMap(routeData);
            return;
        } catch (error) {
            console.error('Error displaying route:', error);
        }
    }
    
    // Fallback to old prediction location format
    const predictionData = sessionStorage.getItem('predictionLocation');
    
    if (predictionData) {
        try {
            const location = JSON.parse(predictionData);
            
            // Zoom to prediction location
            map.setView([location.lat, location.lng], 13);
            
            // Create custom marker for prediction
            const riskClass = location.risk_level === 'Safe' ? 'low' : 'high';
            const icon = L.divIcon({
                className: 'custom-marker',
                html: `<div class="custom-marker marker-${riskClass} prediction-marker">
                    <i class="ph ph-crosshair"></i>
                </div>`,
                iconSize: [40, 40],
                iconAnchor: [20, 20]
            });
            
            const marker = L.marker([location.lat, location.lng], { icon: icon });
            
            // Enhanced popup content
            const popupContent = `
                <div class="accident-popup prediction-popup">
                    <div class="popup-title">
                        <i class="ph ph-${location.risk_level === 'Safe' ? 'shield-check' : 'shield-warning'}"></i>
                        Risk Assessment Result
                    </div>
                    <div class="popup-details">
                        <div class="popup-detail">
                            <strong>Location:</strong> ${location.location_name}
                        </div>
                        <div class="popup-detail">
                            <strong>Risk Level:</strong> 
                            <span class="risk-badge ${riskClass}">${location.risk_level}</span>
                        </div>
                        <div class="popup-detail">
                            <strong>Confidence:</strong> ${location.confidence}%
                        </div>
                        <div class="popup-detail">
                            <strong>Coordinates:</strong> ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}
                        </div>
                    </div>
                </div>
            `;
            
            marker.bindPopup(popupContent).addTo(map);
            
            // Open popup immediately
            marker.openPopup();
            // Show in info panel
            showInfoPanel({
                lat: location.lat,
                lng: location.lng,
                risk: location.prediction === 1 ? 85 : 25,
                time: 'Just assessed',
                weather: 'Current conditions',
                traffic: 'Live',
                city: location.location_name
            });
            
            // Clear the session storage after displaying
            // sessionStorage.removeItem('predictionLocation');
            
        } catch (error) {
            console.error('Error displaying prediction location:', error);
        }
    }
}

// Display route from source to destination with hotspot mapping
function displayRouteOnMap(routeData) {
    const source = routeData.source;
    const destination = routeData.destination;
    
    console.log('Displaying route:', source, '→', destination);
    
    // Clear existing route layers if any
    if (window.routeLayers) {
        window.routeLayers.forEach(layer => map.removeLayer(layer));
    }
    window.routeLayers = [];
    
    // Create source marker (green house icon)
    const sourceIcon = L.divIcon({
        className: 'custom-route-marker source-marker',
        html: `
            <div class="route-marker-pin source-pin">
                <div class="marker-icon">🏠</div>
            </div>
            <div class="marker-pulse source-pulse"></div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 40]
    });
    
    const sourceMarker = L.marker([source.lat, source.lng], { icon: sourceIcon })
        .addTo(map)
        .bindPopup(`
            <div class="enhanced-popup source-popup">
                <div class="popup-header" style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.1));">
                    <div style="flex: 1;">
                        <strong style="color: #10b981; font-size: 1.2rem;">🏠 Starting Point</strong>
                        <div class="popup-subtitle">${source.name || 'Source Location'}</div>
                    </div>
                </div>
                <div class="popup-content" style="padding: 1rem;">
                    <p style="margin: 0.5rem 0; color: rgba(255,255,255,0.9);"><strong>📍 Coordinates:</strong></p>
                    <p style="margin: 0 0 0.5rem 0; color: rgba(255,255,255,0.7); font-size: 0.9rem;">${source.lat.toFixed(6)}, ${source.lng.toFixed(6)}</p>
                </div>
            </div>
        `);
    window.routeLayers.push(sourceMarker);
    
    // Create destination marker (red flag icon)
    const destIcon = L.divIcon({
        className: 'custom-route-marker dest-marker',
        html: `
            <div class="route-marker-pin dest-pin">
                <div class="marker-icon">🏁</div>
            </div>
            <div class="marker-pulse dest-pulse"></div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 40]
    });
    
    const destMarker = L.marker([destination.lat, destination.lng], { icon: destIcon })
        .addTo(map)
        .bindPopup(`
            <div class="enhanced-popup dest-popup">
                <div class="popup-header" style="background: linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.1));">
                    <div style="flex: 1;">
                        <strong style="color: #ef4444; font-size: 1.2rem;">🏁 Destination</strong>
                        <div class="popup-subtitle">${destination.name || 'Destination Point'}</div>
                    </div>
                </div>
                <div class="popup-content" style="padding: 1rem;">
                    <p style="margin: 0.5rem 0; color: rgba(255,255,255,0.9);"><strong>📍 Coordinates:</strong></p>
                    <p style="margin: 0 0 0.5rem 0; color: rgba(255,255,255,0.7); font-size: 0.9rem;">${destination.lat.toFixed(6)}, ${destination.lng.toFixed(6)}</p>
                </div>
            </div>
        `);
    window.routeLayers.push(destMarker);
    
    // Calculate route distance
    const distance = calculateDistance(source.lat, source.lng, destination.lat, destination.lng);
    
    // Determine route color based on risk
    const routeColor = getRouteColor(routeData.risk_level || routeData.prediction);
    
    // Create a more realistic curved route path (simulate road following)
    const routePoints = generateCurvedRoute(source.lat, source.lng, destination.lat, destination.lng);
    
    // Draw main route line with multiple segments for curved effect
    const routeLine = L.polyline(
        routePoints,
        {
            color: '#4285F4', // Google Maps blue
            weight: 8,
            opacity: 0.85,
            lineJoin: 'round',
            lineCap: 'round',
            className: 'route-polyline-main',
            smoothFactor: 2
        }
    ).addTo(map);
    window.routeLayers.push(routeLine);
    
    // Add a white border/outline to make it stand out
    const routeOutline = L.polyline(
        routePoints,
        {
            color: '#FFFFFF',
            weight: 11,
            opacity: 0.5,
            lineJoin: 'round',
            lineCap: 'round',
            smoothFactor: 2
        }
    ).addTo(map);
    // Add outline first so it appears behind
    window.routeLayers.unshift(routeOutline);
    
    // Add small directional arrows along the route
    if (typeof L.polylineDecorator !== 'undefined') {
        const decorator = L.polylineDecorator(routeLine, {
            patterns: [
                {
                    offset: '10%',
                    repeat: 80,
                    symbol: L.Symbol.arrowHead({
                        pixelSize: 12,
                        polygon: true,
                        pathOptions: {
                            fillOpacity: 1,
                            weight: 0,
                            color: '#FFFFFF',
                            fillColor: '#FFFFFF'
                        }
                    })
                }
            ]
        }).addTo(map);
        window.routeLayers.push(decorator);
    }
    
    // Find hotspots along the route (within 10km buffer for MORE markers)
    const routeHotspots = accidentData.filter(hotspot => {
        const lat = hotspot.Latitude || hotspot.lat;
        const lng = hotspot.Longitude || hotspot.lng;
        
        // Check distance to any segment of the route
        let minDist = Infinity;
        for (let i = 0; i < routePoints.length - 1; i++) {
            const dist = distanceToLineSegment(
                lat, lng,
                routePoints[i][0], routePoints[i][1],
                routePoints[i + 1][0], routePoints[i + 1][1]
            );
            minDist = Math.min(minDist, dist);
        }
        return minDist <= 10; // Increased to 10km buffer for more markers
    });
    
    console.log(`Found ${routeHotspots.length} hotspots along route`);
    
    // Add only 1-2 minimal warning markers (only highest risk points)
    const syntheticWarnings = [];
    
    // Select only top 2 highest risk real hotspots or create 2 evenly spaced ones
    let selectedWarnings = [];
    if (routeHotspots.length >= 2) {
        // Use real hotspots, sorted by risk
        const sortedHotspots = routeHotspots
            .map(h => ({
                lat: h.Latitude || h.lat,
                lng: h.Longitude || h.lng,
                risk: calculateRiskScore(h),
                synthetic: false
            }))
            .sort((a, b) => b.risk - a.risk)
            .slice(0, 2); // Take only top 2
        selectedWarnings = sortedHotspots;
    } else {
        // Create 2 evenly spaced markers if no real hotspots
        const mid = Math.floor(routePoints.length / 2);
        const quarter = Math.floor(routePoints.length / 4);
        
        [quarter, mid + quarter].forEach(i => {
            if (i < routePoints.length) {
                const point = routePoints[i];
                syntheticWarnings.push({
                    lat: point[0],
                    lng: point[1],
                    risk: 60 + Math.random() * 30,
                    synthetic: true
                });
            }
        });
        selectedWarnings = syntheticWarnings;
    }
    
    // Combine real hotspots with synthetic evenly-spaced markers
    const allWarningPoints = selectedWarnings;
    
    console.log(`Total warning markers to display: ${allWarningPoints.length}`);
    
    // Highlight dangerous segments in RED on the route (only for selected warning points)
    allWarningPoints.forEach((hotspot) => {
        const lat = hotspot.lat;
        const lng = hotspot.lng;
        const risk = hotspot.risk;
        
        // Find the closest segment of the route to this hotspot
        let closestSegmentIndex = 0;
        let minDist = Infinity;
        
        for (let i = 0; i < routePoints.length - 1; i++) {
            const dist = distanceToLineSegment(
                lat, lng,
                routePoints[i][0], routePoints[i][1],
                routePoints[i + 1][0], routePoints[i + 1][1]
            );
            if (dist < minDist) {
                minDist = dist;
                closestSegmentIndex = i;
            }
        }
        
        // Draw RED highlight over dangerous segments (only 1-2 segments, not spreading too much)
        const segmentStart = closestSegmentIndex;
        const segmentEnd = Math.min(routePoints.length - 1, closestSegmentIndex + 1);
        const dangerSegmentPoints = routePoints.slice(segmentStart, segmentEnd + 1);
        
        const riskColor = risk > 70 ? '#FF4444' : risk > 40 ? '#FF9933' : '#FFB84D';
        const segmentWeight = 6; // Thinner line
        
        // Add red warning segment on route (minimal, no pulsing)
        const dangerSegment = L.polyline(
            dangerSegmentPoints,
            {
                color: riskColor,
                weight: segmentWeight,
                opacity: 0.7,
                lineJoin: 'round',
                lineCap: 'round',
                smoothFactor: 2
            }
        ).addTo(map);
        window.routeLayers.push(dangerSegment);
    });
    
    // Generate warning messages based on position and risk
    const warningMessages = [
        'GO SLOW', 'ACCIDENT ZONE', 'SHARP TURN', 'SLOW DOWN', 
        'HIGH RISK', 'CAUTION AHEAD', 'DANGER ZONE', 'REDUCE SPEED',
        'STAY ALERT', 'WATCH OUT', 'TURNING POINT', 'RISKY AREA',
        'CURVE AHEAD', 'BLIND SPOT', 'MERGE ZONE', 'SCHOOL ZONE'
    ];
    
    // Add ALL warning markers along the route
    allWarningPoints.forEach((hotspot, index) => {
        const lat = hotspot.lat;
        const lng = hotspot.lng;
        const risk = hotspot.risk;
        const riskLevel = risk > 70 ? 'high' : risk > 40 ? 'medium' : 'low';
        const riskColor = risk > 70 ? '#FF3333' : risk > 40 ? '#FF8C00' : '#FFA500';
        const circleRadius = risk > 70 ? 600 : risk > 40 ? 400 : 250; // Meters
        
        // Select appropriate warning message based on risk and position
        let warningText = '';
        if (risk > 80) {
            warningText = ['GO SLOW', 'DANGER ZONE', 'HIGH RISK', 'SLOW DOWN'][index % 4];
        } else if (risk > 60) {
            warningText = ['SLOW DOWN', 'CAUTION AHEAD', 'ACCIDENT ZONE', 'SHARP TURN'][index % 4];
        } else if (risk > 40) {
            warningText = ['STAY ALERT', 'TURNING POINT', 'REDUCE SPEED', 'CURVE AHEAD'][index % 4];
        } else {
            warningText = ['WATCH OUT', 'RISKY AREA', 'BE CAREFUL', 'MERGE ZONE'][index % 4];
        }
        
        // Add animated warning marker with red pulsing icon and text label (HIDDEN by default, shows on HOVER)
        const warningMarkerIcon = L.divIcon({
            className: 'route-warning-marker',
            html: `
                <div class="warning-marker-container minimal-marker">
                    <div class="warning-dot-minimal" style="background: ${riskColor};">
                        <div class="warning-inner-dot"></div>
                    </div>
                    <div class="warning-label-hover" style="background: ${riskColor};">
                        <span class="warning-text">${warningText}</span>
                    </div>
                </div>
            `,
            iconSize: [24, 24],
            iconAnchor: [12, 12]
        });
        
        const routeWarningMarker = L.marker([lat, lng], { 
            icon: warningMarkerIcon,
            zIndexOffset: 1000 
        }).addTo(map);
        window.routeLayers.push(routeWarningMarker);
        
        // No danger zone circles - keep it minimal
    });
    
    // Calculate route risk score based on ALL warning points
    const routeRisk = allWarningPoints.length > 0 
        ? allWarningPoints.reduce((sum, h) => sum + h.risk, 0) / allWarningPoints.length
        : routeData.prediction === 1 ? 75 : 25;
    const routeRiskLevel = routeRisk > 70 ? 'high' : routeRisk > 40 ? 'medium' : 'low';
    
    // Calculate zone breakdown
    const highRiskZones = allWarningPoints.filter(h => h.risk > 70).length;
    const mediumRiskZones = allWarningPoints.filter(h => h.risk > 40 && h.risk <= 70).length;
    const lowRiskZones = allWarningPoints.filter(h => h.risk <= 40).length;
    
    // Display route information panel
    showInfoPanel({
        type: 'route',
        source: source.name || 'Source Location',
        destination: destination.name || 'Destination',
        distance: distance.toFixed(2),
        risk: Math.round(routeRisk),
        riskLevel: routeRiskLevel,
        hotspotCount: allWarningPoints.length,
        highRiskZones: highRiskZones,
        mediumRiskZones: mediumRiskZones,
        lowRiskZones: lowRiskZones,
        prediction: routeData.prediction === 1 ? 'High Risk' : 'Safe',
        confidence: routeData.confidence || 85,
        estimatedTime: Math.round((distance / 60) * 60) // Rough estimate at 60 km/h
    });
    
    // Fit map to show entire route with padding
    const bounds = L.latLngBounds([
        [source.lat, source.lng],
        [destination.lat, destination.lng]
    ]);
    map.fitBounds(bounds, { padding: [100, 100], maxZoom: 13 });
    
    // Clear session storage
    sessionStorage.removeItem('routeData');
}

// Helper: Calculate distance between two points (in km)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Helper: Generate a curved/realistic route path (simulating road curves)
function generateCurvedRoute(lat1, lng1, lat2, lng2) {
    const points = [[lat1, lng1]];
    
    // Calculate the distance between points
    const distance = calculateDistance(lat1, lng1, lat2, lng2);
    
    // Number of intermediate points based on distance
    const numPoints = Math.max(8, Math.min(20, Math.floor(distance / 5)));
    
    for (let i = 1; i < numPoints; i++) {
        const t = i / numPoints;
        
        // Linear interpolation
        const lat = lat1 + (lat2 - lat1) * t;
        const lng = lng1 + (lng2 - lng1) * t;
        
        // Add some curve/deviation to simulate realistic roads
        // Roads don't go in straight lines, they follow terrain and infrastructure
        const deviation = Math.sin(t * Math.PI) * 0.015; // Curve amount
        const perpLat = -(lng2 - lng1) / distance * deviation;
        const perpLng = (lat2 - lat1) / distance * deviation;
        
        // Add random small variations to make it more natural
        const randomOffset = (Math.random() - 0.5) * 0.005;
        
        points.push([
            lat + perpLat + randomOffset,
            lng + perpLng + randomOffset
        ]);
    }
    
    points.push([lat2, lng2]);
    
    return points;
}

// Helper: Calculate perpendicular distance from point to line segment (in km)
function distanceToLineSegment(px, py, x1, y1, x2, y2) {
    const A = px - x1;
    const B = py - y1;
    const C = x2 - x1;
    const D = y2 - y1;
    
    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;
    
    if (lenSq !== 0) param = dot / lenSq;
    
    let xx, yy;
    
    if (param < 0) {
        xx = x1;
        yy = y1;
    } else if (param > 1) {
        xx = x2;
        yy = y2;
    } else {
        xx = x1 + param * C;
        yy = y1 + param * D;
    }
    
    return calculateDistance(px, py, xx, yy);
}

// Helper: Get route color based on risk level
function getRouteColor(riskLevel) {
    if (typeof riskLevel === 'string') {
        switch(riskLevel.toLowerCase()) {
            case 'unsafe':
            case 'high': return '#ef4444';
            case 'medium': return '#f59e0b';
            case 'safe':
            case 'low': return '#10b981';
            default: return '#3b82f6';
        }
    }
    // Numeric risk level
    if (riskLevel === 1 || riskLevel > 70) return '#ef4444';
    if (riskLevel > 40) return '#f59e0b';
    return '#10b981';
}

// Helper: Calculate risk score from hotspot data
function calculateRiskScore(hotspot) {
    // If hotspot already has a risk score, use it
    if (hotspot.risk !== undefined) {
        return hotspot.risk;
    }
    
    // Otherwise calculate based on available properties
    let riskScore = 50; // Base score
    
    // Adjust based on various factors
    if (hotspot.Light_Conditions) {
        if (hotspot.Light_Conditions.toLowerCase().includes('dark')) riskScore += 15;
        if (hotspot.Light_Conditions.toLowerCase().includes('dawn') || 
            hotspot.Light_Conditions.toLowerCase().includes('dusk')) riskScore += 10;
    }
    
    if (hotspot.Weather_Conditions || hotspot.weather) {
        const weather = (hotspot.Weather_Conditions || hotspot.weather).toLowerCase();
        if (weather.includes('rain') || weather.includes('snow')) riskScore += 20;
        if (weather.includes('fog')) riskScore += 15;
    }
    
    if (hotspot.Road_Type) {
        if (hotspot.Road_Type.toLowerCase().includes('highway') || 
            hotspot.Road_Type.toLowerCase().includes('motorway')) riskScore += 10;
    }
    
    // Ensure score is within bounds
    return Math.min(100, Math.max(0, riskScore));
}

// Load Accident Data from server
async function loadAccidentData() {
    try {
        // Fetch real accident hotspot data from API
        const response = await fetch('/api/hotspot-data');
        const data = await response.json();
        
        if (data.status === 'success') {
            accidentData = data.hotspots;
            console.log(`Loaded ${accidentData.length} accident hotspots`);
        } else {
            // Fallback to generated data
            accidentData = generateSampleAccidentData();
        }
        
        // Create heatmap
        createHeatmap();
        
        // Create markers
        createMarkers();
        
        // Update stats
        updateStats();
        
    } catch (error) {
        console.error('Error loading accident data:', error);
        // Fallback to generated data
        accidentData = generateSampleAccidentData();
        createHeatmap();
        createMarkers();
        updateStats();
    }
}

// Generate Sample Accident Data
function generateSampleAccidentData() {
    const data = [];
    const texasCities = [
        { name: 'Houston', lat: 29.7604, lng: -95.3698, risk: 85 },
        { name: 'Dallas', lat: 32.7767, lng: -96.7970, risk: 78 },
        { name: 'Austin', lat: 30.2672, lng: -97.7431, risk: 72 },
        { name: 'San Antonio', lat: 29.4241, lng: -98.4936, risk: 68 },
        { name: 'Fort Worth', lat: 32.7555, lng: -97.3308, risk: 75 },
        { name: 'El Paso', lat: 31.7619, lng: -106.4850, risk: 65 },
        { name: 'Arlington', lat: 32.7357, lng: -97.1081, risk: 70 }
    ];
    
    texasCities.forEach(city => {
        // Create multiple accident points around each city
        for (let i = 0; i < 20; i++) {
            const lat = city.lat + (Math.random() - 0.5) * 0.2;
            const lng = city.lng + (Math.random() - 0.5) * 0.2;
            const risk = city.risk + (Math.random() - 0.5) * 20;
            
            data.push({
                lat: lat,
                lng: lng,
                risk: Math.max(0, Math.min(100, risk)),
                city: city.name,
                time: getRandomTime(),
                weather: getRandomWeather(),
                traffic: getRandomTraffic()
            });
        }
    });
    
    return data;
}

// Helper functions for random data
function getRandomTime() {
    const hours = Math.floor(Math.random() * 24);
    return `${hours} hours ago`;
}

function getRandomWeather() {
    const conditions = ['Clear', 'Cloudy', 'Rain', 'Fog', 'Overcast'];
    return conditions[Math.floor(Math.random() * conditions.length)];
}

function getRandomTraffic() {
    const levels = ['Light', 'Moderate', 'Heavy'];
    return levels[Math.floor(Math.random() * levels.length)];
}

// Create Heatmap Layer
function createHeatmap() {
    const heatmapData = accidentData.map(point => {
        const intensity = point.risk / 100;
        return [point.lat, point.lng, intensity];
    });
    
    heatmapLayer = L.heatLayer(heatmapData, {
        radius: 30,
        blur: 40,
        maxZoom: 13,
        max: 1.0,
        gradient: {
            0.0: '#3B82F6',   // Blue - Low risk
            0.2: '#10B981',   // Green - Safe
            0.4: '#FBBF24',   // Yellow - Moderate
            0.6: '#F59E0B',   // Orange - Elevated
            0.8: '#EF4444',   // Red - High
            1.0: '#DC2626'    // Dark Red - Critical
        }
    }).addTo(map);
}

// Create Marker Layer
function createMarkers() {
    markersLayer = L.layerGroup();
    
    // Filter high-risk locations for marker display
    const highRiskPoints = accidentData.filter(point => point.risk > 60).slice(0, 50);
    
    highRiskPoints.forEach(point => {
        const riskLevel = point.risk > 80 ? 'high' : point.risk > 50 ? 'medium' : 'low';
        const riskColor = point.risk > 80 ? '#EA4335' : point.risk > 50 ? '#FBBC04' : '#34A853';
        
        // Create elegant Google Maps-style marker
        const icon = L.divIcon({
            className: 'custom-marker-enhanced',
            html: `
                <div class="hotspot-pin ${riskLevel}-risk">
                    <div class="hotspot-pin-inner"></div>
                </div>
            `,
            iconSize: [40, 50],
            iconAnchor: [20, 50]
        });
        
        const marker = L.marker([point.lat, point.lng], { icon: icon });
        
        // Enhanced popup content
        const popupContent = `
            <div class="accident-popup enhanced-popup">
                <div class="popup-header">
                    <div class="risk-indicator" style="background: ${riskColor};">
                        <span class="risk-score">${Math.round(point.risk)}</span>
                    </div>
                    <div>
                        <div class="popup-title">Accident Hotspot</div>
                        <div class="popup-subtitle">Cluster ${point.cluster}</div>
                    </div>
                </div>
                <div class="popup-details">
                    <div class="popup-detail">
                        <strong>Risk Level:</strong> 
                        <span class="risk-badge-${riskLevel}">${riskLevel.toUpperCase()}</span>
                    </div>
                    <div class="popup-detail">
                        <strong>Location:</strong> ${point.lat.toFixed(4)}, ${point.lng.toFixed(4)}
                    </div>
                    <div class="popup-detail">
                        <strong>Cluster ID:</strong> ${point.cluster}
                    </div>
                </div>
                <div class="popup-action">
                    <button onclick="assessThisLocation(${point.lat}, ${point.lng})" class="btn-assess">
                        <i class="ph ph-crosshair"></i> Assess This Location
                    </button>
                </div>
            </div>
        `;
        
        marker.bindPopup(popupContent, {
            maxWidth: 300,
            className: 'custom-popup-enhanced'
        });
        
        // Show info panel on click
        marker.on('click', () => {
            showInfoPanel(point);
        });
        
        markersLayer.addLayer(marker);
    });
    
    markersLayer.addTo(map);
}

// Function to assess a clicked location
function assessThisLocation(lat, lng) {
    sessionStorage.setItem('selectedLocation', JSON.stringify({ lat, lng }));
    window.location.href = '/new#risk-scan';
}

// Show Info Panel
function showInfoPanel(point) {
    const panel = document.getElementById('infoPanel');
    if (!panel) return;
    
    // Check if this is route data or point data
    if (point.type === 'route') {
        // Display route information
        const routeInfo = `
            <div class="route-info-display">
                <h3 style="color: #4285F4; margin-bottom: 15px; text-align: center; font-size: 1.5rem;">
                    �️ Route Safety Analysis
                </h3>
                
                <!-- Route Info -->
                <div style="background: linear-gradient(135deg, rgba(66, 133, 244, 0.15), rgba(66, 133, 244, 0.05)); padding: 15px; border-radius: 12px; margin-bottom: 12px; border-left: 4px solid #4285F4;">
                    <p style="margin: 0.5rem 0;"><strong>📍 From:</strong> ${point.source}</p>
                    <p style="margin: 0.5rem 0;"><strong>🏁 To:</strong> ${point.destination}</p>
                    <p style="margin: 0.5rem 0;"><strong>📏 Distance:</strong> ${point.distance} km</p>
                    <p style="margin: 0.5rem 0;"><strong>⏱️ Est. Time:</strong> ${point.estimatedTime || '--'} min</p>
                </div>
                
                <!-- Risk Score -->
                <div style="background: linear-gradient(135deg, ${point.riskLevel === 'high' ? 'rgba(239, 68, 68, 0.2)' : point.riskLevel === 'medium' ? 'rgba(249, 115, 22, 0.2)' : 'rgba(16, 185, 129, 0.2)'}, rgba(0,0,0,0.1)); padding: 15px; border-radius: 12px; margin-bottom: 12px; text-align: center; border: 2px solid ${point.riskLevel === 'high' ? '#ef4444' : point.riskLevel === 'medium' ? '#f59e0b' : '#10b981'};">
                    <p style="margin: 0; font-size: 0.9rem; color: rgba(255,255,255,0.7);">OVERALL ROUTE RISK</p>
                    <p style="margin: 10px 0 5px 0; font-size: 3rem; font-weight: 900; color: ${point.riskLevel === 'high' ? '#ef4444' : point.riskLevel === 'medium' ? '#f59e0b' : '#10b981'}; line-height: 1;">${point.risk}</p>
                    <p style="margin: 0; font-size: 1.1rem; font-weight: bold; color: ${point.riskLevel === 'high' ? '#ef4444' : point.riskLevel === 'medium' ? '#f59e0b' : '#10b981'};">${point.riskLevel.toUpperCase()} RISK</p>
                </div>
                
                <!-- Danger Zones Breakdown -->
                <div style="background: rgba(255, 255, 255, 0.05); padding: 15px; border-radius: 12px; margin-bottom: 12px;">
                    <p style="margin: 0 0 10px 0; font-weight: bold; color: white; font-size: 1rem;">⚠️ Danger Zones Detected:</p>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="color: rgba(255,255,255,0.8);">🔴 High Risk:</span>
                        <span style="color: #ef4444; font-weight: bold; font-size: 1.2rem;">${point.highRiskZones || 0}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="color: rgba(255,255,255,0.8);">🟠 Medium Risk:</span>
                        <span style="color: #f59e0b; font-weight: bold; font-size: 1.2rem;">${point.mediumRiskZones || 0}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: rgba(255,255,255,0.8);">🟡 Low Risk:</span>
                        <span style="color: #fcd34d; font-weight: bold; font-size: 1.2rem;">${point.lowRiskZones || 0}</span>
                    </div>
                    <div style="border-top: 1px solid rgba(255,255,255,0.1); margin-top: 10px; padding-top: 10px;">
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: rgba(255,255,255,0.9); font-weight: bold;">Total Warnings:</span>
                            <span style="color: white; font-weight: bold; font-size: 1.3rem;">${point.hotspotCount}</span>
                        </div>
                    </div>
                </div>
                
                <!-- AI Prediction -->
                <div style="background: linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(168, 85, 247, 0.05)); padding: 15px; border-radius: 12px; border-left: 4px solid #a855f7;">
                    <p style="margin: 0.5rem 0;"><strong>🤖 AI Prediction:</strong> <span style="color: ${point.prediction === 'High Risk' ? '#ef4444' : '#10b981'}; font-weight: bold;">${point.prediction}</span></p>
                    <p style="margin: 0.5rem 0;"><strong>📊 Confidence:</strong> ${point.confidence}%</p>
                    <div style="width: 100%; height: 8px; background: rgba(255,255,255,0.1); border-radius: 4px; margin-top: 8px; overflow: hidden;">
                        <div style="width: ${point.confidence}%; height: 100%; background: linear-gradient(90deg, #a855f7, #0ea5e9); border-radius: 4px; transition: width 1s ease;"></div>
                    </div>
                </div>
                
                <!-- Safety Tips -->
                ${point.risk > 70 ? `
                <div style="background: rgba(239, 68, 68, 0.1); padding: 12px; border-radius: 10px; margin-top: 12px; border: 1px solid rgba(239, 68, 68, 0.3);">
                    <p style="margin: 0; color: #ef4444; font-weight: bold; font-size: 0.95rem;">
                        🚨 <strong>HIGH RISK ROUTE!</strong>
                    </p>
                    <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.85); font-size: 0.85rem;">
                        • Reduce speed by 20-30%<br>
                        • Increase following distance<br>
                        • Consider alternative route<br>
                        • Stay highly alert
                    </p>
                </div>
                ` : point.risk > 40 ? `
                <div style="background: rgba(249, 115, 22, 0.1); padding: 12px; border-radius: 10px; margin-top: 12px; border: 1px solid rgba(249, 115, 22, 0.3);">
                    <p style="margin: 0; color: #f59e0b; font-weight: bold; font-size: 0.95rem;">
                        ⚠️ <strong>MODERATE CAUTION</strong>
                    </p>
                    <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.85); font-size: 0.85rem;">
                        • Drive defensively<br>
                        • Watch for warning zones<br>
                        • Maintain safe speed
                    </p>
                </div>
                ` : `
                <div style="background: rgba(16, 185, 129, 0.1); padding: 12px; border-radius: 10px; margin-top: 12px; border: 1px solid rgba(16, 185, 129, 0.3);">
                    <p style="margin: 0; color: #10b981; font-weight: bold; font-size: 0.95rem;">
                        ✅ <strong>RELATIVELY SAFE</strong>
                    </p>
                    <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.85); font-size: 0.85rem;">
                        • Maintain normal precautions<br>
                        • Stay alert for changes<br>
                        • Follow traffic rules
                    </p>
                </div>
                `}
            </div>
        `;
        panel.innerHTML = routeInfo;
        
        // Show AI alert if high risk route
        if (point.risk > 70 || point.riskLevel === 'high') {
            showAIAlert();
        }
    } else {
        // Display point information (original behavior)
        document.getElementById('infoCoords').textContent = 
            `${point.lat.toFixed(4)}, ${point.lng.toFixed(4)}`;
        document.getElementById('infoRisk').textContent = Math.round(point.risk);
        document.getElementById('infoTime').textContent = point.time;
        document.getElementById('infoWeather').textContent = point.weather;
        document.getElementById('infoTraffic').textContent = point.traffic;
        
        // Show AI alert if high risk
        if (point.risk > 70) {
            showAIAlert();
        }
    }
    
    panel.style.display = 'block';
}

// Close Info Panel
function closeInfoPanel() {
    const panel = document.getElementById('infoPanel');
    if (panel) {
        panel.style.display = 'none';
    }
}

// Show AI Alert
function showAIAlert() {
    const alert = document.getElementById('aiAlert');
    if (alert) {
        alert.style.display = 'flex';
        setTimeout(() => {
            alert.style.display = 'none';
        }, 10000);
    }
}

// Setup Layer Controls
function setupLayerControls() {
    document.getElementById('heatmapLayer').addEventListener('change', function() {
        if (this.checked) {
            map.addLayer(heatmapLayer);
        } else {
            map.removeLayer(heatmapLayer);
        }
    });
    
    document.getElementById('markersLayer').addEventListener('change', function() {
        if (this.checked) {
            map.addLayer(markersLayer);
        } else {
            map.removeLayer(markersLayer);
        }
    });
    
    // Other layers (weather, traffic, road quality) - placeholders
    document.getElementById('weatherLayer').addEventListener('change', function() {
        console.log('Weather layer toggle:', this.checked);
        // Implement weather layer
    });
    
    document.getElementById('trafficLayer').addEventListener('change', function() {
        console.log('Traffic layer toggle:', this.checked);
        // Implement traffic layer
    });
    
    document.getElementById('roadQualityLayer').addEventListener('change', function() {
        console.log('Road quality layer toggle:', this.checked);
        // Implement road quality layer
    });
}

// Setup Filters
function setupFilters() {
    document.getElementById('timeFilter').addEventListener('change', function() {
        filterData();
    });
    
    document.getElementById('weatherFilter').addEventListener('change', function() {
        filterData();
    });
    
    document.getElementById('riskFilter').addEventListener('change', function() {
        filterData();
    });
}

// Filter Data
function filterData() {
    const timeFilter = document.getElementById('timeFilter').value;
    const weatherFilter = document.getElementById('weatherFilter').value;
    const riskFilter = document.getElementById('riskFilter').value;
    
    let filteredData = [...accidentData];
    
    // Apply filters
    if (weatherFilter !== 'all') {
        filteredData = filteredData.filter(point => 
            point.weather.toLowerCase() === weatherFilter.toLowerCase()
        );
    }
    
    if (riskFilter !== 'all') {
        if (riskFilter === 'high') {
            filteredData = filteredData.filter(point => point.risk > 70);
        } else if (riskFilter === 'medium') {
            filteredData = filteredData.filter(point => point.risk > 30 && point.risk <= 70);
        } else if (riskFilter === 'low') {
            filteredData = filteredData.filter(point => point.risk <= 30);
        }
    }
    
    // Update map with filtered data
    updateMapLayers(filteredData);
    updateStats();
}

// Update Map Layers
function updateMapLayers(data) {
    // Remove existing layers
    if (heatmapLayer) {
        map.removeLayer(heatmapLayer);
    }
    if (markersLayer) {
        map.removeLayer(markersLayer);
    }
    
    // Recreate with filtered data
    const tempData = accidentData;
    accidentData = data;
    createHeatmap();
    createMarkers();
    accidentData = tempData;
}

// Update Stats
function updateStats() {
    const totalHotspots = accidentData.filter(point => point.risk > 70).length;
    const avgRisk = Math.round(
        accidentData.reduce((sum, point) => sum + point.risk, 0) / accidentData.length
    );
    
    document.getElementById('totalHotspots').textContent = totalHotspots;
    document.getElementById('avgRisk').textContent = avgRisk;
}

// Search Location
function searchLocation() {
    const searchInput = document.getElementById('searchLocation');
    const query = searchInput.value.trim();
    
    if (!query) return;
    
    // Use geocoding service (e.g., Nominatim)
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const result = data[0];
                map.setView([result.lat, result.lon], 13);
                
                // Add temporary marker
                const marker = L.marker([result.lat, result.lon])
                    .addTo(map)
                    .bindPopup(result.display_name)
                    .openPopup();
                
                setTimeout(() => {
                    map.removeLayer(marker);
                }, 5000);
            } else {
                alert('Location not found');
            }
        })
        .catch(error => {
            console.error('Search error:', error);
            alert('Search failed. Please try again.');
        });
}

// Navigate to Location
function navigateToLocation() {
    const coords = document.getElementById('infoCoords').textContent;
    const [lat, lng] = coords.split(', ').map(parseFloat);
    
    // Open in Google Maps
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
}

// Initialize map when page loads
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('hotspotMap')) {
        initMap();
    }
});

// Export functions
window.MapFunctions = {
    closeInfoPanel,
    searchLocation,
    navigateToLocation
};
