import React from "react";
import { Box, Container, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import EmailIcon from "@mui/icons-material/Email";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

export default function Footer() {
  return (
    <footer className="footer">
      {/* TOP WAVE */}
      <div className="footer-wave">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none">
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,0 L0,0 Z" fill="#f8f8ff" />
        </svg>
      </div>

      <Container>
        <Stack className="footer-inner">

          {/* LEFT — Brand */}
          <Stack className="footer-brand">
            <img src="/icons/coldbrew-logo.svg" alt="ColdBrew" className="footer-logo" />
            <Box className="footer-tagline">
              "Death Before Decaf"
            </Box>
            <Box className="footer-desc">
              Crafting exceptional coffee experiences since day one.
              Every cup tells a story — come be part of ours.
            </Box>
            {/* Social icons */}
            <Stack flexDirection="row" gap={2} sx={{ mt: 3 }}>
              <a href="#" className="social-btn">
                <img src="/icons/instagram.svg" alt="Instagram" />
              </a>
              <a href="#" className="social-btn">
                <img src="/icons/facebook.svg" alt="Facebook" />
              </a>
              <a href="#" className="social-btn">
                <img src="/icons/youtube.svg" alt="YouTube" />
              </a>
              <a href="#" className="social-btn">
                <img src="/icons/twitter.svg" alt="Twitter" />
              </a>
            </Stack>
          </Stack>

          {/* CENTER — Links */}
          <Stack className="footer-links">
            <Box className="footer-col-title">Explore</Box>
            <Stack gap={1.5} sx={{ mt: 2 }}>
              <Link to="/" className="footer-link">Home</Link>
              <Link to="/products" className="footer-link">Our Menu</Link>
              <Link to="/help" className="footer-link">Help & FAQ</Link>
            </Stack>
          </Stack>

          {/* RIGHT — Contact */}
          <Stack className="footer-contact">
            <Box className="footer-col-title">Find Us</Box>
            <Stack gap={2} sx={{ mt: 2 }}>
              <Box className="footer-contact-item">
                <LocationOnIcon sx={{ fontSize: 18, color: "#e8c97a" }} />
                <span>Seoul, Gangnam-gu, Korea</span>
              </Box>
              <Box className="footer-contact-item">
                <LocalPhoneIcon sx={{ fontSize: 18, color: "#e8c97a" }} />
                <span>+82 10 1234 5678</span>
              </Box>
              <Box className="footer-contact-item">
                <EmailIcon sx={{ fontSize: 18, color: "#e8c97a" }} />
                <span>hello@coldbrew.kr</span>
              </Box>
              <Box className="footer-contact-item">
                <AccessTimeIcon sx={{ fontSize: 18, color: "#e8c97a" }} />
                <span>Open Daily · 7AM – 11PM</span>
              </Box>
            </Stack>
          </Stack>

          {/* NEWSLETTER */}
          <Stack className="footer-newsletter">
            <Box className="footer-col-title">Stay Updated</Box>
            <Box className="footer-newsletter-desc">
              Get weekly brew tips & exclusive offers.
            </Box>
            <Stack flexDirection="row" className="newsletter-form">
              <input
                type="email"
                placeholder="your@email.com"
                className="newsletter-input"
              />
              <button className="newsletter-btn">→</button>
            </Stack>
            <Box className="footer-hours">
              <Box className="hours-badge">☕ Brewing since sunrise</Box>
            </Box>
          </Stack>

        </Stack>

        {/* DIVIDER */}
        <Box className="footer-divider" />

        {/* BOTTOM */}
        <Stack flexDirection="row" justifyContent="space-between" alignItems="center" className="footer-bottom">
          <Box className="copyright-txt">
            © 2024 ColdBrew. All rights reserved.
          </Box>
          <Box className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <span>·</span>
            <a href="#">Terms of Service</a>
          </Box>
        </Stack>
      </Container>
    </footer>
  );
}