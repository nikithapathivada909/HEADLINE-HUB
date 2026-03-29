import React from "react";
import NavBar from '../../components/NavBar/NavBar'
import Headlines from '../../components/Headlines/Headlines'
import NewsSection from "../../components/NewsSection/NewsSection";
import Footer from "../../components/Footer/Footer";

const Home = () => {
  return (
    <div className="home-container">
      <NavBar/>
      <Headlines />
      <NewsSection category ="business"/>
      <NewsSection category = "sports"/>
      <NewsSection category = "technology"/>
      <NewsSection category = "world"/>
      <NewsSection category = "nation"/>
      <Footer/>
    </div>
  );
};
export default Home;