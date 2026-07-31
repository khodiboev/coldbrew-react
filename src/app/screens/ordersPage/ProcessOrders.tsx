import React from "react";
import { Box, Stack } from "@mui/material";
import Button from "@mui/material/Button";
import TabPanel from "@mui/lab/TabPanel";
import moment from "moment";
import "../../../css/order.css";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrieveProcessOrders } from "./selector";
import { Product } from "../../../lib/types/product";
import { Messages } from "../../../lib/config";
import { Order, OrderItem } from "../../../lib/types/orders";
import { OrderStatus } from "../../../lib/enums/order.enum";
import OrderService from "../../services/OrderService";
import { useGlobals } from "../../hooks/useGlobals";
import { T } from "../../../lib/types/common";
import { sweetErrorHandling } from "../../../lib/sweetAlert";
import { getProductImageUrl } from "../../../lib/utils/productImage";

const processOrdersRetriever = createSelector(retrieveProcessOrders, (processOrders) => ({ processOrders }));

interface ProcessOrdersProps { setValue: (input: string) => void; }

export default function ProcessOrders({ setValue }: ProcessOrdersProps) {
  const { authMember, setOrderBuilder } = useGlobals();
  const { processOrders } = useSelector(processOrdersRetriever);

  const finishOrderHandler = async (e: T) => {
    try {
      if (!authMember) throw new Error(Messages.error2);
      if (window.confirm("Have you received your order?")) {
        const order = new OrderService();
        await order.updateOrders({ orderId: e.target.value, orderStatus: OrderStatus.FINISH });
        setValue("3");
        setOrderBuilder(new Date());
      }
    } catch (err) { sweetErrorHandling(err).then(); }
  };

  return (
    <TabPanel value="2">
      <Stack>
        {processOrders?.map((order: Order) => (
          <Box key={order._id} className="order-main-box">
            <Box className="order-card-header">
              <span className="order-status-badge status-process">🚗 On the Way</span>
              <span className="data-compl">{moment(order.updatedAt).format("MMM DD · HH:mm")}</span>
            </Box>

            <Box className="order-card-body">
              <Box className="order-box-scroll">
                {order?.orderItems.map((item: OrderItem) => {
                  const product: Product | undefined = order.productData.find((e: Product) => item.productId === e._id);
                  if (!product) return null;
                  const imagePath = getProductImageUrl(product.productCollection, product.productImages[0]);
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
              <Button value={order._id} className="finish-button" onClick={finishOrderHandler}>
                ✓ Order Received
              </Button>
            </Box>
          </Box>
        ))}
        {(!processOrders || processOrders.length === 0) && (
          <Box className="order-empty">
            <Box className="order-empty-icon">🚗</Box>
            <Box className="order-empty-text">No orders in process</Box>
          </Box>
        )}
      </Stack>
    </TabPanel>
  );
}