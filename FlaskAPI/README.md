# Road Accident Risk Prediction Flask Web Application

A comprehensive end-to-end Flask web application that predicts road accident risk for given routes using machine learning. The application uses a pre-trained XGBoost model and provides real-time safety assessments based on location, weather conditions, and road features.

## 🚀 Features

- **Real-time Risk Prediction**: Get instant safety assessments for any route
- **Comprehensive Input Validation**: Robust form validation with user-friendly error messages
- **Modern Responsive UI**: Beautiful, mobile-friendly interface with smooth animations
- **API Endpoint**: RESTful API for programmatic access
- **Error Handling**: Comprehensive error handling and user feedback
- **Health Monitoring**: Built-in health check endpoint
- **Print/Share Functionality**: Print results and share predictions
- **Accessibility**: WCAG compliant with keyboard navigation support

## 🛠️ Technical Stack

- **Backend**: Flask 2.3.3
- **Machine Learning**: XGBoost, scikit-learn
- **Data Processing**: Pandas, NumPy
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Styling**: Custom CSS with modern design patterns
- **Icons**: Font Awesome
- **Fonts**: Google Fonts (Inter, Pacifico)

## 📋 Prerequisites

- Python 3.8 or higher
- pip (Python package installer)
- The pre-trained XGBoost model file (`accident-prediction-xgb-model.pkl`)
- The accident dataset file (`model_Data.csv`)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ACCIDENT_HOTSPOT/FlaskAPI
```

### 2. Create Virtual Environment
```bash
python -m venv venv

# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Verify Model Files
Ensure the following files exist in the parent directory:
- `accident-prediction-xgb-model.pkl` (XGBoost model)
- `model_Data.csv` (Accident dataset for clustering)

### 5. Run the Application
```bash
python app.py
```

The application will be available at `http://localhost:5000`

## 📊 Model Features

The XGBoost model uses 24 features for prediction:

### Location Features
- `Start_Lat`: Starting latitude
- `Start_Lng`: Starting longitude  
- `Cluster`: Geographic cluster ID (determined by proximity to historical accidents)

### Time Features
- `Weekday`: Day of the week (0-6)
- `Hour`: Hour of the day (0-23)
- `Date`: Day of the month (1-31)
- `Month`: Month of the year (1-12)
- `Sunrise_Sunset`: Day/Night indicator (1 for day, 0 for night)

### Road Features (Binary)
- `Traffic_Signal`: Presence of traffic signal
- `Station`: Presence of station
- `Junction`: Presence of junction
- `Crossing`: Presence of crossing

### Weather Features
- `Temperature(F)`: Temperature in Fahrenheit
- `Wind_Speed(mph)`: Wind speed in mph
- `Pressure(in)`: Atmospheric pressure in inches
- `Visibility(mi)`: Visibility in miles
- `Humidity(%)`: Relative humidity percentage

### Weather Conditions (Binary)
- `cloudy`, `fog`, `overcast`, `rain`, `snow`, `thunderstorm`, `wind`

## 🌐 API Endpoints

### Web Interface
- `GET /` - Main prediction form
- `POST /predict` - Submit prediction form
- `GET /health` - Health check endpoint

### REST API
- `POST /api/predict` - JSON API for predictions

#### API Request Format
```json
{
    "latitude": 27.872295,
    "longitude": -82.745537,
    "date": "2024-01-15T14:30",
    "temp": 75.0,
    "pres": 29.94,
    "humi": 65.0,
    "windspeed": 8.5,
    "visibility": 10.0,
    "roadfeature": "Traffic_Signal",
    "weatherkeyword": "cloudy"
}
```

#### API Response Format
```json
{
    "prediction": 0,
    "confidence": 87.5,
    "risk_level": "Safe",
    "status": "success"
}
```

## 🎯 Usage Examples

### Web Interface
1. Open `http://localhost:5000` in your browser
2. Fill in the required fields:
   - Location coordinates
   - Date and time
   - Weather parameters
   - Road features
3. Click "Predict Safety Risk"
4. View the prediction result with confidence score

### API Usage
```python
import requests

# Example API call
url = "http://localhost:5000/api/predict"
data = {
    "latitude": 27.872295,
    "longitude": -82.745537,
    "date": "2024-01-15T14:30",
    "temp": 75.0,
    "pres": 29.94,
    "humi": 65.0,
    "windspeed": 8.5,
    "visibility": 10.0,
    "roadfeature": "Traffic_Signal",
    "weatherkeyword": "cloudy"
}

response = requests.post(url, json=data)
result = response.json()
print(f"Risk Level: {result['risk_level']}")
print(f"Confidence: {result['confidence']}%")
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file for configuration:
```env
FLASK_ENV=development
SECRET_KEY=your-secret-key-here
MODEL_PATH=../accident-prediction-xgb-model.pkl
DATASET_PATH=../model_Data.csv
```

### Model Configuration
The model expects specific input ranges:
- Latitude: -90 to 90
- Longitude: -180 to 180
- Temperature: -50°F to 150°F
- Pressure: 25 to 35 inches
- Humidity: 0% to 100%
- Wind Speed: 0 to 200 mph
- Visibility: 0 to 20 miles

## 🚨 Error Handling

The application includes comprehensive error handling:

- **Input Validation**: Client-side and server-side validation
- **Model Loading Errors**: Graceful handling of missing model files
- **Prediction Errors**: Fallback mechanisms for prediction failures
- **HTTP Errors**: Custom error pages for 404 and 500 errors
- **User Feedback**: Flash messages for user notifications

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- Print media

## 🔒 Security Features

- Input validation and sanitization
- CSRF protection (when using Flask-WTF)
- Secure session management
- Error message sanitization

## 🚀 Deployment

### Local Development
```bash
python app.py
```

### Production with Gunicorn
```bash
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Docker Deployment
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]
```

## 📈 Performance Optimization

- Model loading on startup (single load)
- Efficient clustering algorithm
- Optimized database queries
- Caching of static assets
- Compressed responses

## 🧪 Testing

### Manual Testing
1. Test all form fields with valid inputs
2. Test validation with invalid inputs
3. Test API endpoints with various payloads
4. Test responsive design on different devices

### Automated Testing
```bash
# Install test dependencies
pip install pytest pytest-flask

# Run tests
pytest tests/
```

## 📝 Logging

The application includes comprehensive logging:
- Application startup/shutdown
- Model loading status
- Prediction requests and results
- Error tracking and debugging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the error logs

## 🔮 Future Enhancements

- Real-time weather data integration
- Map visualization of risk areas
- Historical prediction analysis
- Mobile app development
- Advanced ML model ensemble
- Real-time traffic data integration

---

**Made with ❤️ for road safety | Powered by XGBoost ML Model**
