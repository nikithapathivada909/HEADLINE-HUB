import { useState, useEffect } from "react";
import {useNavigate} from "react-router-dom";
import ChangePassword from "../../modals/ChangePassword/ChangePassword";
import ChangeUsername from "../../modals/ChangeUsername/ChangeUsername";
import "./index.css";

const API_URL = "https://headlinehubbackend.onrender.com/api/posts";

const initialPost = {
  title: "",
  description: "",
  content: "",
  url: "",
  image: "",
  published_at: new Date().toISOString(),
  source_name: "",
  source_url: "",
  is_draft: true,
};

export default function PostManagement() {
  const [posts, setPosts] = useState([]);
  const [post, setPost] = useState(initialPost);
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isChangeUsernameOpen, setIsChangeUsernameOpen] = useState(false);
  const [username, setUsername] = useState("specialperson");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401) {
        console.error("Unauthorized! Please log in again.");
        return;
      }

      const data = await response.json();
      console.log("Fetched posts:", data);

      setPosts(Array.isArray(data) ? data : []); // Ensure posts is always an array
    } catch (error) {
      console.error("Error fetching posts:", error);
      setPosts([]); // Set empty array in case of error
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const method = isEditing ? "PUT" : "POST";
      const endpoint = isEditing ? `${API_URL}/${post.id}` : API_URL;
      await fetch(endpoint, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(post),
      });
      fetchPosts();
      resetForm();
    } catch (error) {
      console.error("Error saving post:", error);
    }
  };

  const handleSaveDraft = async () => {
    try {
      await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...post, is_draft: true }),
      });
      fetchPosts();
      resetForm();
    } catch (error) {
      console.error("Error saving draft:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      fetchPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handlePublishDraft = async (id) => {
    try {
      await fetch(`${API_URL}/${id}/publish`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      fetchPosts();
    } catch (error) {
      console.error("Error publishing draft:", error);
    }
  };
  const handleEdit = (post) => {
    setPost(post);
    setIsEditing(true);
    setShowForm(true);
  };
  const handleLogout = () => {
    console.log("User logged out");
    // Add logout logic here (e.g., clearing authentication tokens, redirecting to login page)
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  const resetForm = () => {
    setPost(initialPost);
    setIsEditing(false);
    setShowForm(false);
  };

  return (
    <div className="post-management-container">
      <div className="dashboard-heading">
        <h1>Dashboard</h1>
        <i
          className="fas fa-user user-profile"
          onClick={() => setShowDropdown(!showDropdown)}
        ></i>
        {showDropdown && (
          <div className="user-dropdown active">
            <p>Username: {username}</p>
            <button onClick={() => setIsChangeUsernameOpen(true)}>
              Change Username
            </button>
            <button onClick={() => setIsChangePasswordOpen(true)}>
              Change Password
            </button>
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>

      <button className="add-post-button" onClick={() => setShowForm(true)}>
        Add Post
      </button>

      <ChangeUsername
        isOpen={isChangeUsernameOpen}
        onClose={() => setIsChangeUsernameOpen(false)}
        currentUsername={username}
        onSave={(newUsername) => setUsername(newUsername)}
      />
      <ChangePassword
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
        currentUsername={username}
        onSave={(newPassword) => console.log("Password changed successfully")}
      />

      {showForm && (
        <div className="post-form">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={post.title}
            onChange={handleChange}
          />
          <textarea
            name="description"
            placeholder="Description"
            value={post.description}
            onChange={handleChange}
          />
          <textarea
            name="content"
            placeholder="Content"
            value={post.content}
            onChange={handleChange}
          />
          <input
            type="text"
            name="url"
            placeholder="Article URL"
            value={post.url}
            onChange={handleChange}
          />
          <input
            type="text"
            name="image"
            placeholder="Image URL"
            value={post.image}
            onChange={handleChange}
          />
          <input
            type="text"
            name="source_name"
            placeholder="Source Name"
            value={post.source_name}
            onChange={handleChange}
          />
          <input
            type="text"
            name="source_url"
            placeholder="Source URL"
            value={post.source_url}
            onChange={handleChange}
          />
          <button onClick={handleSubmit}>
            {isEditing ? "Save Changes" : "Upload Post"}
          </button>
          <button onClick={handleSaveDraft}>Save as Draft</button>
          <button onClick={resetForm}>Close</button>
        </div>
      )}

      <div className="post-list">
        <h2>Posts</h2>
        {posts.map((p) => (
          <div
            key={p.id}
            className={`post-card ${p.is_draft ? "draft-card" : ""}`}
          >
            <h3>{p.title}</h3>
            <p>
              {p.is_draft
                ? "Draft (Not Published)"
                : new Date(p.published_at).toLocaleString()}
            </p>
            <button onClick={() => handleEdit(p)}>✏️ Edit</button>
            <button onClick={() => handleDelete(p.id)}>🗑️</button>
            {p.is_draft && (
              <button onClick={() => handlePublishDraft(p.id)}>Publish</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
