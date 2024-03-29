import React, { useState, useEffect } from "react";
import { Button, Form, Row, Col, Spinner, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { getOrderListAction } from "../redux/actions/orderActions";
import { ORDER_DETAIL_RESET } from "../redux/constants/orderConstants";
import Paginate from "../components/Paginate.js";
import { useParams } from "react-router-dom";
const OrderListScreen = () => {
  const { pageNumber } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const orderList = useSelector((state) => state.orderList);
  const { order, loading, error, pages, page } = orderList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch({ type: ORDER_DETAIL_RESET });
      dispatch(getOrderListAction(pageNumber));
    } else {
      navigate("/login");
    }
  }, [dispatch, navigate, userInfo, pageNumber]);

  return (
    <>
      <h1>Orders</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          {" "}
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>USER</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>
              </tr>
            </thead>
            <tbody>
              {order?.map((item) => (
                <tr key={item?._id}>
                  <td>{item?._id}</td>
                  <td>{item.user && item?.user?.name}</td>
                  <td>{item?.createdAt?.substring(0, 10)}</td>
                  <td>{item?.totalPrice}</td>
                  <td>
                    {item?.isPaid ? (
                      item?.paidAt?.substring(0, 10)
                    ) : (
                      <i className="fas fa-xmark" style={{ color: "red" }}></i>
                    )}
                  </td>
                  <td>
                    {item?.isDelivered ? (
                      item?.deliveredAt?.substring(0, 10)
                    ) : (
                      <i className="fas fa-xmark" style={{ color: "red" }}></i>
                    )}
                  </td>
                  <td>
                    <LinkContainer to={`/order/${item?._id}`}>
                      <Button variant="light" className="btn-sm">
                        Details
                      </Button>
                    </LinkContainer>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate pages={pages} page={page} isAdmin={true} orders />
        </>
      )}
    </>
  );
};

export default OrderListScreen;
