import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Row, Col } from "react-bootstrap";
import Product from "../components/Product";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { listProductAction } from "../redux/actions/productActions";
import { PRODUCT_CREATE_REVIEW_RESET } from "../redux/constants/productConstants";
import { useParams } from "react-router-dom";
import Paginate from "../components/Paginate";
import ProductCarousel from "../components/ProductCarousel";
import { Link } from "react-router-dom";
import Meta from "../components/Meta";
const HomeScreen = () => {
  const { keyword, pageNumber } = useParams();
  const dispatch = useDispatch();
  const ProductsDetail = useSelector((state) => state.productList);
  const { loading, error, product, pages, page } = ProductsDetail;

  const topProducts = useSelector((state) => state.topProducts);
  const { loading: topProductsLoading } = topProducts;

  useEffect(() => {
    dispatch(listProductAction(keyword, pageNumber));
    dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
  }, [dispatch, keyword, pageNumber]);
  return (
    <>
      <Meta />
      {!keyword ? (
        <ProductCarousel />
      ) : (
        <Link to="/" className="btn btn-dark">
          Go Back
        </Link>
      )}
      <h1>Latest Products</h1>
      {loading || topProductsLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Row>
            {product &&
              product?.map((product) => {
                return (
                  <Col key={product?._id} sm={12} md={6} lg={4} xl={3}>
                    <Product product={product} />
                  </Col>
                );
              })}
          </Row>
          <Paginate
            pages={pages}
            page={page}
            keyword={keyword ? keyword : ""}
          />
        </>
      )}
    </>
  );
};
export default HomeScreen;
