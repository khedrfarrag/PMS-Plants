import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function ProductsList() {
  interface Product {
    id: number;
    category: string;
    priceAfter?: number;
    discount?: number;
    priceBefore: number;
    image: string;
    title: string;
  }

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Popup state
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Fetch products
  async function getAllProducts(pageNumber: number) {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://projectplant-production.up.railway.app/api/v1/cartify-product/find-all?pageNumber=${pageNumber}`
      );
      setAllProducts(response.data.data || []);
      setFilteredProducts(response.data.data || []);
      setTotalPages(response.data.totalPage || 1);
      console.log(response?.data?.totalPage);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getAllProducts(currentPage);
  }, [currentPage]);

  // Search function
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    if (value === "") {
      setFilteredProducts(allProducts);
    } else {
      setFilteredProducts(
        allProducts.filter((product) =>
          product.title.toLowerCase().includes(value)
        )
      );
    }
  };

  // Open delete popup
  const handleEllipsisClick = (product: Product) => {
    setSelectedProduct(product);
    setShowDeletePopup(true);
  };

  // Close popup
  const closePopup = () => {
    setShowDeletePopup(false);
    setSelectedProduct(null);
  };

  // Delete product API call
  const deleteProduct = async () => {
    if (!selectedProduct) return;

    try {
      await axios.delete(
        `https://projectplant-production.up.railway.app/api/v1/cartify-product/deleteCartifyProduct/${selectedProduct.id}`
      );
      setAllProducts((prev) => prev.filter((p) => p.id !== selectedProduct.id));
      setFilteredProducts((prev) =>
        prev.filter((p) => p.id !== selectedProduct.id)
      );
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      closePopup();
    }
  };

  return (
    <>
      <motion.div
        className="container"
        dir="rtl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="content mt-3 mb-4">
          <h3>المنتجات</h3>
          <h6>تستطيع أن تفحص كل منتجاتك</h6>
        </div>

        {/* Buttons Row */}
        <div className="row align-items-center ">
          <div className="col-md-2">
            <div className="dropdown w-100">
              <button
                className="btn-dropdown btn-secondary dropdown-toggle w-100"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                الفئة
              </button>
              <ul className="dropdown-menu w-100">
                <li>
                  <a className="dropdown-item" href="#">
                    مبيدات
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    أسمدة
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    تقاوي
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="col-md-7">
            <div className="input-group input-group-sm my-input position-relative">
              <span className="pt-3">
                <i className="fa-solid fa-magnifying-glass"></i>
              </span>
              <input
                type="text"
                className="bg-white serch-inp"
                aria-label="Search"
                placeholder="ابحث هنا ..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>

          <div className="col-md-3">
            <button
              onClick={() => navigate("/admin/add-product")}
              className="btn btn-primary w-100"
            >
              إضافة منتج
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="row mt-4 ">
          {loading ? (
            <div className="d-flex justify-content-center align-items-center vh-100">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <table className="table table-hover table-striped ">
              <thead>
                <tr className="shadow-lg ">
                  <th>...</th>
                  <th>الفئة</th>
                  <th>السعر</th>
                  <th>الخصم</th>
                  <th>الصورة</th>
                  <th>الاسم</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product, index) => (
                    <motion.tr
                      key={product.id}
                      className={index % 2 === 0 ? "row-light" : "row-dark"}
                      initial={{ opacity: 0, transform: "translateX(-100%)" }}
                      animate={{ opacity: 1, transform: "translateX(0)" }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <th scope="row">
                        <i
                          className="fa-solid fa-ellipsis"
                          style={{ cursor: "pointer" }}
                          onClick={() => handleEllipsisClick(product)}
                        ></i>
                      </th>
                      <td>{product.category}</td>
                      <td>{product.priceBefore} جنيه</td>
                      <td>{product.discount}</td>
                      <td>
                        <img
                          src={product.image}
                          alt={product.category}
                          width="50"
                          height="50"
                        />
                      </td>
                      <td>{product.title}</td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center">
                      لا يوجد منتجات متاحة
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeletePopup && (
          <div className="modal show d-block" tabIndex={-1}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-body d-flex justify-content-center">
                  <span className="popup-icon text-center">
                    <i className="fa-solid fa-trash-can "></i>
                  </span>
                </div>
                <br />
                <div className="modal-footer d-flex justify-content-between">
                  <button type="button" className="btn1" onClick={closePopup}>
                    إلغاء
                  </button>
                  <button
                    type="button"
                    className="btn2"
                    onClick={deleteProduct}
                  >
                    حذف
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
      {/* Pagination */}
      <div className="row mt-3">
        <div className="col text-center">
          <button
            className="btn btn-secondary mx-2"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            السابق
          </button>
          <span className="mx-2">
            صفحة {currentPage} من {totalPages}
          </span>
          <button
            className="btn btn-secondary mx-2"
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
          >
            التالي
          </button>
        </div>
      </div>
    </>
  );
}

export default ProductsList;
