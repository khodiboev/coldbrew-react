import React, { useState } from "react";
import { Box, Container, Stack } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import WhatshotIcon from "@mui/icons-material/Whatshot";

import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrievePopularDishes } from "./selector";
import { Product } from "../../../lib/types/product";
import { serverApi } from "../../../lib/config";

const popularDishesRetriever = createSelector(
  retrievePopularDishes,
  (popularDishes) => ({ popularDishes }),
);

export default function PopularDishes() {
  const { popularDishes } = useSelector(popularDishesRetriever);
  const [selected, setSelected] = useState<number>(0);

  const featured = popularDishes[selected] ?? null;
  const rest = popularDishes.filter((_, i) => i !== selected);

  return (
    <div className="popular-dishes-frame">
      <Container>
        <Stack className="popular-section">

          {/* HEADER */}
          <Stack className="bestseller-header">
            <Stack flexDirection="row" alignItems="center" gap={1}>
              <WhatshotIcon sx={{ color: "#e8c97a", fontSize: 36 }} />
              <Box className="category-title">Bestsellers</Box>
            </Stack>
            <Box className="category-subtitle">
              Our most-loved brews & bites, chosen by you
            </Box>
          </Stack>

          {popularDishes.length !== 0 ? (
            <Stack className="magazine-frame">

              {/* LEFT — Featured large card */}
              {featured && (
                <Box
                  className="featured-card"
                  style={{
                    backgroundImage: `url(${serverApi}/uploads/products/${featured.productImages[0]})`,
                  }}
                >
                  <Box className="featured-overlay" />
                  <Stack className="featured-content">
                    <Box className="featured-badge">⭐ #1 Bestseller</Box>
                    <Box className="featured-name">{featured.productName}</Box>
                    <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
                      <Box className="featured-price">
                        <AttachMoneyIcon sx={{ fontSize: 20 }} />
                        {featured.productPrice}
                      </Box>
                      <Stack flexDirection="row" alignItems="center" gap="4px" sx={{ color: "rgba(255,255,255,0.7)", fontSize: "14px" }}>
                        <VisibilityIcon sx={{ fontSize: 16 }} />
                        {featured.productViews}
                      </Stack>
                    </Stack>
                  </Stack>
                </Box>
              )}

              {/* RIGHT — Small cards grid */}
              <Stack className="small-cards-grid">
                {rest.slice(0, 4).map((product: Product, idx: number) => {
                  const realIdx = popularDishes.indexOf(product);
                  return (
                    <Box
                      key={product._id}
                      className="small-card"
                      style={{
                        backgroundImage: `url(${serverApi}/uploads/products/${product.productImages[0]})`,
                      }}
                      onClick={() => setSelected(realIdx)}
                    >
                      <Box className="small-overlay" />
                      <Stack className="small-content">
                        <Box className="small-rank">#{idx + 2}</Box>
                        <Box className="small-name">{product.productName}</Box>
                        <Box className="small-price">
                          <AttachMoneyIcon sx={{ fontSize: 14 }} />
                          {product.productPrice}
                        </Box>
                      </Stack>
                    </Box>
                  );
                })}
              </Stack>

            </Stack>
          ) : (
            <Box className="no-data">
              Bestsellers are not available now.
            </Box>
          )}

        </Stack>
      </Container>
    </div>
  );
}