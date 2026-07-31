import React, { useEffect } from "react";
import WhyUs from "./WhyUs";
import Statistics from "./Statistics";
import MenuCategories from "./MenuCategories";
import PopularDishes from "./PopularDishes";
import Advertisement from "./Advertisement";
import ActiveUsers from "./ActiveUsers";
import Events from "./Events";
import FindUs from "./FindUs";
import { useDispatch } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { setPopularDishes } from "./slice";
import { Product } from "../../../lib/types/product";
import ProductService from "../../services/ProductService";
import "../../../css/home.css";

const actionDispatcher = (dispatch: Dispatch) => ({
  setPopularDishes: (data: Product[]) => dispatch(setPopularDishes(data)),
});

export default function HomePage() {
  const { setPopularDishes } = actionDispatcher(useDispatch());

  useEffect(() => {
    const product = new ProductService();
    product
      .getProducts({
        page: 1,
        limit: 8,
        order: "productViews",
      })
      .then((data) => setPopularDishes(data))
      .catch((err) => console.log(err));
    // setPopularDishes har renderda actionDispatcher orqali qayta yaratiladi,
    // lekin faqat komponent birinchi marta chizilganda bir marta ishlashi kerak.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={"homepage"}>
      <Statistics />
      <WhyUs />
      <MenuCategories />
      <PopularDishes />
      <Advertisement />
      <ActiveUsers />
      <Events />
      <FindUs />
    </div>
  );
}