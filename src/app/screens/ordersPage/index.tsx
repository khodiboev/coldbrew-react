import { useState, SyntheticEvent, useEffect } from "react";
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

/** REDUX SLICE & SELECTOR */
const actionDispatch = (dispatch: Dispatch) => ({
  setPausedOrders: (data: Order[]) => dispatch(setPausedOrders(data)),
  setProcessOrders: (data: Order[]) => dispatch(setProcessOrders(data)),
  setFinishedOrders: (data: Order[]) => dispatch(setFinishedOrders(data)),
});

export default function OrdersPage() {
  const { setPausedOrders, setProcessOrders, setFinishedOrders } =
    actionDispatch(useDispatch());
  const { orderBuilder, authMember } = useGlobals();
  const history = useHistory();
  const [value, setValue] = useState("1");
  const [orderInquery, setOrderInquery] = useState<OrderInquiry>({
    page: 1,
    limit: 5,
    orderStatus: OrderStatus.PAUSE,
  });

  useEffect(() => {
    const order = new OrderService();

    order
      .getMyOrders({ ...orderInquery, orderStatus: OrderStatus.PAUSE })
      .then((data) => setPausedOrders(data))
      .catch((err) => console.log("Error, getMyOrders: ", err));

    order
      .getMyOrders({ ...orderInquery, orderStatus: OrderStatus.PROCESS })
      .then((data) => setProcessOrders(data))
      .catch((err) => console.log("Error, getMyOrders: ", err));

    order
      .getMyOrders({ ...orderInquery, orderStatus: OrderStatus.FINISH })
      .then((data) => setFinishedOrders(data))
      .catch((err) => console.log("Error, getMyOrders: ", err));
  }, [orderInquery, orderBuilder]);

  /** HANDLERS */

  const handleChange = (e: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  if (!authMember) {
    history.push("/");
  }

  return (
    <div className={"order-page"}>
      <Container className="order-container">
        {/* LEFT SIDE */}
        <Stack className={"order-left"}>
          <TabContext value={value}>
            <Box className={"order-nav-frame"}>
              <Tabs
                value={value}
                onChange={handleChange}
                className={"table_list"}
              >
                <Tab label="Paused Order" value={"1"} />
                <Tab label="Process Order" value={"2"} />
                <Tab label="Finished Orders" value={"3"} />
              </Tabs>
            </Box>

            <Stack className={"order-main-content"}>
              <PausedOrders setValue={setValue} />
              <ProcessOrders setValue={setValue} />
              <FinishedOrders />
            </Stack>
          </TabContext>
        </Stack>

        {/* RIGHT SIDE */}
        <Stack className={"order-right"}>
          {/* USER INFO */}
          <Box className={"order-info-box"}>
            <Box className={"member-box"}>
              <div className={"order-user-img"}>
                <img
                  src={
                    authMember?.memberImage
                      ? `${serverApi}/${authMember.memberImage}`
                      : "/icons/default-user.svg"
                  }
                  alt=""
                  className="order-user-avatar"
                />

                <div className={"order-user-icon-box"}>
                  <img
                    src={
                      authMember?.memberType === MemberType.RESTAURANT
                        ? "/icons/restaurant.svg"
                        : "/icons/user-badge.svg"
                    }
                    alt=""
                    className={"order-user-prof-img"}
                  />
                </div>
              </div>

              <span className="order-user-name">{authMember?.memberNick}</span>
              <span className="order-user-role">{authMember?.memberType}</span>

              <Divider className="order-divider" />

              <Box className="order-location-box">
                <LocationOnIcon className="location-icon" />
                <span>{authMember?.memberAddress
                    ? authMember.memberAddress
                    : "No address"}</span>
              </Box>
            </Box>
          </Box>

          {/* PAYMENT BOX */}
          <Box className={"payment-box"}>
            <input
              type="text"
              placeholder="Card number : 5243 4090 2002 7495"
              className="payment-input full"
            />

            <Box className="payment-row">
              <input
                type="text"
                placeholder="07 / 24"
                className="payment-input"
              />
              <input
                type="text"
                placeholder="CVV : 010"
                className="payment-input"
              />
            </Box>

            <input
              type="text"
              placeholder="Justin Robertson"
              className="payment-input full"
            />

            <Box className="payment-icons">
              <img src="/icons/payme.svg" alt="" />
              <img src="/icons/mastercard.svg" alt="" />
              <img src="/icons/paypal.svg" alt="" />
              <img src="/icons/visa.svg" alt="" />
            </Box>
          </Box>
        </Stack>
      </Container>
    </div>
  );
}
