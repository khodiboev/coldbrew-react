import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { Box, Button, Container, Stack } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import Badge from "@mui/material/Badge";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LocalCafeIcon from "@mui/icons-material/LocalCafe";
import CakeIcon from "@mui/icons-material/Cake";
import BakeryDiningIcon from "@mui/icons-material/BakeryDining";
import LocalBarIcon from "@mui/icons-material/LocalBar";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import PublicIcon from "@mui/icons-material/Public";
import Snackbar from "@mui/material/Snackbar";

import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { setProducts } from "./slice";
import { createSelector } from "reselect";
import { retrieveProducts } from "./selector";
import { Product, ProductInquiry } from "../../../lib/types/product";
import ProductService from "../../services/ProductService";
import { ProductCollection } from "../../../lib/enums/product.enum";
import { serverApi } from "../../../lib/config";
import { useHistory } from "react-router-dom";
import { CartItem } from "../../../lib/types/search";

const actionDispatch = (dispatch: Dispatch) => ({
  setProducts: (data: Product[]) => dispatch(setProducts(data)),
});
const productsRetriever = createSelector(retrieveProducts, (products) => ({
  products,
}));

interface ProductsProps {
  onAdd: (item: CartItem) => void;
}

const categories = [
  { label: "Coffee",   value: ProductCollection.DRINK,   icon: <LocalCafeIcon />,    folder: "coffee" },
  { label: "Desserts", value: ProductCollection.DESSERT,  icon: <CakeIcon />,         folder: "desserts" },
  { label: "Bakery",   value: ProductCollection.OTHER,    icon: <BakeryDiningIcon />, folder: "bread" },
  { label: "Drinks",   value: ProductCollection.SALAD,    icon: <LocalBarIcon />,     folder: "drinks" },
];

const sortOptions = [
  { label: "Newest",      value: "createdAt" },
  { label: "Best Seller", value: "productViews" },
  { label: "Low Price",   value: "productPrice_asc" },
  { label: "High Price",  value: "productPrice_desc" },
];

const coffeeOrigins = [
  { country: "Ethiopia", region: "Yirgacheffe", flavor: "Floral & Fruity", emoji: "🇪🇹", color: "#8B4513" },
  { country: "Colombia", region: "Huila", flavor: "Caramel & Nuts", emoji: "🇨🇴", color: "#c8976e" },
  { country: "Japan",    region: "Kyoto Blend", flavor: "Smooth & Clean", emoji: "🇯🇵", color: "#1a1410" },
  { country: "Brazil",   region: "Minas Gerais", flavor: "Chocolate & Bold", emoji: "🇧🇷", color: "#2c1f14" },
];

const awards = [
  { year: "2024", title: "Best Coffee Shop", org: "Seoul Food Awards", icon: "🏆" },
  { year: "2023", title: "Top Barista Team", org: "Korea Brew Masters", icon: "☕" },
  { year: "2023", title: "Sustainability Award", org: "Green Café Korea", icon: "🌿" },
  { year: "2022", title: "Best Cold Brew", org: "Asia Beverage Expo", icon: "🥇" },
];

export default function Products(props: ProductsProps) {
  const { onAdd } = props;
  const { setProducts } = actionDispatch(useDispatch());
  const { products } = useSelector(productsRetriever);
  const [productSearch, setProductSearch] = useState<ProductInquiry>({
    page: 1,
    limit: 8,
    order: "createdAt",
    productCollection: ProductCollection.DRINK,
    search: "",
  });
  const [searchText, setSearchText] = useState<string>("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeSort, setActiveSort] = useState("Newest");
  const [toastOpen, setToastOpen] = useState(false);
  const [toastItem, setToastItem] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const history = useHistory();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    const product = new ProductService();
    product
      .getProducts({ ...productSearch })
      .then((data) => setProducts(data))
      .catch((err) => console.log(err));
  }, [productSearch]);

  useEffect(() => {
    if (searchText === "") {
      productSearch.search = "";
      setProductSearch({ ...productSearch });
    }
  }, [searchText]);

  const searchCollectionHandler = (collection: ProductCollection) => {
    productSearch.page = 1;
    productSearch.productCollection = collection;
    setProductSearch({ ...productSearch });
  };

  const searchOrderHandler = (option: { label: string; value: string }) => {
    productSearch.page = 1;
    productSearch.order = option.value;
    setProductSearch({ ...productSearch });
    setActiveSort(option.label);
    setDropdownOpen(false);
  };

  const searchProductHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    productSearch.search = searchText;
    setProductSearch({ ...productSearch });
  };

  const paginationHandler = (e: ChangeEvent<any>, value: number) => {
    productSearch.page = value;
    setProductSearch({ ...productSearch });
  };

  const chooseDishHandler = (id: string) => {
    history.push(`/products/${id}`);
  };

  const handleAddToCart = (item: CartItem) => {
    onAdd(item);
    setToastItem(item.name);
    setToastOpen(true);
  };

  const activeFolder = categories.find(
    (c) => c.value === productSearch.productCollection
  )?.folder ?? "coffee";

  return (
    <div className="products-page">
      <Container maxWidth="lg">
        <Stack flexDirection="column" alignItems="center">

          {/* ── HEADER ── */}
          <Stack className="products-header">
            <Stack className="products-header-left">
              <Box className="products-label">☕ Our Menu</Box>
              <Box className="page-title">ColdBrew Menu</Box>
              <Box className="products-subtitle">Crafted with love, served with soul</Box>
            </Stack>
            <Stack direction="row" className="search-box">
              <input
                type="text"
                placeholder="Search drinks, desserts..."
                className="search-input"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    productSearch.search = searchText;
                    setProductSearch({ ...productSearch });
                  }
                }}
              />
              <Button
                variant="contained"
                className="search-btn"
                endIcon={<SearchIcon />}
                onClick={searchProductHandler}
              >
                Search
              </Button>
            </Stack>
          </Stack>

          {/* ── CATEGORY + SORT ── */}
          <Stack className="products-main-bar">
            <Stack className="category-tabs">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  className={`category-tab ${productSearch.productCollection === cat.value ? "active" : ""}`}
                  onClick={() => searchCollectionHandler(cat.value)}
                >
                  <span className="tab-icon">{cat.icon}</span>
                  <span className="tab-label">{cat.label}</span>
                </button>
              ))}
            </Stack>
            <div className="sort-dropdown-wrap" ref={dropdownRef}>
              <button
                className={`sort-trigger ${dropdownOpen ? "open" : ""}`}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <span>{activeSort}</span>
                <KeyboardArrowDownIcon className="sort-arrow" />
              </button>
              {dropdownOpen && (
                <div className="sort-dropdown">
                  {sortOptions.map((opt) => (
                    <button
                      key={opt.value}
                      className={`sort-option ${activeSort === opt.label ? "active" : ""}`}
                      onClick={() => searchOrderHandler(opt)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </Stack>

          {/* ── PRODUCTS GRID ── */}
          <Stack className="product-wrapper">
            {products.length !== 0 ? (
              products.map((product: Product) => {
                const imagePath = `${serverApi}/uploads/products/${activeFolder}/${product.productImages[0].split("/").pop()}`;
                const sizeVolume =
                  product.productCollection === ProductCollection.DRINK
                    ? `${product.productVolume}L`
                    : product.productSize;
                return (
                  <Stack
                    key={product._id}
                    className="product-card"
                    onClick={() => chooseDishHandler(product._id)}
                  >
                    <Stack
                      className="product-img"
                      sx={{ backgroundImage: `url(${imagePath})` }}
                    >
                      <div className="product-sale">{sizeVolume}</div>
                      <Button
                        className="shop-btn"
                        onClick={(e) => {
                          handleAddToCart({
                            _id: product._id,
                            name: product.productName,
                            price: product.productPrice,
                            quantity: 1,
                            image: product.productImages[0],
                          });
                          e.stopPropagation();
                        }}
                      >
                        <img src="/icons/shopping-cart.svg" alt="" />
                      </Button>
                      <Button className="views-btn" sx={{ right: "12px" }}>
                        <Badge badgeContent={product.productViews} color="secondary">
                          <RemoveRedEyeIcon
                            sx={{ color: product.productViews === 0 ? "gray" : "white" }}
                          />
                        </Badge>
                      </Button>
                    </Stack>
                    <Box className="product-desc">
                      <span className="product-title">{product.productName}</span>
                      <div className="product-price-row">
                        <MonetizationOnIcon />
                        {product.productPrice}
                      </div>
                    </Box>
                  </Stack>
                );
              })
            ) : (
              <Box className="no-data">No products found</Box>
            )}
          </Stack>

          {/* ── PAGINATION ── */}
          <Stack className="pagination-section">
            <Pagination
              count={products.length === productSearch.limit ? productSearch.page + 1 : productSearch.page}
              page={productSearch.page}
              renderItem={(item) => (
                <PaginationItem
                  components={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                  {...item}
                  color="secondary"
                />
              )}
              onChange={paginationHandler}
            />
          </Stack>

        </Stack>
      </Container>

      {/* ── COFFEE ORIGINS + AWARDS ── */}
      <div className="extra-section">
        <Container>
          <Stack className="extra-inner">
            <Stack className="origins-box">
              <Stack flexDirection="row" alignItems="center" gap={1} className="extra-label-row">
                <PublicIcon sx={{ color: "#e8c97a", fontSize: 20 }} />
                <Box className="extra-label">Coffee Origins</Box>
              </Stack>
              <Box className="extra-title">Where Our Beans Come From</Box>
              <Stack className="origins-list">
                {coffeeOrigins.map((o, i) => (
                  <Stack key={i} className="origin-card">
                    <Box className="origin-flag">{o.emoji}</Box>
                    <Stack className="origin-info">
                      <Box className="origin-country">{o.country}</Box>
                      <Box className="origin-region">{o.region}</Box>
                      <Box className="origin-flavor">{o.flavor}</Box>
                    </Stack>
                    <Box className="origin-dot" style={{ background: o.color }} />
                  </Stack>
                ))}
              </Stack>
            </Stack>
            <div className="extra-divider" />
            <Stack className="awards-box">
              <Stack flexDirection="row" alignItems="center" gap={1} className="extra-label-row">
                <EmojiEventsIcon sx={{ color: "#e8c97a", fontSize: 20 }} />
                <Box className="extra-label">Recognition</Box>
              </Stack>
              <Box className="extra-title">Awards & Achievements</Box>
              <Stack className="awards-list">
                {awards.map((a, i) => (
                  <Stack key={i} className="award-card">
                    <Box className="award-icon">{a.icon}</Box>
                    <Stack className="award-info">
                      <Box className="award-title">{a.title}</Box>
                      <Box className="award-org">{a.org}</Box>
                    </Stack>
                    <Box className="award-year">{a.year}</Box>
                  </Stack>
                ))}
              </Stack>
            </Stack>
          </Stack>
        </Container>
      </div>

      {/* ── MAP ── */}
      <div className="address">
        <Container>
          <Stack className="address-area">
            <Box className="address-label">📍 Visit Us</Box>
            <Box className="address-title">Find Our Café</Box>
            <div className="map-container">
              <Stack className="map-info">
                <Box className="map-info-title">ColdBrew Seoul</Box>
                <Stack className="map-info-items">
                  <Stack className="map-info-item">
                    <Box className="map-info-item-label">📍 Address</Box>
                    <Box className="map-info-item-value">Gangnam-gu, Seoul<br />South Korea</Box>
                  </Stack>
                  <Stack className="map-info-item">
                    <Box className="map-info-item-label">📞 Phone</Box>
                    <Box className="map-info-item-value">+82 10 1234 5678</Box>
                  </Stack>
                  <Stack className="map-info-item">
                    <Box className="map-info-item-label">✉️ Email</Box>
                    <Box className="map-info-item-value">hello@coldbrew.kr</Box>
                  </Stack>
                  <Stack className="map-info-item">
                    <Box className="map-info-item-label">🕐 Hours</Box>
                    <Stack className="map-hours">
                      <Box className="map-hours-badge">Mon–Fri · 7AM – 10PM</Box>
                      <Box className="map-hours-badge">Sat–Sun · 8AM – 11PM</Box>
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>
              <div className="map-wrapper">
                <iframe
                  title="ColdBrew Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d202404.91416826367!2d126.80933064449653!3d37.565033714527516!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ca28b61c565cd%3A0x858aedb4e4ea83eb!2sSeoul!5e0!3m2!1sen!2skr!4v1771573359956!5m2!1sen!2skr"
                  width="100%"
                  height="480"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </Stack>
        </Container>
      </div>

      {/* ── TOAST ── */}
      <Snackbar
        open={toastOpen}
        autoHideDuration={2500}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Box className="cart-toast">
          <span className="cart-toast-icon">☕</span>
          <span className="cart-toast-text"><strong>{toastItem}</strong> added to cart!</span>
          <span className="cart-toast-check">✓</span>
        </Box>
      </Snackbar>
    </div>
  );
}