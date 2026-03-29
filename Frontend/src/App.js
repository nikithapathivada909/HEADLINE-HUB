import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext"; 
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";

import UserDashboard from "./pages/UserDashboard/UserDashboard";
import PostManagement from "./pages/PostManagement/PostManagement";
// import UserList from "./pages/UserList/UserList";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Home from "./pages/Home/Home";
import NotFound from './components/NotFound/Notfound'
// import Footer from "./components/Footer/Footer"

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/" />;

  return children;
};

const App = () => {
  return (
    <AuthProvider>
      {" "}
      {/* Wrap the app inside AuthProvider */}
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/sign-up" element={<Signup />} />
            {/* <Route path="/post-management" element={<PostManagement />} />
            <Route path="/admin" element={<AdminDashboard />} /> */}
            {/* Protected Routes Based on User Role */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            {/* <Route
              path="/special-person"
              element={
                <ProtectedRoute allowedRoles={["special_person"]}>
                  <SpecialPersonDashboard />
                </ProtectedRoute>
              }
            /> */}
            <Route
              path="/user"
              element={
                <ProtectedRoute allowedRoles={["user", "special_person"]}>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/post-management"
              element={
                <ProtectedRoute allowedRoles={["special_person"]}>
                  <PostManagement />
                </ProtectedRoute>
              }
            />
            {/* <Route
              path="/user-list"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <UserList />
                </ProtectedRoute>
              }
            /> */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
