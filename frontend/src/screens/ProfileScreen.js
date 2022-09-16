import React, { useState, useEffect } from "react";
import { Button, Form, Row, Col, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { getOrderListMyAction } from "../redux/actions/orderActions";
import {
  getUserDetailsAction,
  logoutAction,
  updateProfileAction,
} from "../redux/actions/userActions";
import { USER_UPDATE_PROFILE_RESET } from "../redux/constants/userConstants";
import { ORDER_DETAIL_RESET } from "../redux/constants/orderConstants";
const ProfileScreen = () => {
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.userDetails);
  const { loading, user, error } = userDetails;
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const { success } = userUpdateProfile;
  const orderList = useSelector((state) => state.orderMyList);
  const { loading: orderListLoading, order, error: orderListError } = orderList;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    } else {
      if (!user?.name) {
        dispatch(getUserDetailsAction("profile"));
        dispatch(getOrderListMyAction());
        dispatch({ type: ORDER_DETAIL_RESET });
      } else {
        setName(user?.name);
        setEmail(user?.email);
      }
    }
    return () => dispatch({ type: USER_UPDATE_PROFILE_RESET });
  }, [dispatch, navigate, userInfo, user]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Password do not match");
    } else {
      //Dispatch Update Profile
      dispatch(updateProfileAction({ id: user._id, name, email, password }));
    }
  };
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          {" "}
          <Row>
            <Col md={3}>
              <h2>User Profile</h2>
              {message && <Message variant="danger">{message}</Message>}
              {error && <Message variant="danger">{error}</Message>}
              {success && <Message variant="success">Profile Updated!</Message>}
              <Form onSubmit={submitHandler}>
                <Form.Group controlId="name" className="py-1">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="name"
                    placeholder="Enter Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  ></Form.Control>
                </Form.Group>
                <Form.Group controlId="email" className="py-1">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  ></Form.Control>
                </Form.Group>
                <Form.Group controlId="password" className="py-1">
                  <Form.Label> Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  ></Form.Control>
                </Form.Group>
                <Form.Group controlId="confirmPassword" className="py-1">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirm Password "
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  ></Form.Control>
                </Form.Group>
                <Button type="submit" variant="primary" className="my-2">
                  Update
                </Button>
              </Form>
            </Col>
            <Col md={9}>
              <h2>My Orders</h2>
              {orderListLoading ? (
                <Loader />
              ) : orderListError ? (
                <Message variant="danger">{orderListError}</Message>
              ) : (
                <Table striped bordered hover responsive className="table-sm">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>DATE</th>
                      <th>TOTAL</th>
                      <th>PAID</th>
                      <th>DELIVERED</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {order?.map((item) => (
                      <tr key={item?._id}>
                        <td>{item?._id}</td>
                        <td>{item?.createdAt?.substring(0, 10)}</td>
                        <td>{item?.totalPrice}</td>
                        <td>
                          {item?.isPaid ? (
                            item?.paidAt.substring(0, 10)
                          ) : (
                            <i
                              className="fas fa-xmark"
                              style={{ color: "red" }}
                            ></i>
                          )}
                        </td>
                        <td>
                          {item?.isDelivered ? (
                            item?.deliveredAt.substring(0, 10)
                          ) : (
                            <i
                              className="fas fa-xmark"
                              style={{ color: "red" }}
                            ></i>
                          )}
                        </td>
                        <td>
                          <LinkContainer to={`/order/${item?._id}`}>
                            <Button className="btn-sm" variant="light">
                              Details
                            </Button>
                          </LinkContainer>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ProfileScreen;
