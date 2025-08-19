import React from "react";
import "./ExploreMenu.css";
import { menu_list } from "../../assets/assets";

const ExploreMenu = ({ category, setCategory }) => {
  return (
    <div className="explore-menu" id="explore-menu">
      <h1>Explore Our Menu</h1>
      <p className="explore-menu-text">
        Discover flavors from around the world, freshly prepared and delivered
        to your door. From quick bites to gourmet meals, every dish is crafted
        to bring joy and satisfaction to your dining experience.
      </p>

      {/* ✅ Scrollable menu row */}
      <div className="explore-menu-list">
        {menu_list.map((item, index) => {
          const active = category === item.menu_name;
          return (
            <div
              key={index}
              onClick={() =>
                setCategory((prev) =>
                  prev === item.menu_name ? "All" : item.menu_name
                )
              }
              className={`explore-menu-card ${active ? "active" : ""}`}
            >
              <img src={item.menu_image} alt={item.menu_name} />
              <p>{item.menu_name}</p>
            </div>
          );
        })}
      </div>

      
    </div>
  );
};

export default ExploreMenu;
