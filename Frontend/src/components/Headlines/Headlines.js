 import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./index.css"; // Ensure CSS is linked properly

const Headlines = () => {
  const [newsList, setNewsList] = useState([]);

  useEffect(() => {
    fetch(
      "https://gnews.io/api/v4/top-headlines?country=in&category=world&apikey=738d2636c58b28ca47c26db8366d92a5"
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.articles) {
          setNewsList(data.articles);
        }
      })
      .catch((error) => console.error("Error fetching news:", error));
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    accessibility: true, // ✅ Improves ARIA behavior
    beforeChange: (current, next) => {
      document.querySelectorAll(".carousel-slide").forEach((slide, index) => {
        slide.setAttribute("aria-hidden", index !== next); // ✅ Ensures only active slide is visible to screen readers
        if (index !== next) {
          slide.setAttribute("inert", ""); // ✅ Makes inactive slides unfocusable
        } else {
          slide.removeAttribute("inert");
        }
      });
    },
  };

  return (
    <div className="carousel-container">
      <Slider {...settings}>
                {newsList.map((newsItem, index) => (
   <div
    key={index}
    className="carousel-slide"
  >
     <div className="overlay">
      <img src={newsItem.image} alt="news_image" className="background-img"/>
       <p className="content-title">{newsItem.title}</p>
    </div>
   </div>
 ))}

       </Slider>
     </div>
   );
 };

 export default Headlines;
