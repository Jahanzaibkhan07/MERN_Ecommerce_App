import React from "react";
import { Pagination } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const Paginate = ({
  pages,
  page,
  products,
  orders,
  isAdmin = false,
  keyword = "",
}) => {
  return (
    pages > 1 && (
      <Pagination>
        {[...Array(pages).keys()].map((item) =>
          products ? (
            <LinkContainer
              key={item + 1}
              to={
                !isAdmin
                  ? keyword
                    ? `/search/${keyword}/page/${item + 1}`
                    : `/page/${item + 1}`
                  : `/admin/productList/${item + 1}`
              }
            >
              <Pagination.Item active={item + 1 === page}>
                {item + 1}
              </Pagination.Item>
            </LinkContainer>
          ) : (
            orders && (
              <LinkContainer
                key={item + 1}
                to={
                  !isAdmin
                    ? keyword
                      ? `/search/${keyword}/page/${item + 1}`
                      : `/page/${item + 1}`
                    : `/admin/orderList/${item + 1}`
                }
              >
                <Pagination.Item active={item + 1 === page}>
                  {item + 1}
                </Pagination.Item>
              </LinkContainer>
            )
          )
        )}
      </Pagination>
    )
  );
};

export default Paginate;
