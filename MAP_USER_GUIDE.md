# Quick Start Guide - Using the Enhanced Map

## How to Use the Route Mapping Feature

### Step 1: Make a Prediction
1. Go to the home page
2. Fill in the **Risk Assessment Form**:
   - Enter your current location (latitude/longitude)
   - Enter your destination (latitude/longitude)
   - Fill in weather conditions
   - Add road features
3. Click **"Predict Risk"**

### Step 2: View on Map
1. After getting your prediction result, click **"View on Map"** button
2. You will be redirected to the `/map` page

### Step 3: Explore Your Route
On the map, you'll see:

#### 🏠 **Source Marker (Green)**
- Your starting point
- Animated with pulse effect
- Click to see location details

#### 🏁 **Destination Marker (Red)**
- Your ending point
- Animated with pulse effect
- Click to see location details

#### 🛣️ **Route Line**
- Connects source to destination
- **Color indicates risk**:
  - 🔴 Red = High Risk Route
  - 🟠 Orange = Medium Risk Route
  - 🟢 Green = Safe Route
- Animated dashed line with arrows

#### ⚠️ **Hotspot Markers (Yellow/Orange/Red)**
- Show accident-prone areas along your route
- **Size and color indicate risk level**:
  - Large Red = High Risk Hotspot
  - Medium Orange = Medium Risk Hotspot
  - Small Green = Low Risk Hotspot
- Click any hotspot to see:
  - Risk score
  - Weather conditions
  - Road type
  - Location coordinates

#### 📊 **Route Information Panel (Top Right)**
Shows comprehensive analysis:
- 📍 Source and destination names
- 📏 Total distance
- ⚠️ Average route risk score
- 🔥 Number of hotspots found
- 🎯 AI prediction result
- 📊 Confidence level

---

## Sidebar Controls (Left Side)

### 🗺️ **Map Layers**
Toggle visibility of:
- Heat Map (overall risk heatmap)
- Accident Markers (hotspot indicators)
- Weather Conditions
- Traffic Flow
- Road Quality

### 🔍 **Filters**
Filter hotspots by:
- **Time Range**: Today, Last 7 days, Last 30 days, etc.
- **Weather Condition**: Clear, Rain, Snow, Fog
- **Risk Level**: High, Medium, Low

### 📊 **Legend**
Shows color coding:
- 🔴 Red = High Risk (70-100)
- 🟠 Orange = Medium Risk (30-70)
- 🟢 Green = Low Risk (0-30)

### 📈 **Statistics**
Real-time stats:
- Total active hotspots
- Average risk score

---

## Tips for Best Experience

### ✅ DO:
- Click on markers to see detailed information
- Use the legend to understand risk levels
- Check the route info panel for comprehensive analysis
- Toggle layers to focus on specific data
- Use filters to narrow down hotspot display

### ❌ DON'T:
- Zoom out too far (hotspots may cluster)
- Ignore high-risk hotspots along your route
- Skip reading the route analysis

---

## Understanding Risk Levels

### 🔴 **High Risk (70-100)**
**What it means**: Dangerous conditions detected
**Actions**:
- Consider alternative routes
- Reduce speed by 15-20 mph
- Increase following distance
- Stay highly alert
- Avoid if possible during bad weather

### 🟠 **Medium Risk (40-70)**
**What it means**: Moderate caution required
**Actions**:
- Drive defensively
- Maintain safe following distance
- Be aware of surroundings
- Reduce speed in poor conditions

### 🟢 **Low Risk (0-40)**
**What it means**: Relatively safe conditions
**Actions**:
- Normal driving precautions
- Stay alert for unexpected changes
- Follow traffic rules

---

## Keyboard Shortcuts

- **+** : Zoom in
- **-** : Zoom out
- **Arrow Keys** : Pan map
- **Esc** : Close info panel

---

## Troubleshooting

### Problem: Map not loading
**Solution**: Refresh the page or check your internet connection

### Problem: Route not appearing
**Solution**: Make sure you clicked "View on Map" from the results page

### Problem: Sidebar text not visible
**Solution**: This has been fixed! If still having issues, try:
1. Clear browser cache
2. Hard refresh (Ctrl+F5 or Cmd+Shift+R)

### Problem: Hotspots not showing
**Solution**: Check if "Accident Markers" layer is enabled in the sidebar

---

## Example Usage Scenario

**Scenario**: Planning a trip from Austin to Houston

1. **Enter Details**:
   - Source: Austin (30.2672, -97.7431)
   - Destination: Houston (29.7604, -95.3698)
   - Weather: Rainy
   - Time: Night

2. **Get Prediction**:
   - Risk Level: High
   - Confidence: 87%

3. **View Map**:
   - Route appears with red color (high risk)
   - 12 hotspots detected along I-10
   - Average route risk: 78

4. **Decision**:
   - Consider delaying trip until morning
   - OR take alternative route with lower risk
   - Drive extra carefully if must travel

---

## Support

For issues or questions:
- Check MAP_IMPROVEMENTS.md for technical details
- Review this guide for usage tips
- Contact support team

**Happy Safe Driving! 🚗💨**
