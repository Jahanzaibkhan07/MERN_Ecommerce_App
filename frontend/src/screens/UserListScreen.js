import React, { useState, useEffect } from "react";
import { Button, Form, Row, Col, Spinner, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { userListAction, userRemoveAction } from "../redux/actions/userActions";
const UserListScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userList = useSelector((state) => state.userList);
  const { users, loading, error } = userList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userRemove = useSelector((state) => state.userRemove);
  const { success: successRemove } = userRemove;
  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(userListAction());
    } else {
      navigate("/login");
    }
  }, [dispatch, navigate, successRemove, userInfo]);
  const deleteHandler = (id) => {
    if (window.confirm("Are you sure")) {
      dispatch(userRemoveAction(id));
    }
  };
  return (
    <>
      <h1>Users</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ADMIN</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((item) => (
              <tr key={item?._id}>
                <td>{item?._id}</td>
                <td>{item?.name}</td>
                <td>
                  <a href={`mailto:${item?.email}`}>{item?.email}</a>
                </td>
                <td>
                  {item?.isAdmin ? (
                    <i className="fas fa-check" style={{ color: "green" }}></i>
                  ) : (
                    <i className="fas fa-xmark" style={{ color: "red" }}></i>
                  )}
                </td>
                <td>
                  <LinkContainer to={`/admin/user/${item?._id}/edit`}>
                    <Button variant="light" className="btn-sm">
                      <i className="fas fa-edit"></i>
                    </Button>
                  </LinkContainer>
                  <Button
                    variant="danger"
                    className="btn-sm"
                    onClick={() => {
                      deleteHandler(item?._id);
                    }}
                  >
                    <i className="fas fa-trash"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default UserListScreen;
