
import React, { useState, useRef, useEffect} from "react";
import { Link } from "react-router-dom";
import ChangePassword from "../../modals/ChangePassword/ChangePassword";
import ChangeUsername from "../../modals/ChangeUsername/ChangeUsername";
import "./index.css";

const categories = [
  "technology",
  "sports",
  "world",
  "nation",
  "business",
];

const AdminDashboard = () => {
  const [specialUsers, setSpecialUsers] = useState([]);
  const [normalUsers, setNormalUsers] = useState([]);
  const [roleDropdownVisible, setRoleDropdownVisible] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState({});
  const [editUser, setEditUser] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isChangeUsernameOpen, setIsChangeUsernameOpen] = useState(false);
  const dropdownRef = useRef(null);
  useEffect(() => {
    const fetchSpecialUsers = async () => {
      try {
        const response = await fetch("https://headlinehubbackend.onrender.com/api/admin/get-special-users");
        const data = await response.json();
        setSpecialUsers(data); // Ensure this includes category
      } catch (error) {
        console.error("Error fetching special users:", error);
      }
    };
  
    const fetchNormalUsers = async () => {
      try {
        const response = await fetch("https://headlinehubbackend.onrender.com/api/admin/get-users");
        const data = await response.json();
        setNormalUsers(data);
      } catch (error) {
        console.error("Error fetching normal users:", error);
      }
    };
  
    fetchSpecialUsers();
    fetchNormalUsers();
  }, []);
  
  const assignRole = async (id) => {
    if (!selectedCategory[id]) return;
    try {
      await fetch("https://headlinehubbackend.onrender.com/api/admin/assign-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: id, category: selectedCategory[id] }),
      });
      setSpecialUsers([
        ...specialUsers,
        {
          ...normalUsers.find((user) => user.id === id),
          role: "special",
          category: selectedCategory[id],
        },
      ]);
      setNormalUsers(normalUsers.filter((user) => user.id !== id));
      setRoleDropdownVisible(null);
    } catch (error) {
      console.error("Error assigning role:", error);
    }
  };

  const updateCategory = async (id) => {
    if (!selectedCategory[id]) return;
    try {
      await fetch("https://headlinehubbackend.onrender.com/api/admin/update-category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: id, category: selectedCategory[id] }),
      });
      setSpecialUsers(
        specialUsers.map((user) =>
          user.id === id ? { ...user, category: selectedCategory[id] } : user
        )
      );
      setEditUser(null);
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  const revertUser = async (id) => {
    try {
      await fetch("https://headlinehubbackend.onrender.com/api/admin/revert-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: id }),
      });
      const revertedUser = specialUsers.find((user) => user.id === id);
      setSpecialUsers(specialUsers.filter((user) => user.id !== id));
      setNormalUsers([
        ...normalUsers,
        { ...revertedUser, role: "user", category: null },
      ]);
    } catch (error) {
      console.error("Error reverting user:", error);
    }
  };
  const toggleDropdown = (id) => {
    setRoleDropdownVisible((prev) => (prev === id ? null : id));
  };
  
  const deleteUser = async (id, isSpecial) => {
    try {
      await fetch("https://headlinehubbackend.onrender.com/api/admin/remove-user/${id}", {
        method: "DELETE",
      });
      if (isSpecial) {
        setSpecialUsers(specialUsers.filter((user) => user.id !== id));
      } else {
        setNormalUsers(normalUsers.filter((user) => user.id !== id));
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
  };

  return (
    <div className="admin-dashboard">
      <header className="header">
        <div className="dashboard-title">
          <span className="title">Headline Hub</span>
        </div>
        <div className="user-profile" ref={dropdownRef}>
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFMU8xN7Eomz1Bh06wEOhEyvHi06UGtAakVA&s"
            alt="Profile"
            className="profile-icon"
            onClick={() => setDropdownVisible(!dropdownVisible)}
          />
          {dropdownVisible && (
            <div className="profile-dropdown">
              <p>
                <strong>Username:</strong> AdminUser
              </p>
              <p>
                <strong>Email:</strong> admin@example.com
              </p>
              <button
                className="dropdown-button"
                onClick={() => setIsChangeUsernameOpen(true)}
              >
                Change Username
              </button>
              <button
                className="dropdown-button"
                onClick={() => setIsChangePasswordOpen(true)}
              >
                Change Password
              </button>
              <Link to="/login" className="dropdown-link">
                <button className="logout" onClick={handleLogout}>Logout</button>
              </Link>
            
            </div>
          )}
        </div>
      </header>
      <ChangeUsername
        isOpen={isChangeUsernameOpen}
        onClose={() => setIsChangeUsernameOpen(false)}
        currentUsername="johndoe"
        onSave={(newUsername) => console.log("New Username:", newUsername)}
      />
      <ChangePassword
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
        currentUsername="johndoe"
        onSave={(newPassword) => console.log("New Password:", newPassword)}
      />

      <div className="special-user-panel">
        <h3>Special User Panel</h3>
        {specialUsers.map((user) => (
          <div key={user.id} className="user-container">
            <span className="username">{user.name}</span>
            <span className="email">{user.email}</span>
            {/* {editUser === user.id ? (
              <div>
                <select onChange={(e) => setSelectedCategory({ ...selectedCategory, [user.id]: e.target.value })}>
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <button onClick={() => updateCategory(user.id)}>Save</button>
              </div>
            ) : (
              <span className="category">{user.category}</span>
            )} */}
            {editUser === user.id ? (
              <div>
                <select
                  value={selectedCategory[user.id] || user.category} // Set default value to user's category
                  onChange={(e) =>
                    setSelectedCategory({
                      ...selectedCategory,
                      [user.id]: e.target.value,
                    })
                  }
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <button onClick={() => updateCategory(user.id)}>Save</button>
              </div>
            ) : (
              <span className="category">
                {user.category || "No Category Assigned"}
              </span> // Display "No Category Assigned" if null
            )}

            <button
              className="edit-button"
              onClick={() => setEditUser(user.id)}
            >
              ✏️
            </button>
            <button
              className="delete-button"
              onClick={() => deleteUser(user.id, true)}
            >
              🗑️
            </button>
            <button
              className="revert-button"
              onClick={() => revertUser(user.id)}
            >
              ↩️ Revert
            </button>
          </div>
        ))}
      </div>

      <div className="normal-user-panel">
        <h3>Normal User Panel</h3>
        {normalUsers.map((user) => (
          <div key={user.id} className="user-container">
            <span className="username">{user.name}</span>
            <span className="email">{user.email}</span>
            <button onClick={() => toggleDropdown(user.id)}>Assign Role</button>
            {roleDropdownVisible === user.id && (
              <div>
                <select
                  onChange={(e) =>
                    setSelectedCategory({ ...selectedCategory, [user.id]: e.target.value })
                  }
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <button onClick={() => assignRole(user.id)}>Assign</button>
              </div>
            )}
            <button className="delete-button" onClick={() => deleteUser(user.id, false)}>🗑️</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
