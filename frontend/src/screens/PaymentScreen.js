import React, { useState } from "react";
import { Button, Form, Row, Col, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CheckoutSteps from "../components/CheckoutSteps";
import FormContainer from "../components/FormContainer";
import { savePaymentMethodAction } from "../redux/actions/cartActions";
const PaymentScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;
  if (!shippingAddress) {
    navigate("/shipping");
  }
  const paymentMethodFromLocalStorage = localStorage.getItem("paymentMethod")
    ? JSON.parse(localStorage.getItem("paymentMethod"))
    : "PayPal";
  const [paymentMethod, setPaymentMethod] = useState(
    paymentMethodFromLocalStorage
  );
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethodAction(paymentMethod, navigate));
  };
  const onChangeHandler = (e) => {
    setPaymentMethod(e.target.value);
  };
  return (
    <FormContainer>
      <CheckoutSteps step2 step3 />
      <h1>Payment Method</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as="legend">Select Method</Form.Label>
          <Col>
            <Form.Check
              type="radio"
              label="PayPal or Credit Card"
              id="default-PayPal"
              name="paymentMethod"
              value="PayPal"
              onChange={onChangeHandler}
              checked={paymentMethod === "PayPal"}
            />
            <Form.Check
              type="radio"
              label="Stripe"
              id="default-Stripe"
              name="paymentMethod"
              value="Stripe"
              onChange={onChangeHandler}
              checked={paymentMethod === "Stripe"}
            />
            <Form.Check
              type="radio"
              label="Cash on Delivery"
              id="Cash"
              name="paymentMethod"
              value="Cash"
              onChange={onChangeHandler}
              checked={paymentMethod === "Cash"}
            />
          </Col>
        </Form.Group>
        <Button type="submit" variant="primary" className="my-3">
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
};

export default PaymentScreen;
