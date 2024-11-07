import ReactPaginate from "react-paginate";
import { FaArrowLeft } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";

interface ReactPaginationStyleProps {
  total: number; // Total number of items
  currentPage: number; // Current active page
  handlePagination: (selectedPage: { selected: number }) => void; // Function to handle pagination
  limit: number; // Number of items per page
}

const ReactPaginationStyle: React.FC<ReactPaginationStyleProps> = ({
  total,
  currentPage,
  handlePagination,
  limit,
}) => {
  const count = Math.ceil(total / limit);

  return (
    <ReactPaginate
      previousLabel={
        <span className="border border-primary text-primary rounded-lg w-6 h-6 flex justify-center items-center">
          <FaArrowLeft />
        </span>
      }
      nextLabel={
        <span className="border border-primary text-primary rounded-lg w-6 h-6 flex justify-center items-center">
          <FaArrowRight />
        </span>
      }
      pageCount={count || 1}
      breakLabel=".."
      pageRangeDisplayed={2} // This could be adjusted as needed
      activeLinkClassName="bg-primary text-white w-6 h-6 rounded-lg flex justify-center items-center"
      pageClassName="flex justify-center text-primary items-center rounded-lg border border-primary h-6 w-6"
      marginPagesDisplayed={1}
      forcePage={currentPage > 0 ? currentPage - 1 : 0}
      onPageChange={handlePagination}
      containerClassName="pagination react-paginate rounded-lg text-sm gap-2 flex justify-end my-2"
    />
  );
};

export default ReactPaginationStyle;
