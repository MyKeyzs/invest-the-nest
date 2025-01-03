import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './QuickNews.css';

interface QuickNewsProps {
  ticker: string;
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
        console.error('Error fetching news:', err);
        setError('Failed to fetch news. Please try again.');
      }
    };

    fetchNews();
  }, [ticker]);

  const getItemClass = (sentiment: string | undefined) => {
    if (sentiment === 'positive') return 'news-item positive';
    if (sentiment === 'negative') return 'news-item negative';
    return 'news-item neutral';
  };

  const openArticleInNewTab = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="quick-news-container">
      <div className="quick-news-header">
        <h3>Quick News: {ticker}</h3>
      </div>
      <div className="quick-news-content">
        {error ? (
          <p>{error}</p>
        ) : (
          <>
            {news.map((article) => (
              <div
                key={article.id}
                className={getItemClass(article?.insights?.[0]?.sentiment)}
                onClick={() => openArticleInNewTab(article.article_url)}
              >
                <span className="news-item-title">{article.title}</span>
                <span className="news-item-date">
                  {new Date(article.published_utc).toLocaleDateString()}
                </span>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default QuickNews;
