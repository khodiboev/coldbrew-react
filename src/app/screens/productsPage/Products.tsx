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
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import Snackbar from "@mui/material/Snackbar";

import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { setProducts } from "./slice";
import { createSelector } from "reselect";
import { retrieveProducts } from "./selector";
import { Product, ProductInquiry } from "../../../lib/types/product";
import ProductService from "../../services/ProductService";
import { ProductCollection } from "../../../lib/enums/product.enum";
import { useHistory, useLocation } from "react-router-dom";
import { CartItem } from "../../../lib/types/search";
import { sweetErrorHandling } from "../../../lib/sweetAlert";
import { getProductImageUrl } from "../../../lib/utils/productImage";

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
  { label: "Coffee",   value: ProductCollection.DRINK,   icon: <LocalCafeIcon /> },
  { label: "Desserts", value: ProductCollection.DESSERT, icon: <CakeIcon /> },
  { label: "Bakery",   value: ProductCollection.OTHER,   icon: <BakeryDiningIcon /> },
  { label: "Drinks",   value: ProductCollection.SALAD,   icon: <LocalBarIcon /> },
];

const sortOptions = [
  { label: "Newest",      value: "createdAt" },
  { label: "Best Seller", value: "productViews" },
  { label: "Low Price",   value: "productPrice_asc" },
  { label: "High Price",  value: "productPrice_desc" },
];

const coffeeOrigins = [
  { country: "Ethiopia", region: "Yirgacheffe",  flavor: "Floral & Fruity",    emoji: "🇪🇹", color: "#8B4513" },
  { country: "Colombia", region: "Huila",         flavor: "Caramel & Nuts",     emoji: "🇨🇴", color: "#c8976e" },
  { country: "Japan",    region: "Kyoto Blend",   flavor: "Smooth & Clean",     emoji: "🇯🇵", color: "#1a1410" },
  { country: "Brazil",   region: "Minas Gerais",  flavor: "Chocolate & Bold",   emoji: "🇧🇷", color: "#2c1f14" },
];

const awards = [
  { year: "2024", title: "Best Coffee Shop",    org: "Seoul Food Awards",      icon: "🏆" },
  { year: "2023", title: "Top Barista Team",    org: "Korea Brew Masters",     icon: "☕" },
  { year: "2023", title: "Sustainability Award",org: "Green Café Korea",       icon: "🌿" },
  { year: "2022", title: "Best Cold Brew",      org: "Asia Beverage Expo",     icon: "🥇" },
];

export default function Products(props: ProductsProps) {
  const { onAdd } = props;
  const { setProducts } = actionDispatch(useDispatch());
  const { products } = useSelector(productsRetriever);
  const location = useLocation<{ category?: ProductCollection }>();

  const [productSearch, setProductSearch] = useState<ProductInquiry>({
    page: 1,
    limit: 8,
    order: "createdAt",
    productCollection: location.state?.category ?? ProductCollection.DRINK,
    search: "",
  });
  const [searchText, setSearchText] = useState<string>("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeSort, setActiveSort] = useState("Newest");
  const [toastOpen, setToastOpen] = useState(false);
  const [toastItem, setToastItem] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const history = useHistory();

  // Dropdown tashqarisiga bossa yopiladi
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // productSearch o'zgarganda API chaqiriladi
  useEffect(() => {
    const product = new ProductService();
    product
      .getProducts({ ...productSearch })
      .then((data) => setProducts(data))
      .catch((err) => {
        console.log(err);
        sweetErrorHandling(err).then();
      });
    // setProducts har renderda actionDispatch orqali qayta yaratiladi, deps'ga qo'shish
    // cheksiz sikl keltirib chiqaradi - faqat productSearch o'zgarganda ishga tushishi kerak.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productSearch]);

  // ── REAL-TIME SEARCH (debounce 400ms) ──
  // Foydalanuvchi yozishni to'xtatgandan 400ms keyin qidiradi
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      setProductSearch((prev) => ({
        ...prev,
        page: 1,
        search: searchText,
      }));
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchText]);

  const searchCollectionHandler = (collection: ProductCollection) => {
    setProductSearch((prev) => ({
      ...prev,
      page: 1,
      productCollection: collection,
    }));
  };

  const searchOrderHandler = (option: { label: string; value: string }) => {
    setProductSearch((prev) => ({
      ...prev,
      page: 1,
      order: option.value,
    }));
    setActiveSort(option.label);
    setDropdownOpen(false);
  };

  const paginationHandler = (e: ChangeEvent<any>, value: number) => {
    setProductSearch((prev) => ({ ...prev, page: value }));
  };

  const chooseDishHandler = (id: string) => {
    history.push(`/products/${id}`);
  };

  const handleAddToCart = (item: CartItem) => {
    onAdd(item);
    setToastItem(item.name);
    setToastOpen(true);
  };

  // Eng ko'p ko'rilgan 5 ta mahsulot — "Barista's Pick" bo'limi uchun,
  // har 5 soniyada navbat bilan almashib turadi
  const topPicks = [...products]
    .sort((a, b) => b.productViews - a.productViews)
    .slice(0, 5);
  const [pickIndex, setPickIndex] = useState(0);

  useEffect(() => {
    setPickIndex(0);
    if (topPicks.length < 2) return;
    const timer = setInterval(() => {
      setPickIndex((prev) => (prev + 1) % topPicks.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [topPicks.length, productSearch.productCollection]);

  const baristasPick = topPicks.length ? topPicks[pickIndex % topPicks.length] : null;

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

            {/* Search — tugmasiz, real-time */}
            <Stack direction="row" className="search-box">
              <input
                type="text"
                placeholder="Search drinks, desserts..."
                className="search-input"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <Button
                variant="contained"
                className="search-btn"
                endIcon={<SearchIcon />}
                onClick={() => {
                  // debounce kutmasdan darhol qidirish
                  if (debounceRef.current) clearTimeout(debounceRef.current);
                  setProductSearch((prev) => ({
                    ...prev,
                    page: 1,
                    search: searchText,
                  }));
                }}
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
                const imagePath = getProductImageUrl(product.productCollection, product.productImages[0]);
                const sizeVolume =
                  product.productCollection === ProductCollection.SALAD
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
                          e.stopPropagation();
                          handleAddToCart({
                            _id: product._id,
                            name: product.productName,
                            price: product.productPrice,
                            quantity: 1,
                            image: product.productImages[0],
                          });
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
              count={
                products.length === productSearch.limit
                  ? productSearch.page + 1
                  : productSearch.page
              }
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

      {/* ── BARISTA'S PICK ── */}
      {baristasPick && (
        <div className="baristas-pick-frame">
          <Container>
            <Stack className="baristas-pick-card" key={baristasPick._id}>
              <Box
                className="baristas-pick-img fade-in"
                sx={{
                  backgroundImage: `url(${getProductImageUrl(
                    baristasPick.productCollection,
                    baristasPick.productImages[0],
                  )})`,
                }}
              />
              <Stack className="baristas-pick-info fade-in">
                <Stack flexDirection="row" alignItems="center" gap={1} className="baristas-pick-tag">
                  <LocalFireDepartmentIcon sx={{ fontSize: 16 }} />
                  Barista's Pick
                </Stack>
                <Box className="baristas-pick-name">{baristasPick.productName}</Box>
                <Box className="baristas-pick-desc">
                  {baristasPick.productDesc || "Our most-viewed favorite right now — loved by fellow coffee lovers."}
                </Box>
                <Stack flexDirection="row" alignItems="center" gap={3} className="baristas-pick-meta">
                  <span className="baristas-pick-price">
                    <MonetizationOnIcon sx={{ fontSize: 18 }} />
                    {baristasPick.productPrice}
                  </span>
                  <span className="baristas-pick-views">
                    <RemoveRedEyeIcon sx={{ fontSize: 16 }} />
                    {baristasPick.productViews} views
                  </span>
                </Stack>
                <Button
                  variant="contained"
                  className="baristas-pick-btn"
                  onClick={() =>
                    handleAddToCart({
                      _id: baristasPick._id,
                      name: baristasPick.productName,
                      price: baristasPick.productPrice,
                      quantity: 1,
                      image: baristasPick.productImages[0],
                    })
                  }
                >
                  Add To Basket
                </Button>
                {topPicks.length > 1 && (
                  <Stack flexDirection="row" gap={1} className="baristas-pick-dots">
                    {topPicks.map((p, i) => (
                      <Box
                        key={p._id}
                        className={`baristas-pick-dot ${i === pickIndex ? "active" : ""}`}
                        onClick={() => setPickIndex(i)}
                      />
                    ))}
                  </Stack>
                )}
              </Stack>
            </Stack>
          </Container>
        </div>
      )}

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

      {/* ── TOAST ── */}
      <Snackbar
        open={toastOpen}
        autoHideDuration={2500}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Box className="cart-toast">
          <span className="cart-toast-icon">☕</span>
          <span className="cart-toast-text">
            <strong>{toastItem}</strong> added to cart!
          </span>
          <span className="cart-toast-check">✓</span>
        </Box>
      </Snackbar>
    </div>
  );
}