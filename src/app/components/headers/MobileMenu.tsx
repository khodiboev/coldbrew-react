import React, { useState } from "react";
import { Box, Drawer, IconButton, Stack } from "@mui/material";
import { NavLink } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import LogoutIcon from "@mui/icons-material/Logout";
import { Member } from "../../../lib/types/member";

interface MobileMenuProps {
  authMember: Member | null;
  setSignupOpen: (isOpen: boolean) => void;
  setLoginOpen: (isOpen: boolean) => void;
  handleLogoutRequest: () => void;
}

export default function MobileMenu(props: MobileMenuProps) {
  const { authMember, setSignupOpen, setLoginOpen, handleLogoutRequest } = props;
  const [open, setOpen] = useState<boolean>(false);

  const closeMenu = () => setOpen(false);

  return (
    <>
      <IconButton
        className="mobile-menu-btn"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
      >
        <MenuIcon />
      </IconButton>

      <Drawer anchor="right" open={open} onClose={closeMenu}>
        <Box className="mobile-drawer">
          <Stack className="mobile-drawer-header">
            <img
              className="mobile-drawer-logo"
              src="/icons/coldbrew-logo.svg"
              alt="ColdBrew"
            />
            <IconButton aria-label="Close menu" onClick={closeMenu}>
              <CloseIcon />
            </IconButton>
          </Stack>

          <Stack className="mobile-drawer-links">
            <NavLink to="/" exact onClick={closeMenu} activeClassName="active">
              Home
            </NavLink>
            <NavLink to="/products" exact onClick={closeMenu} activeClassName="active">
              Products
            </NavLink>
            {authMember ? (
              <NavLink to="/orders" exact onClick={closeMenu} activeClassName="active">
                Orders
              </NavLink>
            ) : null}
            {authMember ? (
              <NavLink to="/member-page" exact onClick={closeMenu} activeClassName="active">
                My Page
              </NavLink>
            ) : null}
            <NavLink to="/help" exact onClick={closeMenu} activeClassName="active">
              Help
            </NavLink>
          </Stack>

          <Stack className="mobile-drawer-actions">
            {authMember ? (
              <button
                className="mobile-drawer-btn logout"
                onClick={() => {
                  closeMenu();
                  handleLogoutRequest();
                }}
              >
                <LogoutIcon sx={{ fontSize: 18 }} />
                Logout
              </button>
            ) : (
              <>
                <button
                  className="mobile-drawer-btn signup"
                  onClick={() => {
                    closeMenu();
                    setSignupOpen(true);
                  }}
                >
                  Sign Up
                </button>
                <button
                  className="mobile-drawer-btn login"
                  onClick={() => {
                    closeMenu();
                    setLoginOpen(true);
                  }}
                >
                  Login
                </button>
              </>
            )}
          </Stack>
        </Box>
      </Drawer>
    </>
  );
}
