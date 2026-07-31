import React from "react";
import { Box, Container, Stack } from "@mui/material";
import LocalCafeIcon from "@mui/icons-material/LocalCafe";
import SpaIcon from "@mui/icons-material/Spa";
import BoltIcon from "@mui/icons-material/Bolt";
import LoyaltyIcon from "@mui/icons-material/Loyalty";

const features = [
  {
    icon: <LocalCafeIcon />,
    title: "Freshly Roasted",
    desc: "Beans roasted in small batches every week for peak flavor in every cup.",
  },
  {
    icon: <SpaIcon />,
    title: "Ethically Sourced",
    desc: "Direct trade with farmers across three continents — quality you can trust.",
  },
  {
    icon: <BoltIcon />,
    title: "Fast & Friendly",
    desc: "Skilled baristas and quick service, without ever rushing your experience.",
  },
  {
    icon: <LoyaltyIcon />,
    title: "Loyalty Rewards",
    desc: "Earn points with every order and redeem them for free drinks & treats.",
  },
];

export default function WhyUs() {
  return (
    <div className="why-us-frame">
      <Container>
        <Stack className="why-us-grid">
          {features.map((f) => (
            <Stack className="why-us-card" key={f.title}>
              <Box className="why-us-icon">{f.icon}</Box>
              <Box className="why-us-title">{f.title}</Box>
              <Box className="why-us-desc">{f.desc}</Box>
            </Stack>
          ))}
        </Stack>
      </Container>
    </div>
  );
}
