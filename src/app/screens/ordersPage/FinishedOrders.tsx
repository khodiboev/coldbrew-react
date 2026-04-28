import React from "react";
import { Box, Stack } from "@mui/material";
import TabPanel from "@mui/lab/TabPanel";
import "../../../css/order.css";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrieveFinishedOrders } from "./selector";
import { Product } from "../../../lib/types/product";
import { serverApi } from "../../../lib/config";
import { Order, OrderItem } from "../../../lib/types/orders";

const finishedOrdersRetriever = createSelector(retrieveFinishedOrders, (finishedOrders) => ({ finishedOrders }));
const folderMap: Record<string, string> = { DRINK: "coffee", DESSERT: "desserts", OTHER: "bread", SALAD: "drinks", DISH: "coffee" };

export default function FinishedOrders() {
  const { finishedOrders } = useSelector(finishedOrdersRetriever);

  return (
    <TabPanel value="3">
      <Stack>
        {finishedOrders?.map((order: Order) => (
          <Box key={order._id} className="order-main-box">
            <Box className="order-card-header">
              <span className="order-status-badge status-finished">✓ Completed</span>
              <span style={{ fontFamily: "Poppins", fontSize: 12, color: "rgba(255,255,255,0.35)" }}>
                #{order._id?.toString().slice(-6).toUpperCase()}
              </span>
            </Box>

            <Box className="order-card-body">
              <Box className="order-box-scroll">
                {order?.orderItems.map((item: OrderItem) => {
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

            <Box className="total-price-box">
              <Box className="box-total">
                <span>Subtotal</span>
                <span className="total-amount">${order.orderTotal - order.orderDelivery}</span>
                <span className="sep">+</span>
                <span>Delivery</span>
                <span className="total-amount">${order.orderDelivery}</span>
                <span className="sep">=</span>
                <span>Total</span>
                <span className="total-amount">${order.orderTotal}</span>
              </Box>
            </Box>
          </Box>
        ))}
        {(!finishedOrders || finishedOrders.length === 0) && (
          <Box className="order-empty">
            <Box className="order-empty-icon">🎉</Box>
            <Box className="order-empty-text">No completed orders yet</Box>
          </Box>
        )}
      </Stack>
    </TabPanel>
  );
}