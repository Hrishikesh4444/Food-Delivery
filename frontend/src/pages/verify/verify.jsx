import React, { useContext, useEffect } from "react";
import "./verify.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";


const Verify = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const navigate = useNavigate();
  const { url, token } = useContext(StoreContext);

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Food Delivery",
      description: "Order Payment",
      order_id: order.id,
      handler: async (response) => {
        try {
          // Send payment details to backend to verify and save order
          const { data } = await axios.post(
            `${url}/api/user/verify-razorpay`,
            {
              ...response,
              items: order.items,
              amount: order.amount,
              address: order.address,
            },
            { headers: { token } }
          );

          if (data.success) {
            alert("Payment Successful ✅");
            navigate("/orders"); // Navigate to orders page
          } else {
            alert("Payment verification failed");
            navigate("/orders");
          }
        } catch (error) {
          console.error(error);
          alert("Something went wrong");
          navigate("/orders");
        }
      },
      modal: {
        ondismiss: function () {
          alert("Payment cancelled");
          navigate("/orders");
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const orderRazorpay = async (orderId) => {
    try {
      const { data } = await axios.post(
        `${url}/api/user/payment-razorpay`,
        { orderId },
        { headers: { token } }
      );

      if (data.success) {
        initPay(data.order);
      } else {
        alert("Failed to create Razorpay order");
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong while initiating payment");
      navigate("/");
    }
  };

  useEffect(() => {
    if (orderId) {
      orderRazorpay(orderId);
    } else {
      navigate("/");
    }
  }, [orderId]);

  return (
    <div className="verify">
      <div className="spinner"></div>
    </div>
  );
};

export default Verify;
