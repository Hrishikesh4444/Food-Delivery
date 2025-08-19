import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url } =
    useContext(StoreContext);

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const navigate = useNavigate();

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  // Razorpay payment integration
  const initPay = (orderData) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: orderData.order.amount,
      currency: orderData.order.currency,
      name: "Food Delivery",
      description: "Order Payment",
      order_id: orderData.order.id,
      handler: async (res) => {
        try {
          const { data } = await axios.post(
            url + "/api/user/verify-razorpay",
            {
              ...res,
              items: orderData.items,
              amount: orderData.amount,
              address: orderData.address,
              userId: orderData.userId,
            },
            { headers: { token } }
          );

          if (data.success) {
            alert("Payment Successful");
            await axios.post(url + "/api/order/place", orderData, { headers: { token } });
            navigate("/myorders");
          } else {
            alert("Payment Failed ");
            navigate("/cart");
          }
        } catch (error) {
          console.log(error);
          alert("Something went wrong");
          navigate("/cart");
        }
      },
      modal: {
        ondismiss: function () {
          alert("Payment cancelled");
          navigate("/cart");
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  // Place order & create Razorpay order
  const placeOrder = async (e) => {
    e.preventDefault();

    let orderItems = [];
    food_list.forEach((item) => {
      if (cartItems[item._id] > 0) {
        orderItems.push({ ...item, quantity: cartItems[item._id] });
      }
    });

    if (orderItems.length === 0) {
      alert("Cart is empty!");
      return;
    }

    const orderData = {
      items: orderItems,
      amount: getTotalCartAmount() + 3,
      address: data,
      userId: token, // send user token or ID
    };

    try {
      const { data } = await axios.post(
        url + "/api/user/payment-razorpay",
        orderData,
        { headers: { token } }
      );

      if (data.success) {
        initPay(data); // open Razorpay checkout
      } else {
        alert("Failed to initiate payment");
      }
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    }
  };

  useEffect(() => {
    if (!token || getTotalCartAmount() === 0) {
      navigate("/cart");
    }
  }, [token]);

  return (
    <div className="checkout-container">
      <form className="place-order" onSubmit={placeOrder}>
        {/* LEFT: Delivery Form */}
        <div className="place-order-left">
          <h2 className="title">Delivery Information</h2>
          <div className="multi-fields">
            <input
              name="firstName"
              onChange={onChangeHandler}
              value={data.firstName}
              type="text"
              placeholder="First name"
              required
            />
            <input
              name="lastName"
              onChange={onChangeHandler}
              value={data.lastName}
              type="text"
              placeholder="Last name"
              required
            />
          </div>
          <input
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            type="email"
            placeholder="Email address"
            required
          />
          <input
            name="street"
            onChange={onChangeHandler}
            value={data.street}
            type="text"
            placeholder="Street"
            required
          />
          <div className="multi-fields">
            <input
              name="city"
              onChange={onChangeHandler}
              value={data.city}
              type="text"
              placeholder="City"
              required
            />
            <input
              name="state"
              onChange={onChangeHandler}
              value={data.state}
              type="text"
              placeholder="State"
              required
            />
          </div>
          <div className="multi-fields">
            <input
              name="zipcode"
              onChange={onChangeHandler}
              value={data.zipcode}
              type="text"
              placeholder="Zip code"
              required
            />
            <input
              name="country"
              onChange={onChangeHandler}
              value={data.country}
              type="text"
              placeholder="Country"
              required
            />
          </div>
          <input
            name="phone"
            onChange={onChangeHandler}
            value={data.phone}
            type="text"
            placeholder="Phone"
            required
          />
        </div>

        {/* RIGHT: Cart Summary */}
        <div className="place-order-right">
          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-details">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <div className="summary-details">
              <p>Delivery Fee</p>
              <p>${getTotalCartAmount() === 0 ? 0 : 3}</p>
            </div>
            <hr />
            <div className="summary-details total">
              <b>Total</b>
              <b>
                ${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 3}
              </b>
            </div>
            <button type="submit" className="checkout-btn">
              Proceed to Payment
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PlaceOrder;
