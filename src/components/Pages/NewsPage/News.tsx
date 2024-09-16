import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './News.css'; // Ensure this contains the styles for differentiating stories
import BearIcon from '../../../assets/Mama-Bear_10.svg'; // Corrected path to the Bear icon
import BullIcon from '../../../assets/bull-icon.svg'; // Corrected path to the Bull icon

const NewsPage: React.FC = () => {
    const [news, setNews] = useState<any[]>([]);
    const [selectedNews, setSelectedNews] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [ticker, setTicker] = useState<string>(''); // State to handle ticker input
  
    useEffect(() => {
      const fetchNews = async () => {
        try {
          const params: any = {
            limit: 20, // Fetch 20 stories
            apiKey: 'w5oD4IbuQ0ZbZ1akQjZOX70ZqohjeoTX', // Replace with your actual API key
          };
  
          if (ticker) {
            params.ticker = ticker; // Only include the ticker parameter if it's set
          }
  
          const response = await axios.get('https://api.polygon.io/v2/reference/news', {
            params,
          });
  
          setNews(response.data.results);
          setError(null);
        } catch (err) {
          setError('Failed to fetch news. Please try again.');
        }
      };
  
      fetchNews(); // Fetch news when the page loads or when the ticker changes
    }, [ticker]);
  
    const handleNewsClick = (newsItem: any) => {
      setSelectedNews(newsItem); // Show modal with the clicked news
    };
  
    const closeModal = () => {
      setSelectedNews(null); // Close the modal
    };
  
    const getSentimentIcon = (article: any) => {
      const sentimentInsight = article?.insights?.[0]; // Safely access the first insight in the array
  
      if (sentimentInsight?.sentiment === 'positive') {
        return <img src={BullIcon} alt="Bull Icon" className="sentiment-icon" />;
      } else if (sentimentInsight?.sentiment === 'negative') {
        return <img src={BearIcon} alt="Bear Icon" className="sentiment-icon" />;
      } else {
        return null; // For neutral or undefined sentiment
      }
    };
  
    const getItemClass = (article: any) => {
      const sentimentInsight = article?.insights?.[0]; // Safely access the first insight in the array
  
      if (sentimentInsight?.sentiment === 'positive') {
        return 'news-item positive';
      } else if (sentimentInsight?.sentiment === 'negative') {
        return 'news-item negative';
      } else {
        return 'news-item neutral'; // For cases where sentiment is neutral or undefined
      }
    };
  
    const renderTickers = (tickers: any[]) => {
        return (
          <div className="tickers-container">
            {tickers.map((ticker: string, index: number) => (
              <span key={index} className="ticker-column">
                {ticker}
              </span>
            ))}
          </div>
        );
      };
  
    return (
      <div className="news-page-container">
        <h2>Latest News</h2>
  
        <div className="ticker-input-container">
          <label htmlFor="ticker">Enter Ticker (Optional):</label>
          <input
            type="text"
            id="ticker"
            value={ticker}
            onChange={(e) => setTicker(e.target.value.toUpperCase())} // Convert to uppercase
            placeholder="e.g. AAPL"
            style={{ color: 'black' }} // Ensure input text is black
          />
        </div>
  
        {error ? <p>{error}</p> : (
          <ul className="news-list">
            {news.map((article) => (
              <li
                key={article.id}
                onClick={() => handleNewsClick(article)}
                className={getItemClass(article)} // Pass article to the function
              >
                {getSentimentIcon(article)} {/* Pass article to the function */}
                {renderTickers(article.tickers)} {/* Render tickers */}
                <span className="news-item-title">{article.title}</span> {/* Title column */}
                <span>{new Date(article.published_utc).toLocaleString()}</span> {/* Date */}
              </li>
            ))}
          </ul>
        )}
  
            {selectedNews && (
            <div className="news-modal" onClick={closeModal}>
                <div
                className={`modal-content ${
                    selectedNews?.insights?.[0]?.sentiment === 'positive'
                    ? 'positive-sentiment'
                    : selectedNews?.insights?.[0]?.sentiment === 'negative'
                    ? 'negative-sentiment'
                    : 'neutral-sentiment'
                }`}
                onClick={(e) => e.stopPropagation()}
                >
                <div className="modal-header">
                    <h3>{selectedNews.title}</h3>
                    <button onClick={closeModal}>&times;</button>
                </div>
                <div className="modal-body">
                    <p>{selectedNews.description}</p>
                    <div className="sentiment">
                    <strong>Sentiment:</strong> {selectedNews.insights[0]?.sentiment}
                    </div>
                </div>
                <div className="modal-footer">
                    <a href={selectedNews.article_url} target="_blank" rel="noopener noreferrer">
                    Read full article
                    </a>
                </div>
                </div>
            </div>
            )}
      </div>
    );
  };
  
  export default NewsPage;
  