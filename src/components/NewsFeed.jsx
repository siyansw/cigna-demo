import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Newspaper, ExternalLink, RefreshCw } from 'lucide-react';
import './NewsFeed.css';

const NewsFeed = ({ type = 'credential' }) => {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState(null);

  // Demo news data
  const demoNewsData = {
    credential: [
      {
        headline: 'Texas Medical Board Announces New Expedited License Verification Process',
        source: 'Healthcare Dive',
        publishedTime: '2 hours ago',
        summary: 'The Texas Medical Board has implemented a new streamlined process for verifying physician licenses, reducing processing time from 48 hours to under 10 seconds...',
        url: '#'
      },
      {
        headline: 'CMS Updates NPI Registry API with Enhanced Provider Data',
        source: 'Modern Healthcare',
        publishedTime: '5 hours ago',
        summary: 'Centers for Medicare & Medicaid Services expanded the National Provider Identifier database with additional provider taxonomy and specialty information...',
        url: '#'
      },
      {
        headline: 'Healthcare Systems Turn to AI for Provider Credentialing Efficiency',
        source: 'STAT News',
        publishedTime: '1 day ago',
        summary: 'Major healthcare organizations are adopting AI-powered automation to streamline provider credentialing workflows, reducing verification time by 90%...',
        url: '#'
      }
    ],
    pt: [
      {
        headline: 'FDA Approves New GLP-1 Receptor Agonist for Type 2 Diabetes',
        source: 'Fierce Pharma',
        publishedTime: '3 hours ago',
        summary: 'The Food and Drug Administration has granted approval for a novel once-weekly GLP-1 receptor agonist, expanding treatment options for diabetes management...',
        url: '#'
      },
      {
        headline: 'Medicare Part D Formulary Changes Impact 15 Million Beneficiaries',
        source: 'Formulary Watch',
        publishedTime: '6 hours ago',
        summary: 'Updated formulary tier placements for diabetes medications will affect Medicare Part D coverage for millions of patients beginning next quarter...',
        url: '#'
      },
      {
        headline: 'ADA Updates Clinical Practice Guidelines for Cardiovascular Risk',
        source: 'Diabetes Care Journal',
        publishedTime: '1 day ago',
        summary: 'American Diabetes Association releases revised standards of care emphasizing preferred GLP-1 agonists for patients with established ASCVD...',
        url: '#'
      }
    ]
  };

  useEffect(() => {
    // Check cache
    const cacheKey = `news-feed-${type}`;
    const cachedData = localStorage.getItem(cacheKey);

    if (cachedData) {
      const parsed = JSON.parse(cachedData);
      const cacheAge = Date.now() - parsed.timestamp;

      // Use cache if less than 15 minutes old
      if (cacheAge < 15 * 60 * 1000) {
        setNews(parsed.news);
        setLastRefreshed(parsed.timestamp);
        setIsLoading(false);
        return;
      }
    }

    // Simulate loading
    loadNews();
  }, [type]);

  const loadNews = () => {
    setIsLoading(true);

    setTimeout(() => {
      const newsData = demoNewsData[type] || demoNewsData.credential;
      setNews(newsData);
      setLastRefreshed(Date.now());
      setIsLoading(false);

      // Cache the data
      const cacheKey = `news-feed-${type}`;
      localStorage.setItem(cacheKey, JSON.stringify({
        news: newsData,
        timestamp: Date.now()
      }));
    }, 1500);
  };

  const handleRefresh = () => {
    loadNews();
  };

  const formatRefreshTime = (timestamp) => {
    if (!timestamp) return '';
    const minutes = Math.floor((Date.now() - timestamp) / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes === 1) return '1 minute ago';
    return `${minutes} minutes ago`;
  };

  return (
    <div className="news-feed">
      <div className="news-feed-header">
        <div className="news-feed-title-section">
          <Newspaper size={24} className="news-icon" />
          <h2 className="news-feed-title">Industry News & Updates</h2>
        </div>
        <div className="news-feed-actions">
          {lastRefreshed && (
            <span className="refresh-time">
              Last refreshed: {formatRefreshTime(lastRefreshed)}
            </span>
          )}
          <button
            className="news-refresh-btn"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw size={16} className={isLoading ? 'spinning' : ''} />
            Refresh
          </button>
        </div>
      </div>

      <div className="news-cards">
        {isLoading ? (
          // Loading skeletons
          [...Array(3)].map((_, index) => (
            <div key={index} className="news-card skeleton">
              <div className="skeleton-header"></div>
              <div className="skeleton-source"></div>
              <div className="skeleton-line"></div>
              <div className="skeleton-line short"></div>
            </div>
          ))
        ) : (
          news.map((article, index) => (
            <motion.div
              key={index}
              className="news-card"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="news-card-indicator"></div>
              <h3 className="news-headline">{article.headline}</h3>
              <div className="news-meta">
                <span className="news-source">{article.source}</span>
                <span className="news-dot">•</span>
                <span className="news-time">{article.publishedTime}</span>
              </div>
              <p className="news-summary">{article.summary}</p>
              <a href={article.url} className="news-link" target="_blank" rel="noopener noreferrer">
                Read more <ExternalLink size={14} />
              </a>
            </motion.div>
          ))
        )}
      </div>

      {!isLoading && news.length > 0 && (
        <div className="news-load-more">
          <button className="load-more-btn">Load More News</button>
        </div>
      )}
    </div>
  );
};

export default NewsFeed;
