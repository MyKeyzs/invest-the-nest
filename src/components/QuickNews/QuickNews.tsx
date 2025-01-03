import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './QuickNews.css'; // Ensure this contains styles for the condensed component
import BearIcon from '../../assets/Mama-Bear_10.svg'; // Adjust paths as needed
import BullIcon from '../../assets/bull-icon.svg';

interface QuickNewsProps {
  ticker: string; // Ticker tied to the chart
}

const QuickNews: React.FC<QuickNewsProps> = ({ ticker }) => {
  const [news, setNews] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('https://api.polygon.io/v2/reference/news', {
          params: {
            ticker,
            limit: 5, // Fetch only the latest 5 articles
            apiKey: 'w5oD4IbuQ0ZbZ1akQjZOX70ZqohjeoTX',
          },
        });

        setNews(response.data.results);
        setError(null);
      } catch (err) {
        setError('Failed to fetch news.');
      }
    };

    if (ticker) {
      fetchNews();
    }
  }, [ticker]);

  const getSentimentClass = (sentiment: string | undefined) => {
    if (sentiment === 'positive') return 'positive';
    if (sentiment === 'negative') return 'negative';
    return 'neutral';
  };

  const getSentimentIcon = (sentiment: string | undefined) => {
    if (sentiment === 'positive') return <img src={BullIcon} alt="Bull" className="icon" />;
    if (sentiment === 'negative') return <img src={BearIcon} alt="Bear" className="icon" />;
    return null;
  };

  return (
    <div className="quick-news-container">
      <h3>Quick News</h3>
      {error ? (
        <p>{error}</p>
      ) : (
        <ul className="quick-news-list">
          {news.map((article) => (
            <li key={article.id} className={`news-item ${getSentimentClass(article?.insights?.[0]?.sentiment)}`}>
              {getSentimentIcon(article?.insights?.[0]?.sentiment)}
              <span className="title">{article.title}</span>
              <span className="date">{new Date(article.published_utc).toLocaleDateString()}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default QuickNews;
