from flask import Flask, send_from_directory, request, jsonify
from flask_cors import CORS
from tool import NewsAPI
import os
from datetime import datetime, timedelta
import time
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger
import atexit
import json

newsapi = NewsAPI()
news_cache = {}  # Global cache to store news data

app = Flask(__name__, static_folder='../build', static_url_path='/')
CORS(app)

def fetch_news():
    """Background task to fetch news for all countries"""
    print("Fetching news...")  # Debug log
    # Get countries from the GeoJSON data instead of hardcoding
    try:
        with open('../src/data/worldmap.json') as f:
            geojson = json.load(f)
            countries = [
                feature['properties']['name'] 
                for feature in geojson['features']
            ]
    except Exception as e:
        print(f"Error loading countries: {e}")
        countries = ["USA", "UK", "France"]  # Fallback list
    
    for country in countries:
        try:
            res = None
            multiplier = 1
            while not res and multiplier < 12:
                newsapi.params_everything["from_param"] = newsapi.current_date - timedelta(days=7*multiplier)
                res = newsapi.query_everything("Politics in the country of {}".format(country))
                time.sleep(0.05 * multiplier)
                multiplier += 1
            
            if res:
                news_cache[country] = {
                    'data': res,
                    'last_updated': datetime.now().isoformat()
                }
        except Exception as e:
            print(f"Error fetching news for {country}: {e}")

# Initialize the scheduler
scheduler = BackgroundScheduler()
scheduler.add_job(
    func=fetch_news,
    trigger=IntervalTrigger(hours=1),  # Change this to adjust frequency
    id='fetch_news_job',
    name='Fetch news every hour',
    replace_existing=True
)
scheduler.start()

@app.route('/')
def serve():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/map')
def serve_map():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/api/news/', methods=['GET'])
def get_news():
    country = request.args.get('country')
    if not country:
        return jsonify({"error": "Country parameter is required"})
    
    # Return cached data if available
    if country in news_cache:
        return jsonify(news_cache[country])
    
    return jsonify({"error": "No news found for this country"})

# Cleanup scheduler on app shutdown
@atexit.register
def shutdown():
    scheduler.shutdown()

if __name__ == '__main__':
    # Initial fetch
    fetch_news()
    app.run(debug=True)