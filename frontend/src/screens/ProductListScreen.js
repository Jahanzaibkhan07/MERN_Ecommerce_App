import React, { useState, useEffect } from "react";
import { Button, Form, Row, Col, Spinner, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Paginate from "../components/Paginate";
import {
  deleteProductAction,
  listProductAction,
  createProductAction,
} from "../redux/actions/productActions";
import { PRODUCT_CREATE_RESET } from "../redux/constants/productConstants";
const ProductListScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pageNumber } = useParams();
  const productList = useSelector((state) => state.productList);
  const { product, pages, page, loading, error } = productList;

  const productDelete = useSelector((state) => state.productDelete);
  const {
    loading: productDeleteLoading,
    error: productDeleteError,
    success: productDeleteSuccess,
  } = productDelete;

  const productCreate = useSelector((state) => state.productCreate);
  const {
    loading: productCreateLoading,
    error: productCreateError,
    success: productCreateSuccess,
    product: createdProduct,
  } = productCreate;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    dispatch({ type: PRODUCT_CREATE_RESET });
    if (!userInfo.isAdmin) {
      navigate("/login");
    }
    if (productCreateSuccess) {
      navigate(`/admin/product/${createdProduct?._id}/edit`);
    } else {
      dispatch(listProductAction("", pageNumber));
    }
  }, [
    dispatch,
    navigate,
    userInfo,
    productDeleteSuccess,
    productCreateSuccess,
    createdProduct,
    pageNumber,
  ]);
  const deleteHandler = (id) => {
    if (window.confirm("Are you sure")) {
      //del products
      dispatch(deleteProductAction(id));
    }
  };
  const createProductHandler = () => {
    dispatch(createProductAction());
  };
  return (
    <>
      <Row className="d-flex align-items-center">
        <Col md="10">
          <h1>Products</h1>
        </Col>
        <Col className="text-right" md="2">
          <Button
            className="my-3"
            onClick={createProductHandler}
            variant="dark"
          >
            <i className="fas fa-plus" />
            Create Product
          </Button>
        </Col>
      </Row>
      {/* {productDeleteLoading && <Loader />} */}
      {productDeleteError && (
        <Message variant="danger">{productDeleteError}</Message>
      )}
      {productCreateLoading && <Loader />}
      {productCreateError && (
        <Message variant="danger">{productCreateError}</Message>
      )}
      {loading || productDeleteLoading ? (
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
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
              </tr>
            </thead>
            <tbody>
              {product?.map((item) => (
                <tr key={item?._id}>
                  <td>{item?._id}</td>
                  <td>{item?.name}</td>
                  <td>{item?.price} </td>
                  <td>{item?.category}</td>
                  <td>{item.brand}</td>
                  <td>
                    <LinkContainer to={`/admin/product/${item?._id}/edit`}>
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
          <Paginate pages={pages} page={page} isAdmin={true} />
        </>
      )}
    </>
  );
};

export default ProductListScreen;
