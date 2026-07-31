import React from "react";
import { Box, Container, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import LocalCafeIcon from "@mui/icons-material/LocalCafe";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import CakeIcon from "@mui/icons-material/Cake";
import BakeryDiningIcon from "@mui/icons-material/BakeryDining";
import { ProductCollection } from "../../../lib/enums/product.enum";

const categories = [
  { icon: <LocalCafeIcon />, title: "Coffee", desc: "Espresso, latte & pour-over", collection: ProductCollection.DRINK },
  { icon: <AcUnitIcon />, title: "Cold Brew", desc: "Slow-steeped, always smooth", collection: ProductCollection.SALAD },
  { icon: <CakeIcon />, title: "Desserts", desc: "Cakes, pastries & sweets", collection: ProductCollection.DESSERT },
  { icon: <BakeryDiningIcon />, title: "Bakery", desc: "Fresh bread, baked daily", collection: ProductCollection.OTHER },
];

export default function MenuCategories() {
  return (
    <div className="menu-categories-frame">
      <Container>
        <Stack className="menu-categories-header">
          <Box className="menu-categories-label">☕ Our Menu</Box>
          <Box className="menu-categories-title">Explore What We Brew</Box>
        </Stack>

        <Stack className="menu-categories-grid">
          {categories.map((cat) => (
            <Link
              to={{ pathname: "/products", state: { category: cat.collection } }}
              className="menu-category-card"
              key={cat.title}
            >
              <Box className="menu-category-icon">{cat.icon}</Box>
              <Box className="menu-category-title">{cat.title}</Box>
              <Box className="menu-category-desc">{cat.desc}</Box>
            </Link>
          ))}
        </Stack>
      </Container>
    </div>
  );
}
