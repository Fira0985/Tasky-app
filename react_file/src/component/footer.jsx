import React from "react";
import image from '../asset/69KTbX-LogoMakr.png';
import '../styles/footer.css';

function Footer(){
    return(
<footer className="footer" >
    <div className="footer-container">
        <div className="footer-logo">
            <a href="#"><img src={image} alt="Tasky App Logo" /></a>
            <p>Tasky App: Your Personal Task Manager</p>
        </div>

        <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
                <li><a href="#howItWorks">How It Works</a></li>
                <li><a href="#">Support Us</a></li>
                <li><a href="#download">Download</a></li>
            </ul>
        </div>

        <div className="footer-social">
            <h4>Follow Us</h4>
            <div className="social-icons">
                <a href="#"><img src="icon-facebook.png" alt="Facebook" /></a>
                <a href="#"><img src="icon-twitter.png" alt="Twitter" /></a>
                <a href="#"><img src="icon-instagram.png" alt="Instagram" /></a>
                <a href="#"><img src="icon-linkedin.png" alt="LinkedIn" /></a>
            </div>
        </div>
    </div>

    <div className="footer-bottom">
        <p>&copy; 2024 Tasky App. All Rights Reserved.</p>
    </div>
</footer>

    )
}

export default Footer