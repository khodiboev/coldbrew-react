import React, { useState } from "react";
import { Box, Container, Stack } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Coffee Enthusiast",
    avatar: "https://i.pravatar.cc/150?img=47",
    rating: 5,
    text: "The espresso here is absolutely divine. Every morning I stop by ColdBrew, and it genuinely makes my entire day better. The baristas know exactly how I like it!",
  },
  {
    id: 2,
    name: "James Kim",
    role: "Regular Customer",
    avatar: "https://i.pravatar.cc/150?img=12",
    rating: 5,
    text: "I've tried coffee shops all over the city, but nothing comes close to ColdBrew. Their cold brew selection is outstanding and the atmosphere is unmatched.",
  },
  {
    id: 3,
    name: "Emily Chen",
    role: "Food Blogger",
    avatar: "https://i.pravatar.cc/150?img=32",
    rating: 5,
    text: "As a food blogger, I'm very picky about quality. ColdBrew exceeds every expectation — from the perfectly crafted lattes to the freshly baked croissants. A must-visit!",
  },
  {
    id: 4,
    name: "Michael Torres",
    role: "Freelance Designer",
    avatar: "https://i.pravatar.cc/150?img=68",
    rating: 5,
    text: "My go-to workspace. The WiFi is fast, the coffee is incredible, and the team is always welcoming. I get my best work done here every single week.",
  },
  {
    id: 5,
    name: "Aisha Patel",
    role: "Morning Regular",
    avatar: "https://i.pravatar.cc/150?img=23",
    rating: 5,
    text: "Death Before Decaf — that's my motto, and ColdBrew lives up to it perfectly. Their Hazelnut Latte is pure magic in a cup. Highly recommended!",
  },
];

export default function ActiveUsers() {
  const [active, setActive] = useState(0);

  const prev = () => setActive((a) => (a === 0 ? testimonials.length - 1 : a - 1));
  const next = () => setActive((a) => (a === testimonials.length - 1 ? 0 : a + 1));

  const t = testimonials[active];

  return (
    <div className="active-users-frame">
      <Container>
        <Stack className="main">
          {/* Header */}
          <Stack className="testimonial-header">
            <Box className="testimonial-label">Happy Customers</Box>
            <Box className="category-title">What Our Guests Say</Box>
            <Box className="testimonial-subtitle">
              Real stories from real coffee lovers
            </Box>
          </Stack>

          {/* Main testimonial card */}
          <Stack className="testimonial-main">
            <FormatQuoteIcon className="quote-icon" />

            <Box className="testimonial-text">"{t.text}"</Box>

            {/* Stars */}
            <Stack flexDirection="row" gap="4px" justifyContent="center" sx={{ my: 2 }}>
              {[...Array(t.rating)].map((_, i) => (
                <StarIcon key={i} sx={{ color: "#e8c97a", fontSize: 22 }} />
              ))}
            </Stack>

            {/* Avatar + name */}
            <Stack flexDirection="row" alignItems="center" gap={2} justifyContent="center">
              <img src={t.avatar} alt={t.name} className="testimonial-avatar" />
              <Stack>
                <Box className="testimonial-name">{t.name}</Box>
                <Box className="testimonial-role">{t.role}</Box>
              </Stack>
            </Stack>
          </Stack>

          {/* Navigation */}
          <Stack className="testimonial-nav">
            <button className="nav-btn" onClick={prev}>
              <ArrowBackIosNewIcon sx={{ fontSize: 16 }} />
            </button>

            <Stack flexDirection="row" gap={1} alignItems="center">
              {testimonials.map((_, i) => (
                <Box
                  key={i}
                  className={`nav-dot ${i === active ? "active" : ""}`}
                  onClick={() => setActive(i)}
                />
              ))}
            </Stack>

            <button className="nav-btn" onClick={next}>
              <ArrowForwardIosIcon sx={{ fontSize: 16 }} />
            </button>
          </Stack>

          {/* Bottom avatars */}
          <Stack flexDirection="row" justifyContent="center" gap={2} sx={{ mt: 3 }}>
            {testimonials.map((item, i) => (
              <img
                key={item.id}
                src={item.avatar}
                alt={item.name}
                className={`bottom-avatar ${i === active ? "active" : ""}`}
                onClick={() => setActive(i)}
              />
            ))}
          </Stack>
        </Stack>
      </Container>
    </div>
  );
}