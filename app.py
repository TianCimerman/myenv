from flask import Flask, render_template, request, jsonify  # type: ignore
from influxdb_client import InfluxDBClient
import time
import requests
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.firefox.service import Service
from selenium.webdriver.firefox.options import Options
import time


app = Flask(__name__)

API_KEY = '2ad521340e75e70795e40edd342d8db7'
BASE_URL = "http://api.openweathermap.org/data/2.5/weather"
BASE_URL_FORECAST = "https://api.openweathermap.org/data/2.5/forecast"
CITY = "Dobovica"
INTERVAL = 60 

bucket = "data"
org = "family"
token = "ZxiXrqG4D0hOoHOO67J7E1_wQ85v7-frrJy7AXHJkIhr7i8q4WOu4aqCPsxD844OPRLlJNq0JnBI0Z0gQH6QIw=="
url="http://192.168.1.160:8086" 



@app.route('/')
def home():
    """
    Serve the main HTML page.
    """
    return render_template('index.html')  # Ensure you have an 'index.html' file in the templates directory

# Helper function to get current weather data



def get_weather_data(city):
    url = f"{BASE_URL}?q={city}&appid={API_KEY}&units=metric"
    try:
        response = requests.get(url)
        if response.status_code == 200:
            return response.json()
        else:
            return None
    except requests.exceptions.RequestException as e:
        print(f"Error fetching current weather data: {e}")
        return None

# Helper function to get forecast data (5-day forecast)
def get_forecast_data(city):
    url = f"{BASE_URL_FORECAST}?q={city}&appid={API_KEY}&units=metric"
    try:
        response = requests.get(url)
        if response.status_code == 200:
            return response.json()
        else:
            return None
    except requests.exceptions.RequestException as e:
        print(f"Error fetching forecast data: {e}")
        return None





@app.route('/get_current_weather', methods=['GET'])
def get_current_weather():

    city = "Dobovica"

    
    # Get current weather and forecast
    current_weather = get_weather_data(city)
    forecast_data = get_forecast_data(city)
    
    if current_weather and forecast_data:
        city_name = current_weather.get('name')
        temperature = current_weather['main'].get('temp')
        humidity = current_weather['main'].get('humidity')
        weather = current_weather['weather'][0].get('description')
        weather_id = current_weather['weather'][0].get('id')  # Ensure this is properly fetched
        wind_speed = current_weather['wind'].get('speed')
        icon = current_weather['weather'][0].get('icon')
        icon_url = f'http://openweathermap.org/img/wn/{icon}.png'
        timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
        
        # Extract 5-day forecast data
        forecast = []
        days = {}  # To store max/min temps for each day

        for entry in forecast_data["list"]:
            # Group the forecast data by day (date only)
            date = entry["dt_txt"].split(" ")[0]

            if date not in days:
                days[date] = {
                    "max_temp": entry["main"]["temp"],
                    "min_temp": entry["main"]["temp"],
                    "weather_id": entry["weather"][0]["id"]
                }
            else:
                # Update max and min temperatures for the day
                days[date]["max_temp"] = max(days[date]["max_temp"], entry["main"]["temp"])
                days[date]["min_temp"] = min(days[date]["min_temp"], entry["main"]["temp"])

             # Prepare forecast data
        for date, data in days.items():
            forecast.append({
                'datetime': date,
                'max_temp': data["max_temp"],
                'min_temp': data["min_temp"],
                'weather_id': data["weather_id"]
            })

        return jsonify({
            'current_weather': {
                'city': city_name,
                'temperature': temperature,
                'humidity': humidity,
                'weather': weather,
                'weather_id': weather_id,
                'wind_speed': wind_speed,
                'icon_url': icon_url,
                'timestamp': timestamp
            },
            'forecast': forecast
        })
    else:
        return jsonify({'error': 'Unable to fetch weather data'}), 500


@app.route('/get_info', methods=['POST'])
def get_info():
    flux_query = '''
        from(bucket: "data")
        |> range(start: -1d)  // Look at the last 1 day of data (adjust if needed)
        |> filter(fn: (r) => r["_measurement"] == "meter_data2")  // Filter by the measurement
        |> filter(fn: (r) => r["_field"] == "power2")  // Filter by the 'power' field
        |> last()  // Get the last value of the 'power' field
        |> keep(columns: ["_value"])  // Only keep the '_value' column (the last value)


        '''

        # Initialize the InfluxDB client
    client = InfluxDBClient(url=url, token=token, org=org)

        # Query data
    query_api = client.query_api()
    result = query_api.query(flux_query, org=org)

        # Print the result
    for table in result:
        for record in table.records:
            print(record['_value'])
    return jsonify({'info':record['_value']})

@app.route('/get_temp', methods=['POST'])
def get_temp():
    flux_query = '''
        from(bucket: "data")
        |> range(start: -1d)  // Look at the last 1 day of data
        |> filter(fn: (r) => r["_measurement"] == "climate_2")  // Filter by the measurement
        |> filter(fn: (r) => r["_field"] == "temperature_in" or r["_field"] == "humidity_in" or r["_field"] == "humidity_out" or r["_field"] == "temperature_out" or r["_field"] == "voltage_out" or r["_field"] == "voltage_in")  // Filter for specific fields
	|> last()  // Get the last value for each field
        |> keep(columns: ["_field", "_value"])  // Keep only '_field' and '_value' columns
    '''

    client = InfluxDBClient(url=url, token=token, org=org)
    query_api = client.query_api()
    result = query_api.query(flux_query, org=org)

    data = {}

    try:
        for table in result:
            for record in table.records:
                if "_field" in record.values and "_value" in record.values:
                    data[record.values["_field"]] = record.values["_value"]
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    return jsonify(data)

@app.route('/get_login', methods=['POST'])
def get_login():
# Configuration
    URL = "http://192.168.1.180/"  # Replace with the login page URL
    PASSWORD = "helios"            # Replace with your password
    PASSWORD_FIELD_ID = "v00402"   # Replace with the ID/name/class of the password field
    LOGIN_BUTTON_ID = "but0"       # Replace with the ID/name/class of the login button

    # Setup Firefox options for headless mode
    firefox_options = Options()
    firefox_options.add_argument("--headless")  # Run browser in headless mode
    firefox_options.add_argument("--disable-gpu")  # Disable GPU (optional, improves compatibility)
    firefox_options.add_argument("--no-sandbox")  # Bypass OS security model (useful in Docker)

    # Path to geckodriver (ensure this is correct for your system)
    service = Service("/usr/local/bin/geckodriver")  # Adjust the path as needed

    # Initialize WebDriver with options
    driver = webdriver.Firefox(service=service, options=firefox_options)
    try:
        # Open the web page
        driver.get(URL)
        time.sleep(2)  # Wait for the page to load

        # Locate and fill in the password
        password_field = driver.find_element(By.ID, PASSWORD_FIELD_ID)  # Adjust locator type if needed
        password_field.send_keys(PASSWORD)

        # Locate and click the login button
        login_button = driver.find_element(By.ID, LOGIN_BUTTON_ID)  # Adjust locator type if needed
        login_button.click()

        # Wait to ensure login is successful
        time.sleep(5)

        print("Login successful!")
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        # Close the browser
        driver.quit()


if __name__ == '__main__':
    # Set host='0.0.0.0' to listen on all network interfaces
    app.run(debug=True, host='0.0.0.0', port=5000)
    city = "Dobovica"  # Change this to the city you want to check
