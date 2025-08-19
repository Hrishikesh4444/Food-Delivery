import React from "react";
import "./Footer.css";
import { assets } from "../../assets/assets";

const Footer = () => {
  return (
    <footer className="footer" id="footer">
      <div className="footer-content">
        {/* Left Section */}
        <div className="footer-section footer-left">
          <img src={assets.logo1} alt="Logo" className="footer-logo" />
          <p>
            Delicious food delivered at your doorstep. We bring flavors of the
            world with fresh ingredients and quick service.
          </p>
          <div className="footer-social">
            <img src={assets.facebook_icon} alt="facebook" />
            <img src={assets.twitter_icon} alt="twitter" />
            <img src={assets.linkedin_icon} alt="linkedin" />
          </div>
        </div>

        {/* Middle Section */}
        <div className="footer-section footer-links">
          <h2>Company</h2>
          <ul>
            <li>Home</li>
            <li>About Us</li>
            <li>Delivery</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        {/* Right Section */}
        <div className="footer-section footer-contact">
          <h2>Get in Touch</h2>
          <ul>
            <li>📞 +1-212-456-7890</li>
            <li>📧 contact@foodiego.com</li>
          </ul>
        </div>
      </div>

      <hr />

      <p className="footer-bottom">
        © 2025 FoodieGo.com — All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;
