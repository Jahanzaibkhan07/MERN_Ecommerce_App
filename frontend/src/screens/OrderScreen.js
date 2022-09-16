import React, { useEffect, useState } from "react";
import "../bootstrap.min.css";
import {
  Button,
  Col,
  Row,
  ListGroup,
  Image,
  Card,
  Spinner,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { PayPalButton } from "react-paypal-button-v2";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { Link, useNavigate } from "react-router-dom";
import {
  createOrderAction,
  getOrderDetailAction,
  orderPayAction,
  orderDeliverAction,
} from "../redux/actions/orderActions";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  ORDER_DETAIL_RESET,
  ORDER_PAY_RESET,
  ORDER_DELIVER_RESET,
} from "../redux/constants/orderConstants";
import { USER_DETAILS_RESET } from "../redux/constants/userConstants";
const OrderScreen = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [sdkReady, setSdkReady] = useState(false);

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const orderDetail = useSelector((state) => state.orderDetail);
  const { order, success, error, loading } = orderDetail;

  const orderPay = useSelector((state) => state.orderPay);
  const { success: successPay, loading: loadingPay } = orderPay;

  const orderDeliver = useSelector((state) => state.orderDeliver);
  const { success: successDeliver, loading: loadingDeliver } = orderDeliver;
  var itemsPrice;
  if (!loading) {
    //Calculate Price
    const addDecimals = (number) => {
      return (Math.round(number * 100) / 100).toFixed(2);
    };
    itemsPrice = addDecimals(
      order?.orderItems?.reduce((acc, item) => acc + item?.price * item?.qty, 0)
    );
  }

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }
    const addPaypalScript = async () => {
      const { data: clientId } = await axios.get("/api/config/paypal");
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
      script.async = true;
      script.onload = () => {
        setSdkReady(true);
      };
      document.body.appendChild(script);
    };
    // if (navigate) {
    //   dispatch({ type: ORDER_DETAIL_RESET });
    // }
    if (!order || successPay || successDeliver || order._id !== id) {
      dispatch({ type: ORDER_DELIVER_RESET });
      dispatch({ type: ORDER_PAY_RESET });
      dispatch({ type: ORDER_DETAIL_RESET });
      dispatch({ type: USER_DETAILS_RESET });
      dispatch(getOrderDetailAction(id));
    } else if (!order?.isPaid) {
      if (!window.paypal) {
        addPaypalScript();
      } else {
        setSdkReady(true);
      }
    }
  }, [dispatch, id, successPay, successDeliver, navigate, order]);
  const successPaymentHandler = (paymentResult) => {
    dispatch(orderPayAction(id, paymentResult));
  };
  const deliverHandler = () => {
    dispatch(orderDeliverAction(order));
  };
  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <>
      <h1>Order {order?._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2 style={{ padding: "0.5rem 0rem" }}>Shipping</h2>
              <p>
                <strong>Name: </strong>
                {order?.user?.name}
              </p>
              <p>
                <strong>Email: </strong>
                <a href={`mailto:${order?.user?.email}`}>
                  {order?.user?.email}
                </a>
              </p>
              <p>
                <strong>Address: </strong>
                {order?.shippingAddress?.address},{order?.shippingAddress?.city}
                ,{order?.shippingAddress?.postalCode},
                {order?.shippingAddress?.country}
              </p>
              {order?.isDelivered ? (
                <Message variant="success">
                  Delivered on {order.deliveredAt}
                </Message>
              ) : (
                <Message variant="danger">Not Delivered</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2 style={{ padding: "0.5rem 0rem" }}>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {order?.paymentMethod}
              </p>
              {order?.isPaid ? (
                <Message variant="success">Paid on {order.paidAt}</Message>
              ) : (
                <Message variant="danger">Not Paid</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2 style={{ padding: "0.5rem 0rem" }}>Order Items</h2>
              {order?.orderItems.length === 0 ? (
                <Message>Order is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {order?.orderItems?.map((item, index) => (
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
                  <Col>${itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${order?.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${order?.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${order?.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              {!order?.isPaid && (
                <ListGroup.Item>
                  {loadingPay && (
                    <Spinner
                      animation="border"
                      role="status"
                      style={{
                        width: "50px",
                        height: "50px",
                        margin: "auto",
                        display: "block",
                      }}
                    />
                  )}
                  {!sdkReady ? (
                    <Spinner
                      animation="border"
                      role="status"
                      style={{
                        width: "50px",
                        height: "50px",
                        margin: "auto",
                        display: "block",
                      }}
                    />
                  ) : (
                    <PayPalButton
                      amount={order?.totalPrice}
                      onSuccess={successPaymentHandler}
                    />
                  )}
                </ListGroup.Item>
              )}
              {userInfo &&
                userInfo?.isAdmin &&
                order?.isPaid &&
                !order?.isDelivered && (
                  <ListGroup.Item>
                    <Row className="d-flex align-items-center">
                      <Button
                        type="button"
                        className="btn btn-block"
                        onClick={deliverHandler}
                      >
                        <span>
                          {loadingDeliver && (
                            <Spinner
                              animation="border"
                              style={{
                                width: "15px",
                                height: "15px",
                                marginRight: "3px",
                              }}
                            />
                          )}
                        </span>
                        Mark as Delivered
                      </Button>
                    </Row>
                  </ListGroup.Item>
                )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
