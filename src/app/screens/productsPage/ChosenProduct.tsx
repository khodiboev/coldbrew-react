import React, { useEffect, useState } from "react";
import { Container, Stack, Box } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import Button from "@mui/material/Button";
import Rating from "@mui/material/Rating";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalCafeIcon from "@mui/icons-material/LocalCafe";
import Snackbar from "@mui/material/Snackbar";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { FreeMode, Navigation, Thumbs } from "swiper";

import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { setChosenProduct, setRestaurant } from "./slice";
import { createSelector } from "reselect";
import { retrieveChosenProduct, retrieveRestaurant } from "./selector";
import { Product } from "../../../lib/types/product";
import { ProductCollection } from "../../../lib/enums/product.enum";
import { useParams } from "react-router-dom";
import ProductService from "../../services/ProductService";
import MemberService from "../../services/MemberService";
import { Member } from "../../../lib/types/member";
import { serverApi } from "../../../lib/config";
import { CartItem } from "../../../lib/types/search";

const actionDispatch = (dispatch: Dispatch) => ({
  setRestaurant: (data: Member) => dispatch(setRestaurant(data)),
  setChosenProduct: (data: Product) => dispatch(setChosenProduct(data)),
});
const chosenProductRetriever = createSelector(
  retrieveChosenProduct,
  (chosenProduct) => ({ chosenProduct }),
);
const restaurantRetriever = createSelector(
  retrieveRestaurant,
  (restaurant) => ({ restaurant }),
);

// collection → folder mapping
const folderMap: Record<string, string> = {
  DRINK: "coffee",
  DESSERT: "desserts",
  OTHER: "bread",
  SALAD: "drinks",
  DISH: "coffee",
};

interface ChosenProductProps {
  onAdd: (item: CartItem) => void;
}

export default function ChosenProduct(props: ChosenProductProps) {
  const { onAdd } = props;
  const { productId } = useParams<{ productId: string }>();
  const { setChosenProduct, setRestaurant } = actionDispatch(useDispatch());
  const { chosenProduct } = useSelector(chosenProductRetriever);
  const { restaurant } = useSelector(restaurantRetriever);
  const [toastOpen, setToastOpen] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const product = new ProductService();
    product
      .getProduct(productId)
      .then((data) => setChosenProduct(data))
      .catch((err) => console.log(err));

    const member = new MemberService();
    member
      .getRestaurant()
      .then((data) => setRestaurant(data))
      .catch((err) => console.log(err));
  }, []);

  if (!chosenProduct) return null;

  const folder = folderMap[chosenProduct.productCollection] ?? "coffee";

  const handleAdd = () => {
    onAdd({
      _id: chosenProduct._id,
      name: chosenProduct.productName,
      price: chosenProduct.productPrice,
      quantity: 1,
      image: chosenProduct.productImages[0],
    });
    setAdded(true);
    setToastOpen(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="chosen-product">
      {/* Breadcrumb */}
      <Box className="chosen-breadcrumb">
        <span>Menu</span>
        <span className="breadcrumb-sep">›</span>
        <span>{chosenProduct.productCollection}</span>
        <span className="breadcrumb-sep">›</span>
        <span className="breadcrumb-current">{chosenProduct.productName}</span>
      </Box>

      <Container className="product-container">

        {/* LEFT — Image slider */}
        <Stack className="chosen-product-slider">
          <Swiper
            loop={true}
            spaceBetween={10}
            navigation={true}
            modules={[FreeMode, Navigation, Thumbs]}
            className="swiper-area"
          >
            {chosenProduct.productImages.map((ele: string, index: number) => {
              const imagePath = `${serverApi}/uploads/products/${folder}/${ele.split("/").pop()}`;
              return (
                <SwiperSlide key={index}>
                  <img className="slider-image" src={imagePath} alt={chosenProduct.productName} />
                </SwiperSlide>
              );
            })}
          </Swiper>
        </Stack>

        {/* RIGHT — Info */}
        <Stack className="chosen-product-info">
          <Box className="info-box">

            {/* Badge */}
            <Box className="chosen-badge">
              <LocalCafeIcon sx={{ fontSize: 14 }} />
              {chosenProduct.productCollection}
            </Box>

            {/* Name */}
            <Box className="product-name">{chosenProduct.productName}</Box>

            {/* Cafe info */}
            <Stack flexDirection="row" alignItems="center" gap={1} className="chosen-cafe-info">
              <span className="resto-name">{restaurant?.memberNick}</span>
              {restaurant?.memberPhone && (
                <>
                  <span className="chosen-dot">·</span>
                  <span className="resto-name">{restaurant.memberPhone}</span>
                </>
              )}
            </Stack>

            {/* Rating + views */}
            <Stack flexDirection="row" justifyContent="space-between" alignItems="center" className="rating-box">
              <Rating
                name="half-rating"
                defaultValue={2.5}
                precision={0.5}
                sx={{
                  "& .MuiRating-iconFilled": { color: "#e8c97a" },
                  "& .MuiRating-iconEmpty": { color: "rgba(232,201,122,0.3)" },
                }}
              />
              <Stack flexDirection="row" alignItems="center" gap={0.5} className="product-view">
                <RemoveRedEyeIcon sx={{ fontSize: 16, color: "#aaa" }} />
                <span>{chosenProduct.productViews} views</span>
              </Stack>
            </Stack>

            {/* Description */}
            <Box className="product-desc">
              {chosenProduct.productDesc || "No description available."}
            </Box>

            {/* Divider */}
            <Box className="chosen-divider" />

            {/* Price */}
            <Stack flexDirection="row" justifyContent="space-between" alignItems="center" className="product-price">
              <span>Price</span>
              <span>${chosenProduct.productPrice.toFixed(2)}</span>
            </Stack>

            {/* Add to basket */}
            <Box className="button-box">
              <Button
                variant="contained"
                className={`add-to-basket-btn ${added ? "added" : ""}`}
                startIcon={<ShoppingCartIcon />}
                onClick={handleAdd}
                fullWidth
              >
                {added ? "Added to Cart! ✓" : "Add To Basket"}
              </Button>
            </Box>

          </Box>
        </Stack>
      </Container>

      {/* Toast */}
      <Snackbar
        open={toastOpen}
        autoHideDuration={2500}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Box className="cart-toast">
          <span className="cart-toast-icon">☕</span>
          <span className="cart-toast-text">
            <strong>{chosenProduct.productName}</strong> added to cart!
          </span>
          <span className="cart-toast-check">✓</span>
        </Box>
      </Snackbar>
    </div>
  );
}