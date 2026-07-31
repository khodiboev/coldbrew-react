import {
  Box,
  Button,
  Container,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import Basket from "./Basket";
import React from "react";
import { CartItem } from "../../../lib/types/search";
import { useGlobals } from "../../hooks/useGlobals";
import { serverApi } from "../../../lib/config";
import { Logout } from "@mui/icons-material";
import MobileMenu from "./MobileMenu";

interface HomeNavbarProps {
  cartItems: CartItem[];
  onAdd: (item: CartItem) => void;
  onRemove: (item: CartItem) => void;
  onDelete: (item: CartItem) => void;
  onDeleteAll: () => void;
  setSignupOpen: (isOpen: boolean) => void;
  setLoginOpen: (isOpen: boolean) => void;
  handleLogoutClick: (e: React.MouseEvent<HTMLElement>) => void;
  anchorEl: null | HTMLElement;
  handleCloseLogout: () => void;
  handleLogoutRequest: () => void;
}

export default function HomeNavbar(props: HomeNavbarProps) {
  const {
    cartItems,
    onAdd,
    onRemove,
    onDelete,
    onDeleteAll,
    setSignupOpen,
    setLoginOpen,
    handleLogoutClick,
    anchorEl,
    handleCloseLogout,
    handleLogoutRequest,
  } = props;
  const { authMember } = useGlobals();

  return (
    <div className="home-navbar">
      <Container className="navbar-container">
        <Stack className="menu">

          {/* CHAP — Brand logo */}
          <Box className="brand-logo-wrap">
            <NavLink to="/">
              <img
                className="brand-logo"
                src="/icons/coldbrew-logo.svg"
                alt=""
              />
            </NavLink>
          </Box>

          {/* MARKAZ — page linklar */}
          <Stack className="links">
            <Box className={"hover-line"}>
              <NavLink to="/" activeClassName={"underline"}>
                Home
              </NavLink>
            </Box>
            <Box className={"hover-line"}>
              <NavLink to="/products" exact activeClassName={"underline"}>
                Products
              </NavLink>
            </Box>
            {authMember ? (
              <Box className={"hover-line"}>
                <NavLink to="/orders" exact activeClassName={"underline"}>
                  Orders
                </NavLink>
              </Box>
            ) : null}
            {authMember ? (
              <Box className={"hover-line"}>
                <NavLink to="/member-page" exact activeClassName={"underline"}>
                  My Page
                </NavLink>
              </Box>
            ) : null}
            <Box className={"hover-line"}>
              <NavLink to="/help" exact activeClassName={"underline"}>
                Help
              </NavLink>
            </Box>
          </Stack>

          {/* O'NG — Basket + avatar */}
          <Stack className="right-actions">
            <Box className="basket-wrap">
              <Basket
                cartItems={cartItems}
                onAdd={onAdd}
                onRemove={onRemove}
                onDelete={onDelete}
                onDeleteAll={onDeleteAll}
              />
            </Box>
            {authMember ? (
              <img
                className="user-avatar"
                src={
                  authMember?.memberImage
                    ? `${serverApi}/${authMember.memberImage}`
                    : "/icons/default-user.svg"
                }
                alt={authMember.memberNick}
                onClick={handleLogoutClick}
              />
            ) : null}
            <MobileMenu
              authMember={authMember}
              setSignupOpen={setSignupOpen}
              setLoginOpen={setLoginOpen}
              handleLogoutRequest={handleLogoutRequest}
            />
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={Boolean(anchorEl)}
              onClose={handleCloseLogout}
              onClick={handleCloseLogout}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  "& .MuiAvatar-root": {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  "&:before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem onClick={handleLogoutRequest}>
                <ListItemIcon>
                  <Logout fontSize="small" style={{ color: "#c0392b" }} />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Stack>

        </Stack>

        {/* HERO SECTION */}
        <Stack className={"header-frame"}>
          <Stack className={"detail"}>
            <Box className={"head-main-txt"}>
              Where Good <br />Mornings Begin
            </Box>
            <Box className={"wel-txt"}>Death Before Decaf</Box>
            <Box className={"service-txt"}>24/7 · Brewing since sunrise</Box>
            <Box className={"signup"}>
              {!authMember ? (
                <Stack direction="row" gap={2}>
                  <Button
                    variant={"contained"}
                    className={"signup-button"}
                    onClick={() => setSignupOpen(true)}
                  >
                    SIGN UP
                  </Button>
                  <Button
                    variant={"outlined"}
                    className={"login-button-hero"}
                    onClick={() => setLoginOpen(true)}
                  >
                    LOGIN
                  </Button>
                </Stack>
              ) : null}
            </Box>
          </Stack>
          <Stack className={"logo-frame"}>
            <div className="logo-img"></div>
          </Stack>
        </Stack>

      </Container>
    </div>
  );
}