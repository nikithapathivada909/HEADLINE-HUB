import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import "./index.css";

// const BACKEND_URL = "http://localhost:5000";
// ✅ Correct backend URL
const BACKEND_URL = " https://headlinehubbackend.onrender.com";
const NewsSection = ({ category, title }) => {
  const [articles, setArticles] = useState([]);
  const [savedArticles, setSavedArticles] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get(
          `https://gnews.io/api/v4/top-headlines?category=${category}&apikey=07b3cda544c2dfd17199c70aa0e1d2b9`
        );
        setArticles(res.data.articles);
      } catch (error) {
        console.error("Error fetching news articles:", error);
      }
    };
    fetchNews();
  }, [category]);

  useEffect(() => {
    const fetchSavedArticles = async () => {
      if (!user || !user.token) return; // ✅ Prevents unnecessary API calls

      try {
        const res = await axios.get(`${BACKEND_URL}/api/saved-articles`, {
          headers: { Authorization: `Bearer ${user.token}`,
          "Content-Type":"application/json"
           },
        });
        setSavedArticles(res.data);
      } catch (error) {
        console.error("Error fetching saved articles:", error);
      }
    };

    fetchSavedArticles();
  }, [user]);

  const handleSaveArticle = async (article) => {
    if (!user) return alert("Please login to save articles");

    const isSaved = savedArticles.some((saved) => saved.url === article.url);
    const url = isSaved
      ? `${BACKEND_URL}/api/saved-articles/remove-article`
      : `${BACKEND_URL}/api/saved-articles/save-article`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ title: article.title, url: article.url }),
      });

      const responseText = await response.text();

      try {
        const jsonResponse = JSON.parse(responseText); // Try parsing as JSON
        if (!response.ok) {
          throw new Error(jsonResponse.message || "Failed to save article");
        }
        setSavedArticles((prev) =>
          isSaved ? prev.filter((saved) => saved.url !== article.url) : [...prev, article]
        );
      } catch (error) {
        console.error("Invalid JSON response:", responseText);
        alert("Server error: " + responseText);
      }
    } catch (error) {
      console.error("Error saving article:", error);
    }
  };

  return (
    <section className="news-section" id={category}>
      <h2>{category}</h2>
      {!user && (
        <div className="guest-message-container">
          <p className="guest-message">Login to view full content</p>
          <button className="login-button" onClick={() => window.location.href = '/login'}>
            Login
          </button>
        </div>
      )}
      <div className="news-list">
        {articles.map((article, index) => {
          const isSaved = savedArticles.some((saved) => saved.url === article.url);
          return (
            <div key={index} className={`news-item ${!user ? 'blurred' : ''}`}>
              <img src={article.image} alt="news" className="img_show" />
              {user ? (
                <>
                  <h3 className="article_title">{article.title}</h3>
                  
                  <button onClick={() => window.open(article.url)}>Read More</button>
                  <button 
                    className={`save-button ${isSaved ? 'saved' : ''}`} 
                    onClick={() => handleSaveArticle(article)}
                  >
                    {isSaved ? "✅ Saved" : "💾 Save"}
                  </button>
                </>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default NewsSection;
