import React from "react";
import { Box, Stack } from "@mui/material";
import Button from "@mui/material/Button";
import TabPanel from "@mui/lab/TabPanel";
import "../../../css/order.css";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrievePausedOrders } from "./selector";
import { Product } from "../../../lib/types/product";
import { Messages, serverApi } from "../../../lib/config";
import { Order, OrderItem, OrderUpdateInput } from "../../../lib/types/orders";
import { T } from "../../../lib/types/common";
import { OrderStatus } from "../../../lib/enums/order.enum";
import { useGlobals } from "../../hooks/useGlobals";
import OrderService from "../../services/OrderService";

const pausedOrdersRetriever = createSelector(retrievePausedOrders, (pausedOrders) => ({ pausedOrders }));
const folderMap: Record<string, string> = { DRINK: "coffee", DESSERT: "desserts", OTHER: "bread", SALAD: "drinks", DISH: "coffee" };

interface PausedOrdersProps { setValue: (input: string) => void; }

export default function PausedOrders({ setValue }: PausedOrdersProps) {
  const { authMember, setOrderBuilder } = useGlobals();
  const { pausedOrders } = useSelector(pausedOrdersRetriever);

  const deleteOrderHandler = async (e: T) => {
    try {
      if (!authMember) throw new Error(Messages.error2);
      if (window.confirm("Cancel this order?")) {
        const order = new OrderService();
        await order.updateOrders({ orderId: e.target.value, orderStatus: OrderStatus.DELETE });
        setOrderBuilder(new Date());
      }
    } catch (err) { console.log(err); }
  };

  const processOrderHandler = async (e: T) => {
    try {
      if (!authMember) throw new Error(Messages.error2);
      if (window.confirm("Proceed to payment?")) {
        const order = new OrderService();
        await order.updateOrders({ orderId: e.target.value, orderStatus: OrderStatus.PROCESS });
        setValue("2");
        setOrderBuilder(new Date());
      }
    } catch (err) { console.log(err); }
  };

  return (
    <TabPanel value="1">
      <Stack>
        {pausedOrders.map((order: Order) => (
          <Box key={order._id} className="order-main-box">
            {/* Dark header stripe */}
            <Box className="order-card-header">
              <span className="order-status-badge status-paused">⏸ Awaiting Payment</span>
              <span style={{ fontFamily: "Poppins", fontSize: 12, color: "rgba(255,255,255,0.35)" }}>
                #{order._id?.toString().slice(-6).toUpperCase()}
              </span>
            </Box>

            {/* Body */}
            <Box className="order-card-body">
              <Box className="order-box-scroll">
                {order?.orderItems?.map((item: OrderItem) => {
                  const product: Product = order.productData.filter((e: Product) => item.productId === e._id)[0];
                  const folder = folderMap[product.productCollection] ?? "coffee";
                  const imagePath = `${serverApi}/uploads/products/${folder}/${product.productImages[0].split("/").pop()}`;
                  return (
                    <Box key={item._id} className="orders-name-price">
                      <img src={imagePath} className="order-dish-img" alt="" />
                      <p className="title-dish">{product.productName}</p>
                      <Box className="price-box">
                        <span>${item.itemPrice}</span>
                        <span className="sep">×</span>
                        <span>{item.itemQuantity}</span>
                        <span className="sep">=</span>
                        <span className="price-final">${item.itemPrice * item.itemQuantity}</span>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </Box>

            {/* Footer */}
            <Box className="total-price-box">
              <Box className="box-total">
                <span>Subtotal</span>
                <span className="total-amount">${order.orderTotal - order.orderDelivery}</span>
                <span className="sep">+</span>
                <span>Delivery 🚗</span>
                <span className="total-amount">${order.orderDelivery}</span>
                <span className="sep">=</span>
                <span>Total</span>
                <span className="total-amount">${order.orderTotal}</span>
              </Box>
              <Stack flexDirection="row" gap={1}>
                <Button value={order._id} className="verify-button" onClick={deleteOrderHandler}>Cancel</Button>
                <Button value={order._id} className="pay-button" onClick={processOrderHandler}>Pay Now →</Button>
              </Stack>
            </Box>
          </Box>
        ))}
        {(!pausedOrders || pausedOrders.length === 0) && (
          <Box className="order-empty">
            <Box className="order-empty-icon">☕</Box>
            <Box className="order-empty-text">No pending orders</Box>
          </Box>
        )}
      </Stack>
    </TabPanel>
  );
}