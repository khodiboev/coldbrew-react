import React, { useState } from "react";
import { Box, Container, Stack } from "@mui/material";
import { plans } from "../../../lib/data/plans";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PeopleIcon from "@mui/icons-material/People";

export default function Events() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="events-frame">
      <Container>
        {/* Header */}
        <Stack className="events-header">
          <Box className="events-label">☕ Join Us</Box>
          <Box className="events-title">Classes & Workshops</Box>
          <Box className="events-subtitle">
            Deepen your love for coffee — one session at a time
          </Box>
        </Stack>

        {/* Cards — Staggered layout */}
        <div className="events-grid">
          {plans.map((event, idx) => (
            <div
              key={idx}
              className={`event-card ${hovered === idx ? "hovered" : ""} card-${idx}`}
              onMouseEnter={() => setHovered(idx)}
              onMouseLeave={() => setHovered(null)}
              style={{
                backgroundImage: `url(${event.img})`,
              }}
            >
              {/* Overlay */}
              <div className="event-overlay" />

              {/* Tag */}
              <div className="event-tag" style={{ background: event.color }}>
                {event.tag}
              </div>

              {/* Content */}
              <div className="event-content">
                <div className="event-name">{event.title}</div>
                <div className="event-desc">{event.desc}</div>

                <div className="event-meta">
                  <div className="event-meta-item">
                    <CalendarMonthIcon sx={{ fontSize: 14 }} />
                    {event.date}
                  </div>
                  <div className="event-meta-item">
                    <LocationOnIcon sx={{ fontSize: 14 }} />
                    {event.location}
                  </div>
                  <div className="event-meta-item">
                    <PeopleIcon sx={{ fontSize: 14 }} />
                    {event.spots} spots
                  </div>
                </div>

                <div className="event-author">by {event.author}</div>

                <button className="event-btn">Reserve a Spot →</button>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}