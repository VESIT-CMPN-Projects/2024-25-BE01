import React from 'react';
import Pagination from 'react-paginate';

const PaginationComponent = ({ pageCount, onPageChange }) => {
    return (
        <Pagination
            pageCount={pageCount}
            onPageChange={onPageChange}
            containerClassName="pagination"
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-item"
            previousLinkClassName="page-link"
            nextClassName="page-item"
            nextLinkClassName="page-link"
            activeClassName="active"
        />
    );
};

export default PaginationComponent;
