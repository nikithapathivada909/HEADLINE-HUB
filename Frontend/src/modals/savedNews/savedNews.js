import { useEffect, useState } from "react";
import axios from "axios";

const SavedArticles = () => {

    const [savedArticles, setSavedArticles] = useState([]);
    const userId = localStorage.getItem("userId"); // Retrieve userId

    // const BACKEND_URL = "http://localhost:5000";
     const BACKEND_URL = "https://headlinehubbackend.onrender.com";
    useEffect(() => {
        if (!userId) {
            console.error("User ID not found!");
            return;
        }

        axios.get(`${BACKEND_URL}/api/users/saved-articles`, {
            headers: { userId }
        })
        .then(response => setSavedArticles(response.data))
        .catch(error => console.error("Error fetching saved articles", error));
    }, [userId]);

    const removeArticle = async (articleId) => {
      try {
          await axios.delete(`${BACKEND_URL}/api/users/saved-articles/${articleId}`, {
              headers: { userId }
          });

          // ✅ Remove from UI
          setSavedArticles(savedArticles.filter(article => article.id !== articleId));
      } catch (error) {
          console.error("❌ Error deleting article:", error.response?.data || error.message);
      }
  };

    return (
        <div>
            <h2>Saved Articles</h2>
            {savedArticles.length > 0 ? (
                <ul>
                    {savedArticles.map(article => (
                        <div className="each_item">
                            <p>{article.title}</p>
                            <button onClick={() => window.open(article.url)}>Show Article</button>
                            <button className="remove-btn" onClick={() => removeArticle(article.id)}>Remove</button>
                        </div>
                    ))}
                </ul>
            ) : (
                <p>No saved articles yet.</p>
            )}
        </div>
    );
};

export default SavedArticles;
