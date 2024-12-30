from bs4 import BeautifulSoup
import requests
import heapq
from config import news_api_key
from newsapi import NewsApiClient  
from datetime import datetime, timedelta

"""
This class is used to scrape news from the NewsAPI.

Top Headlines:

category: 
    - general
    - business
    - entertainment
    - health
    - science
    - sports
    - technology
    
everything:
    - from_param: the date to start from
    - to: the date to end at
    - language: the language of the news
    - sort_by: the sorting method
       - relevancy = articles most closley related to q come first
       - popularity = articles from popular sources and publishers come first
       - publishedAt = newest articles come first
    - page_size: the number of news to return
    
Returns:
    _type_: _description_
"""

class NewsAPI:
    def __init__(self, category="general", language="en", apiKey=news_api_key, page_size=15):
        self.newsapi = NewsApiClient(api_key=apiKey)

        self.params_top_headline = {
            "category": category,
            "language": "en",
        }
        
        self.current_date = datetime.now()
        self.previous_date = self.current_date - timedelta(days=7)
        
        self.params_everything = {
            "from_param": self.previous_date.strftime("%Y-%m-%d"),
            "to": (self.current_date + timedelta(days=1)).strftime("%Y-%m-%d"),
            "language": "en",
            "sort_by": "relevancy",
            "page_size": page_size
        }
        
    def query_top_headlines(self, query):
        self.params_top_headline["q"] = query
        top_headlines = self.newsapi.get_top_headlines(**self.params_top_headline)
        del self.params_top_headline["q"]
        return top_headlines
    
    def query_everything(self, query):
        self.params_everything["q"] = query
        everything = self.newsapi.get_everything(**self.params_everything)
        del self.params_everything["q"]
        return everything
        

