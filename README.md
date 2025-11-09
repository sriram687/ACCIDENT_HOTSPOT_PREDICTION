# 🚗 SafeRoute AI - Accident Hotspot Prediction System

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![Flask](https://img.shields.io/badge/Flask-2.0+-green.svg)](https://flask.palletsprojects.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 🎯 Overview

SafeRoute AI is an intelligent accident prediction and route safety analysis system that uses machine learning to identify accident-prone areas and provide real-time route safety assessments. The system analyzes historical accident data, weather conditions, road features, and traffic patterns to predict accident risks and visualize hotspots on an interactive map.

### ✨ Key Features

- 🗺️ **Interactive Hotspot Map** - Visualize accident-prone areas with Google Maps-style markers
- 🛣️ **Route Safety Analysis** - Analyze routes from source to destination with risk assessment
- 📊 **Dynamic Dashboard** - View statistics across different time ranges (Today/Week/Month/Year)
- 🤖 **ML-Powered Predictions** - XGBoost model for accurate accident risk prediction
- 🌤️ **Weather Integration** - Real-time weather data from OpenWeather API
- 🔐 **User Authentication** - Secure authentication with Clerk
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices

## 🚀 Quick Start

### Prerequisites

- Python 3.8 or higher
- pip package manager
- Virtual environment (recommended)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/vsablok123/accidentprediction.git
cd accidentprediction
```

2. **Create and activate virtual environment**
```bash
python -m venv .venv
# Windows
.venv\Scripts\activate
# Linux/Mac
source .venv/bin/activate
```

3. **Install dependencies**
```bash
cd FlaskAPI
pip install -r requirements.txt
```

4. **Set up environment variables**
Create a `.env` file in the `FlaskAPI` directory:
```env
SECRET_KEY=your-secret-key-here
CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
CLERK_SECRET_KEY=your-clerk-secret-key
OPENWEATHER_API_KEY=your-openweather-api-key
```

5. **Run the application**
```bash
python app.py
```

6. **Access the application**
Open your browser and navigate to: `http://localhost:5000`

## 📊 Data Analysis & Model

### Dataset
- **Source**: Kaggle US Accident Dataset (5 years of data)
- **Region**: Texas (primary training data)
- **Features**: Weather conditions, time, location, road type, visibility, etc.

### Feature Engineering
- **Clustering**: DBScan clustering to identify accident hotspots
- **Text Processing**: NLTK for weather keyword extraction
- **Synthetic Data**: Balanced dataset creation with non-accident points

### Model Performance
- **Algorithm**: XGBoost (Gradient Boosting)
- **Accuracy**: 92%
- **F1 Score**: 0.88
- **Error Metric**: Log Loss and AUC Score
- **Training**: RandomizedSearchCV for hyperparameter tuning

## 🏗️ Project Structure

```
ACCIDENT_HOTSPOT/
├── FlaskAPI/
│   ├── app.py                 # Main Flask application
│   ├── requirements.txt       # Python dependencies
│   ├── static/               # CSS, JS, images
│   │   ├── map.js           # Interactive map logic
│   │   ├── map.css          # Map styling
│   │   ├── dashboard.js     # Dashboard charts
│   │   └── futuristic.css   # Main styling
│   ├── templates/           # HTML templates
│   │   ├── index_new.html   # Home page
│   │   ├── hotspot_map.html # Map visualization
│   │   ├── dashboard.html   # Analytics dashboard
│   │   └── result_new.html  # Prediction results
│   └── .env                 # Environment variables
├── .gitignore               # Git ignore rules
└── README.md               # This file
```

## 🎨 Features in Detail

### 1. Interactive Hotspot Map
- Google Maps-style teardrop markers
- Color-coded risk levels (Red/Orange/Green)
- Minimal design with hover-activated labels
- Real-time route visualization
- Danger zone highlighting

### 2. Route Safety Analysis
- Source to destination risk assessment
- Multiple warning markers along route
- Risk level classification (High/Medium/Low)
- Estimated travel time
- Safety recommendations

### 3. Dynamic Dashboard
- Traffic vs Incidents chart
- Accident trend analysis
- Weather impact visualization
- Time-of-day radar chart
- Time-range filtering (Today/Week/Month/Year)

### 4. ML Prediction Engine
- Real-time accident risk prediction
- Weather condition analysis
- Road feature evaluation
- Confidence scoring
- Historical pattern recognition

## 🛠️ Technologies Used

### Backend
- **Flask** - Web framework
- **XGBoost** - Machine learning model
- **Pandas/NumPy** - Data processing
- **Scikit-learn** - Model training
- **NLTK** - Natural language processing

### Frontend
- **Leaflet.js** - Interactive maps
- **Chart.js** - Data visualization
- **Vanilla JavaScript** - Dynamic interactions
- **CSS3** - Modern styling
- **Phosphor Icons** - Icon library

### APIs & Services
- **Clerk** - Authentication
- **OpenWeather API** - Weather data
- **CartoDB** - Map tiles

## 📱 Usage

### Predicting Route Safety

1. Navigate to the home page
2. Click "Get Started" or "Risk Scan"
3. Enter source and destination coordinates
4. Select weather conditions and time
5. Click "Analyze Route"
6. View risk assessment and recommendations

### Viewing Hotspots

1. Go to "Hotspot Map" from navigation
2. Toggle different map layers (heatmap, markers)
3. Click on markers for detailed information
4. Use filters to customize view

### Dashboard Analytics

1. Access "Dashboard" from navigation
2. Select time range (Today/Week/Month/Year)
3. View dynamically updated charts
4. Analyze trends and patterns

## 🔐 Authentication Setup

This project uses Clerk for authentication. To set it up:

1. Create a Clerk account at [clerk.com](https://clerk.com)
2. Create a new application
3. Copy your publishable and secret keys
4. Add them to your `.env` file
5. See `CLERK_SETUP_GUIDE.md` for detailed instructions

## 🌐 API Endpoints

### Core Endpoints
- `GET /` - Home page
- `GET /new` - New home page design
- `GET /hotspot_map` - Interactive map
- `GET /dashboard` - Analytics dashboard
- `POST /predict` - Route prediction
- `GET /api/hotspot-data` - Hotspot JSON data
- `GET /api/dashboard-stats?range={period}` - Dashboard statistics

## 📈 Future Enhancements

- [ ] Real-time traffic integration
- [ ] Multi-route comparison
- [ ] Mobile app (iOS/Android)
- [ ] Voice-guided navigation
- [ ] Community reporting features
- [ ] AI-powered route optimization
- [ ] Integration with Google Maps API
- [ ] Accident severity prediction
- [ ] Emergency services integration

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Author

**Vishal Sablok**
- GitHub: [@vsablok123](https://github.com/vsablok123)

## 🙏 Acknowledgments

- Kaggle for the US Accident Dataset
- OpenWeather for weather API
- Clerk for authentication services
- All contributors and supporters

## 📞 Support

For support, email your-email@example.com or open an issue in the GitHub repository.

---

⭐ Star this repository if you find it helpful!
