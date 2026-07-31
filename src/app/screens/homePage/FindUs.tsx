import React from "react";
import { Box, Container, Stack } from "@mui/material";

export default function FindUs() {
  return (
    <div className="find-us-frame">
      <Container>
        <Stack className="find-us-header">
          <Box className="find-us-label">📍 Visit Us</Box>
          <Box className="find-us-title">Find Our Flagship Café</Box>
        </Stack>

        <div className="find-us-container">
          <Stack className="find-us-info">
            <Box className="find-us-info-title">ColdBrew Seoul</Box>
            <Stack className="find-us-info-items">
              <Stack className="find-us-info-item">
                <Box className="find-us-info-label">📍 Address</Box>
                <Box className="find-us-info-value">
                  Gangnam-gu, Seoul<br />South Korea
                </Box>
              </Stack>
              <Stack className="find-us-info-item">
                <Box className="find-us-info-label">📞 Phone</Box>
                <Box className="find-us-info-value">+82 10 1234 5678</Box>
              </Stack>
              <Stack className="find-us-info-item">
                <Box className="find-us-info-label">✉️ Email</Box>
                <Box className="find-us-info-value">hello@coldbrew.kr</Box>
              </Stack>
              <Stack className="find-us-info-item">
                <Box className="find-us-info-label">🕐 Hours</Box>
                <Stack className="find-us-hours">
                  <Box className="find-us-hours-badge">Mon–Fri · 7AM – 10PM</Box>
                  <Box className="find-us-hours-badge">Sat–Sun · 8AM – 11PM</Box>
                </Stack>
              </Stack>
            </Stack>
          </Stack>

          <div className="find-us-map-wrapper">
            <iframe
              title="ColdBrew Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d202404.91416826367!2d126.80933064449653!3d37.565033714527516!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ca28b61c565cd%3A0x858aedb4e4ea83eb!2sSeoul!5e0!3m2!1sen!2skr!4v1771573359956!5m2!1sen!2skr"
              width="100%"
              height="100%"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </Container>
    </div>
  );
}
