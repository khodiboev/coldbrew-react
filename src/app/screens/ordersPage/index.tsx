import { useState, useEffect } from "react";
import { Container, Stack, Box, Divider } from "@mui/material";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import TabContext from "@mui/lab/TabContext";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PausedOrders from "./PausedOrders";
import ProcessOrders from "./ProcessOrders";
import FinishedOrders from "./FinishedOrders";
import { useDispatch } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { setPausedOrders, setProcessOrders, setFinishedOrders } from "./slice";
import "../../../css/order.css";
import { Order, OrderInquiry } from "../../../lib/types/orders";
import { OrderStatus } from "../../../lib/enums/order.enum";
import OrderService from "../../services/OrderService";
import { useGlobals } from "../../hooks/useGlobals";
import { useHistory } from "react-router-dom";
import { serverApi } from "../../../lib/config";
import { MemberType } from "../../../lib/enums/member.enum";
import { sweetErrorHandling } from "../../../lib/sweetAlert";

const actionDispatch = (dispatch: Dispatch) => ({
  setPausedOrders: (data: Order[]) => dispatch(setPausedOrders(data)),
  setProcessOrders: (data: Order[]) => dispatch(setProcessOrders(data)),
  setFinishedOrders: (data: Order[]) => dispatch(setFinishedOrders(data)),
});

export default function OrdersPage() {
  const { setPausedOrders, setProcessOrders, setFinishedOrders } = actionDispatch(useDispatch());
  const { orderBuilder, authMember } = useGlobals();
  const history = useHistory();
  const [value, setValue] = useState("1");
  const [orderInquery] = useState<OrderInquiry>({ page: 1, limit: 5, orderStatus: OrderStatus.PAUSE });

  useEffect(() => {
    const order = new OrderService();
    order
      .getMyOrders({ ...orderInquery, orderStatus: OrderStatus.PAUSE })
      .then(setPausedOrders)
      .catch((err) => {
        console.log(err);
        sweetErrorHandling(err).then();
      });
    order
      .getMyOrders({ ...orderInquery, orderStatus: OrderStatus.PROCESS })
      .then(setProcessOrders)
      .catch((err) => {
        console.log(err);
        sweetErrorHandling(err).then();
      });
    order
      .getMyOrders({ ...orderInquery, orderStatus: OrderStatus.FINISH })
      .then(setFinishedOrders)
      .catch((err) => {
        console.log(err);
        sweetErrorHandling(err).then();
      });
    // setPausedOrders/setProcessOrders/setFinishedOrders har renderda actionDispatch orqali
    // qayta yaratiladi (lekin dispatch o'zi barqaror), shuning uchun ularni deps ga qo'shish
    // cheksiz qayta-render siklini keltirib chiqaradi. Faqat orderInquery/orderBuilder
    // o'zgarganda so'rov qayta yuborilishi kerak.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderInquery, orderBuilder]);

  useEffect(() => {
    if (!authMember) history.push("/");
  }, [authMember, history]);

  if (!authMember) return null;

  return (
    <div className="order-page">
      <Container className="order-container">

        {/* LEFT */}
        <Stack className="order-left">
          <TabContext value={value}>
            <Box className="order-nav-frame">
              <Tabs value={value} onChange={(e, v) => setValue(v)}>
                <Tab label="⏸ Paused" value="1" />
                <Tab label="🚗 In Process" value="2" />
                <Tab label="✓ Finished" value="3" />
              </Tabs>
            </Box>
            <Stack className="order-main-content">
              <PausedOrders setValue={setValue} />
              <ProcessOrders setValue={setValue} />
              <FinishedOrders />
            </Stack>
          </TabContext>
        </Stack>

        {/* RIGHT */}
        <Stack className="order-right">
          {/* User card */}
          <Box className="order-info-box">
            <Box className="member-box">
              <div className="order-user-img">
                <img
                  src={authMember?.memberImage ? `${serverApi}/${authMember.memberImage}` : "/icons/default-user.svg"}
                  alt="" className="order-user-avatar"
                />
                <div className="order-user-icon-box">
                  <img
                    src={authMember?.memberType === MemberType.RESTAURANT ? "/icons/restaurant.svg" : "/icons/user-badge.svg"}
                    alt="" className="order-user-prof-img"
                  />
                </div>
              </div>
              <span className="order-user-name">{authMember?.memberNick}</span>
              <span className="order-user-role">{authMember?.memberType}</span>
              <Divider className="order-divider" />
              <Box className="order-location-box">
                <LocationOnIcon className="location-icon" />
                <span>{authMember?.memberAddress || "No address"}</span>
              </Box>
            </Box>
          </Box>

          {/* Payment */}
          <Box className="payment-box">
            <Box className="payment-box-title">Payment Info</Box>
            <input type="text" placeholder="Card number" className="payment-input full" />
            <Box className="payment-row">
              <input type="text" placeholder="MM / YY" className="payment-input" />
              <input type="text" placeholder="CVV" className="payment-input" />
            </Box>
            <input type="text" placeholder="Cardholder name" className="payment-input full" />
            <Box className="payment-icons">
              <img src="/icons/visa-card.svg" alt="Visa" />
              <img src="/icons/paypal-card.svg" alt="PayPal" />
              <img src="/icons/mastercard.svg" alt="MasterCard" />
            </Box>
          </Box>
        </Stack>

      </Container>
    </div>
  );
}