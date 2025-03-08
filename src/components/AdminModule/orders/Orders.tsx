import React, { useState, useEffect } from "react";
import Style from "../Home/Dashboard.module.css";
import Logomony from "../../../assets/svg/dashsvg/Dash1.svg";
import logocatr from "../../../assets/svg/dashsvg/Logocart.svg";
import Logoacceptcart from "../../../assets/svg/dashsvg/Logoacceptcart.svg";
import Logorejectcart from "../../../assets/svg/dashsvg/Logorejectcart.svg";
import { motion } from "framer-motion";
import Cards from "../../shared/utils/Cards";
import Modal from "react-bootstrap/Modal";

function Orders() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  const orders = [
    {
      id: "#5321",
      name: "أحمد توفيق",
      date: "17/1/2025",
      status: "مكتمل",
      count: "2",
      amount: "$55.00",
    },
    {
      id: "#5321",
      name: "أحمد توفيق",
      date: "17/1/2025",
      status: "مكتمل",
      count: "2",
      amount: "$55.00",
    },
    {
      id: "#5321",
      name: "أحمد توفيق",
      date: "17/1/2025",
      status: "مكتمل",
      count: "2",
      amount: "$55.00",
    },
    {
      id: "#5321",
      name: "أحمد توفيق",
      date: "17/1/2025",
      status: "مكتمل",
      count: "2",
      amount: "$55.00",
    },

    {
      id: "#5321",
      name: "أحمد توفيق",
      date: "17/1/2025",
      status: "ملغي",
      amount: "$55.00",
      count: "2",
    },

    {
      id: "#5321",
      name: "أحمد توفيق",
      date: "17/1/2025",
      status: "ملغي",
      amount: "$55.00",
      count: "2",
    },
    {
      id: "#5321",
      name: "أحمد توفيق",
      date: "17/1/2025",
      status: "مكتمل",
      count: "2",
      amount: "$55.00",
    },
    {
      id: "#5321",
      name: "أحمد توفيق",
      date: "17/1/2025",
      status: "مكتمل",
      count: "2",
      amount: "$55.00",
    },

    {
      id: "#5321",
      name: "أحمد توفيق",
      date: "17/1/2025",
      status: "ملغي",
      amount: "$55.00",
      count: "2",
    },
    {
      id: "#5321",
      name: "أحمد توفيق",
      date: "17/1/2025",
      status: "مكتمل",
      count: "2",
      amount: "$55.00",
    },
  ];
  const [fullscreen, setFullscreen] = useState<string | true | undefined>(true);
  const [show, setShow] = useState(false);

  function handleShow(breakpoint: string | true) {
    setFullscreen(breakpoint);
    setShow(true);
  }

  return (
    <motion.div
      className="container-fluid"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {loading ? (
        <div className="d-flex justify-content-center align-items-center vh-100">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="row">
          <div className="col-lg-3 col-md-12 mt-2">
            <Cards
              imgPath={Logomony}
              Title=" العائد الكلي "
              Value="$100000"
              rate="40"
              color="#009247"
              background="#3BFF9A"
            />
            <Cards
              imgPath={logocatr}
              Title="الطلبات "
              Value="2000"
              rate="15"
              color="#009247"
              background="#3BFF9A"
            />
            <Cards
              imgPath={Logoacceptcart}
              Title="الطلبات المكتملة"
              Value="1500"
              rate="20"
              color="#009247"
              background="#3BFF9A"
            />
            <Cards
              imgPath={Logorejectcart}
              Title="الطلبات الملغاة"
              Value="500"
              rate="10"
              background="#FFB9B9"
              color="#FF292C"
            />
          </div>
          <div className="col-lg-9 col-md-12 d-flex flex-column gap-5">
            <motion.div
              className="shadow-lg card shadow-sm mt-2"
              style={{ borderRadius: "12px" }}
              initial={{ opacity: 0, transform: "translate(-100% )" }}
              animate={{ opacity: 1, transform: "translate(0 )" }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="fw-bold m-2">المستخدمون</h5>
                <div className="d-flex gap-5 flex-md-row-reverse w-75">
                  <select
                    className={`${Style.heroSelect} form-select m-2`}
                    style={{ maxWidth: "120px" }}
                  >
                    <option>الاسم</option>
                    <option>البريد الالكتروني</option>
                    <option>عد العمليات</option>
                    <option>المعرف</option>
                  </select>
                  <input
                    type="text"
                    className={`${Style.heroSearch} form-control border m-2`}
                    placeholder="ابحث..."
                  />
                </div>
              </div>
              <table className="table align-middle text-center table-hover">
                <thead>
                  <tr>
                    <th>معرف المستخدم</th>
                    <th>الاسم</th>
                    <th> التاريخ</th>
                    <th>عدد العناصر </th>
                    <th> المبلغ</th>
                    <th>الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <tr key={index} onClick={() => handleShow(true)}>
                      <td>{order.id}</td>
                      <td>
                        {order.name}{" "}
                        <span role="img" aria-label="user">
                          🧑🏻
                        </span>
                      </td>
                      <td>{order.date}</td>
                      <td>{order.count}</td>
                      <td
                        className={
                          order.status?.includes("ملغي") ? "text-danger " : ""
                        }
                      >
                        {order.amount}
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            order.status?.includes("مكتمل")
                              ? "bg-success"
                              : "bg-danger"
                          } `}
                          style={{
                            padding: "6px 12px",
                            borderRadius: "8px",
                          }}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Modal
                show={show}
                fullscreen={fullscreen}
                onHide={() => setShow(false)}
              >
                <Modal.Header closeButton>
                  <Modal.Title>تفاصيل الطلب</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className="container">
                    <div className="row">
                      <div className="col-12">
                        <h5>معلومات الطلب</h5>
                        <p>تفاصيل الطلب هنا...</p>
                      </div>
                    </div>
                  </div>
                </Modal.Body>
              </Modal>
              <div className="d-flex justify-content-between align-items-center mt-2">
                <span className="text-muted me-3">1-3 من 10</span>
                <nav className="ms-3 mb-3">
                  <ul className="pagination m-0">
                    <li className="page-item">
                      <button className="page-link">◀</button>
                    </li>
                    <li className="page-item active">
                      <button className="page-link">1</button>
                    </li>
                    <li className="page-item">
                      <button className="page-link">2</button>
                    </li>
                    <li className="page-item">
                      <button className="page-link">3</button>
                    </li>
                    <li className="page-item">
                      <button className="page-link">4</button>
                    </li>
                    <li className="page-item">
                      <button className="page-link">▶</button>
                    </li>
                  </ul>
                </nav>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default Orders;
