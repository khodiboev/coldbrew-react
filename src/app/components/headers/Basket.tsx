import React from "react";
import { Box, Button, Stack } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Menu from "@mui/material/Menu";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CloseIcon from "@mui/icons-material/Close";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { useHistory } from "react-router-dom";
import { CartItem } from "../../../lib/types/search";
import { Messages, serverApi } from "../../../lib/config";
import { sweetErrorHandling } from "../../../lib/sweetAlert";
import { useGlobals } from "../../hooks/useGlobals";
import OrderService from "../../services/OrderService";

interface BasketProps {
  cartItems: CartItem[];
  onAdd: (item: CartItem) => void;
  onRemove: (item: CartItem) => void;
  onDelete: (item: CartItem) => void;
  onDeleteAll: () => void;
}

export default function Basket(props: BasketProps) {
  const { cartItems, onAdd, onRemove, onDelete, onDeleteAll } = props;
  const { authMember, setOrderBuilder } = useGlobals();
  const history = useHistory();

  const itemsPrice = cartItems.reduce(
    (a: number, c: CartItem) => a + c.price * c.quantity, 0
  );
  const shippingCost = itemsPrice < 100 ? 5 : 0;
  const totalPrice = (itemsPrice + shippingCost).toFixed(1);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const proceedOrderHandler = async () => {
    try {
      handleClose();
      if (!authMember) throw new Error(Messages.error2);
      const order = new OrderService();
      await order.createOrder(cartItems);
      onDeleteAll();
      setOrderBuilder(new Date());
      history.push("/orders");
    } catch (err) {
      console.log("Error, proceedOrderHandler: ", err);
      sweetErrorHandling(err).then();
    }
  };

  return (
    <Box className="hover-line">
      <IconButton
        aria-label="cart"
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <Badge badgeContent={cartItems.length} color="secondary">
          <img src="/icons/shopping-cart.svg" alt="" style={{ width: 28, height: 28, filter: "brightness(0)" }} />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            borderRadius: "20px",
            border: "1px solid rgba(200,151,110,0.15)",
            boxShadow: "0 20px 60px rgba(26,20,16,0.18)",
            mt: 1.5,
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 20,
              width: 12,
              height: 12,
              bgcolor: "#1a1410",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Stack className="basket-frame">

          {/* Header */}
          <Stack className="basket-header">
            {cartItems.length === 0 ? (
              <Box className="basket-header-title">Your cart is empty</Box>
            ) : (
              <Stack flexDirection="row" justifyContent="space-between" alignItems="center" width="100%">
                <Stack flexDirection="row" alignItems="center" gap={1}>
                  <ShoppingCartIcon sx={{ fontSize: 18, color: "#e8c97a" }} />
                  <Box className="basket-header-title">Your Order</Box>
                  <Box className="basket-count">{cartItems.length}</Box>
                </Stack>
                <IconButton size="small" onClick={onDeleteAll} className="basket-clear-btn">
                  <DeleteForeverIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Stack>
            )}
          </Stack>

          {/* Items */}
          <Box className="orders-main-wrapper">
            <Box className="orders-wrapper">
              {cartItems.length === 0 ? (
                <Stack className="basket-empty">
                  <Box className="basket-empty-icon">☕</Box>
                  <Box className="basket-empty-text">Add something delicious!</Box>
                </Stack>
              ) : (
                cartItems.map((item: CartItem) => {
                  const imagePath = `${serverApi}/uploads/products/${item.image}`;
                  return (
                    <Stack className="basket-info-box" key={item._id}>
                      {/* Image */}
                      <img src={imagePath} alt={item.name} className="product-img" />

                      {/* Info */}
                      <Stack className="basket-item-info">
                        <Box className="product-name">{item.name}</Box>
                        <Box className="product-price">${item.price}</Box>
                      </Stack>

                      {/* Qty controls */}
                      <Stack className="basket-qty">
                        <IconButton size="small" className="qty-btn" onClick={() => onRemove(item)}>
                          <RemoveIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                        <Box className="qty-num">{item.quantity}</Box>
                        <IconButton size="small" className="qty-btn" onClick={() => onAdd(item)}>
                          <AddIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                      </Stack>

                      {/* Delete */}
                      <IconButton size="small" className="basket-delete-btn" onClick={() => onDelete(item)}>
                        <CloseIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                    </Stack>
                  );
                })
              )}
            </Box>
          </Box>

          {/* Footer */}
          {cartItems.length !== 0 && (
            <Stack className="basket-order">
              {/* Shipping info */}
              <Stack flexDirection="row" alignItems="center" gap={1} className="basket-shipping">
                <LocalShippingIcon sx={{ fontSize: 14, color: shippingCost === 0 ? "#4caf50" : "#e8c97a" }} />
                <Box className="basket-shipping-text">
                  {shippingCost === 0
                    ? "Free delivery! 🎉"
                    : `+$${shippingCost} shipping · Free over $100`}
                </Box>
              </Stack>

              {/* Total */}
              <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
                <Stack>
                  <Box className="basket-total-label">Total</Box>
                  <Box className="basket-total-price">${totalPrice}</Box>
                </Stack>
                <Button
                  onClick={proceedOrderHandler}
                  className="basket-order-btn"
                  variant="contained"
                  startIcon={<ShoppingCartIcon />}
                >
                  Place Order
                </Button>
              </Stack>
            </Stack>
          )}

        </Stack>
      </Menu>
    </Box>
  );
}