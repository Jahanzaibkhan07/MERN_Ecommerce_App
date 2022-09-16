import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  Col,
  Image,
  ListGroup,
  Row,
  Button,
  Form,
  ListGroupItem,
  FormGroup,
  FormControl,
  Spinner,
} from "react-bootstrap";
import { Link, useParams, useNavigate } from "react-router-dom";
import Rating from "../components/Rating";
import Loader from "../components/Loader";
import Message from "../components/Message";
import {
  detailProductAction,
  createProductReviewAction,
} from "../redux/actions/productActions";
import {
  PRODUCT_DETAIL_RESET,
  PRODUCT_CREATE_REVIEW_RESET,
} from "../redux/constants/productConstants";
import Meta from "../components/Meta";
const ProductScreen = () => {
  let navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const dispatch = useDispatch();
  const { id } = useParams();
  const ProductDetail = useSelector((state) => state.productDetail);
  const { loading, error, product } = ProductDetail;

  const createReview = useSelector((state) => state.createReview);
  const {
    loading: reviewLoading,
    error: reviewError,
    success: reviewSuccess,
  } = createReview;
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (reviewSuccess) {
      alert("Review Submitted!");
      setRating(0);
      setComment("");
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
    }
    dispatch({ type: PRODUCT_DETAIL_RESET });
    dispatch(detailProductAction(id));
  }, [dispatch, id, reviewSuccess]);
  const addToCartHandler = () => {
    navigate(`/cart/${id}?qty=${qty}`);
  };
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(createProductReviewAction(id, { rating, comment }));
  };
  return (
    <>
      <Link className="btn btn-dark my-3" to="/">
        Go Back
      </Link>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Meta title={product?.name} />
          <Row>
            <Col md={6}>
              <Image src={product?.image} alt={product?.name} fluid />
            </Col>
            <Col md={3}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>{product?.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating
                    value={product?.rating}
                    text={`${product?.numReviews} reviews`}
                  />
                </ListGroup.Item>
                <ListGroup.Item>Price: ${product?.price}</ListGroup.Item>
                <ListGroup.Item>
                  Description: ${product?.description}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={3}>
              <Card>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>Price:</Col>
                      <Col>
                        <strong>${product?.price}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      <Col>
                        <strong>
                          {product?.countInStock > 0
                            ? "In Stock"
                            : "Out Of Stock"}
                        </strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  {product?.countInStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>Qty</Col>
                        <Col>
                          <Form.Control
                            as="select"
                            value={qty}
                            onChange={(e) => {
                              setQty(e.target.value);
                            }}
                          >
                            {[...Array(product.countInStock).keys()].map(
                              (x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              )
                            )}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}
                  <ListGroup.Item>
                    {/* <Col style={{ display: "flex", flex: 1 }}> */}
                    <Row>
                      <Button
                        onClick={addToCartHandler}
                        className="btn-block"
                        // style={{ display: "block" }}
                        type="button"
                        disabled={product?.countInStock === 0}
                      >
                        ADD TO CART
                      </Button>
                    </Row>

                    {/* </Col> */}
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <h2>Reviews</h2>
              {product?.reviews?.length === 0 && <Message>No Reviews</Message>}
              <ListGroup variant="flush">
                {product?.reviews?.map((item) => (
                  <ListGroup.Item key={item?._id}>
                    <strong>{item?.name}</strong>
                    <Rating value={item?.rating} />
                    <p>{item?.createdAt.substring(0, 10)}</p>
                    <p>{item?.comment}</p>
                  </ListGroup.Item>
                ))}
                <ListGroup.Item>
                  <h2>Write a Customer Review</h2>
                  {reviewError && (
                    <Message variant="danger">{reviewError}</Message>
                  )}
                  {userInfo ? (
                    <Form onSubmit={submitHandler}>
                      <FormGroup controlId="rating" className="mt-1">
                        <Form.Label>Rating</Form.Label>
                        <Form.Control
                          as="select"
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
                        >
                          <option value="">Select...</option>
                          <option value="1">1 - Poor </option>
                          <option value="2">2 - Fair </option>
                          <option value="3">3 - Good </option>
                          <option value="4">4 - Very Good </option>
                          <option value="5">5 - Excellent </option>
                        </Form.Control>
                      </FormGroup>
                      <FormGroup controlId="comment" className="mt-1">
                        <Form.Label>Comment</Form.Label>
                        <Form.Control
                          type="textArea"
                          row="3"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        ></Form.Control>
                      </FormGroup>

                      <Button type="submit" variant="primary" className="mt-2">
                        <span className="d-flex align-items-center">
                          {reviewLoading && (
                            <Spinner
                              animation="border"
                              style={{
                                width: "15px",
                                height: "15px",
                                marginRight: "3px",
                              }}
                            />
                          )}
                          Submit
                        </span>
                      </Button>
                    </Form>
                  ) : (
                    <Message>
                      Please<Link to="/login"> SignIn</Link> to write a review
                    </Message>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ProductScreen;
