import React from 'react';
import ReactPaginate from 'react-paginate';
import styled from 'styled-components';

const StyledReactPaginate = styled(ReactPaginate)`
  display: flex;
  flex-direction: row;
  gap: 5px;
  justify-content: center;
  margin-top: 40px;
  cursor: pointer;
  list-style: none;

  .page-item {
    padding: 8px 12px;
    border-radius: 50px;
    color: black;
    font-size: 14px;
    text-align: center;
    transition:
      background-color 0.2s,
      color 0.2s;

    &:not(.active):hover {
      background-color: rgba(0, 123, 229, 0.08);
    }
  }

  .active {
    font-weight: bold;
    color: white;
    border-radius: 50px;
    background-color: #b8d8f8;
  }

  .previous-item,
  .next-item {
    padding: 8px 12px;
    border-radius: 50px;
    font-size: 14px;
    color: #007be5;
    background-color: #ffffff;
    border: 1px solid #d0d0d0;
  }

  .break-me {
    padding: 8px 12px;
    color: gray;
  }
`;

const ArchivePagination = ({ pageCount, onPageChange }) => {
  return (
    <StyledReactPaginate
      previousLabel={'<'}
      nextLabel={'>'}
      breakLabel={'...'}
      breakClassName={'break-me'}
      pageCount={pageCount}
      marginPagesDisplayed={1}
      pageRangeDisplayed={5}
      onPageChange={onPageChange}
      containerClassName={'pagination'}
      pageClassName={'page-item'}
      pageLinkClassName={'page-link'}
      previousClassName={'previous-item'}
      nextClassName={'next-item'}
      activeClassName={'active'}
    />
  );
};

export default ArchivePagination;
