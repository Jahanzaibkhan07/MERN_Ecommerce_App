import React, { useEffect } from "react";
import { Carousel, Image } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Message from "../components/Message";
import { getTopProductAction } from "../redux/actions/productActions";
const ProductCarousel = () => {
  const dispatch = useDispatch();
  const topProducts = useSelector((state) => state.topProducts);
  const { products, error } = topProducts;
  useEffect(() => {
    dispatch(getTopProductAction());
  }, [dispatch]);

  return error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <Carousel pause="hover" className="bg-dark" fade={true}>
      {products?.map((item) => (
        <Carousel.Item key={item?._id}>
          <Link to={`/product/${item?._id}`}>
            <Image src={item?.image} alt={item?.name} fluid />
            <Carousel.Caption className="carousel-caption">
              <h2>
                {item?.name}(${item?.price})
              </h2>
            </Carousel.Caption>
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default ProductCarousel;
