import React, { useEffect, useState } from "react";
import "../bootstrap.min.css";
import { Button, Col, Row, ListGroup, Image, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import CheckoutSteps from "../components/CheckoutSteps";
import Message from "../components/Message";
import { Link, useNavigate } from "react-router-dom";
import { createOrderAction } from "../redux/actions/orderActions";
import {
  ORDER_CREATE_RESET,
  ORDER_DETAIL_RESET,
} from "../redux/constants/orderConstants";
import { USER_DETAILS_RESET } from "../redux/constants/userConstants";
const PlaceOrderScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const orderCreate = useSelector((state) => state.orderCreate);
  const { order, success, error } = orderCreate;

  //Calculate Price
  const addDecimals = (number) => {
    return (Math.round(number * 100) / 100).toFixed(2);
  };
  const itemsPrice = cart?.cartItems?.reduce(
    (acc, item) => acc + item?.price * item?.qty,
    0
  );
  const shippingPrice = addDecimals(itemsPrice > 200 ? 0 : 200);
  const taxPrice = addDecimals(Number((0.15 * itemsPrice).toFixed(2)));
  const totalPrice = (
    Number(itemsPrice) +
    Number(shippingPrice) +
    Number(taxPrice)
  ).toFixed(2);
  useEffect(() => {
    if (success) {
      dispatch({ type: ORDER_DETAIL_RESET });
      dispatch({ type: USER_DETAILS_RESET });

      navigate(`/order/${order?._id}`);
    }
    return () => {
      dispatch({ type: ORDER_CREATE_RESET });
    };
    //eslint-disable-next-line
  }, [navigate, success]);

  const placeOrderHandler = () => {
    const Obj = {
      orderItems: cart.cartItems,
      shippingAddress: cart.shippingAddress,
      paymentMethod: cart.paymentMethod,
      itemsPrice: itemsPrice,
      shippingPrice: shippingPrice,
      taxPrice: taxPrice,
      totalPrice: totalPrice,
    };
    dispatch(createOrderAction(Obj));
  };
  return (
    <>
      <CheckoutSteps step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2 style={{ padding: "0.5rem 0rem" }}>Shipping</h2>
              <p>
                <strong>Address: </strong>
                {cart?.shippingAddress?.address},{cart?.shippingAddress?.city},
                {cart?.shippingAddress?.postalCode},
                {cart?.shippingAddress?.country}
              </p>
            </ListGroup.Item>
            <ListGroup.Item>
              <h2 style={{ padding: "0.5rem 0rem" }}>Payment Method</h2>
              <strong>Method: </strong>
              {cart.paymentMethod}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2 style={{ padding: "0.5rem 0rem" }}>Order Items</h2>
              {cart?.cartItems.length === 0 ? (
                <Message>Your Cart is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {cart?.cartItems?.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            atl={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ${item.price} = $
                          {(item.qty * item.price).toFixed(2)}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>${itemsPrice?.toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              {error && (
                <ListGroup.Item>
                  <Message variant="danger">{error}</Message>
                </ListGroup.Item>
              )}
              <ListGroup.Item>
                <Row>
                  {" "}
                  <Button
                    type="button"
                    className="btn-block"
                    disabled={cart?.cartItems === 0}
                    onClick={placeOrderHandler}
                  >
                    Place Order
                  </Button>
                </Row>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default PlaceOrderScreen;
