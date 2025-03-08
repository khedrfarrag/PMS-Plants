import Style from "./Dashboard.module.css";
import dashLogo1 from "../../../assets/svg/dashsvg/Dash1.svg";
import Logoacceptcart from "../../../assets/svg/dashsvg/Logoacceptcart.svg";
import userimg from "../../../assets/svg/dashsvg/userimg.svg";
import imgproduct from "../../../assets/svg/dashsvg/image-product.svg";
import { Line, Pie } from "react-chartjs-2";

// >>>>>>>>>>>>>>>>>>>>>

import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Cards from "../../shared/utils/Cards";
interface Product {
  name: string;
  price: string;
  rating: number;
  reviews: number;
  image: string;
}

const products: Product[] = [
  {
    name: "فويابور",
    price: "$315.00",
    rating: 4.5,
    reviews: 50,
    image: imgproduct,
  },
  {
    name: "فويابور",
    price: "$315.00",
    rating: 4.5,
    reviews: 50,
    image: imgproduct,
  },
  {
    name: "فويابور",
    price: "$315.00",
    rating: 4.5,
    reviews: 50,
    image: imgproduct,
  },
  {
    name: "فويابور",
    price: "$315.00",
    rating: 4.5,
    reviews: 50,
    image: imgproduct,
  },
  {
    name: "فويابور",
    price: "$315.00",
    rating: 4.5,
    reviews: 50,
    image: imgproduct,
  },
];

// >>>>>>>>>>>>>>>>>>>>>>>>>>>
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
    tooltip: {
      animation: {
        duration: 200,
      },
      callbacks: {
        label: (context: any) => `$${context.raw}`,
      },
    },
  },
  scales: {
    x: {
      ticks: { font: { size: 14 } },
    },
    y: {
      ticks: {
        font: { size: 14 },
        callback: (value: any) => `$${value}`,
      },
    },
  },
};
const data = {
  labels: ["Lab", "Lab", "Lab", "Lab", "Lab", "Lab", "Lab"],
  datasets: [
    {
      label: "المبيعات",
      data: [800, 1000, 1100, 950, 1200, 900, 1100],
      borderColor: "#FFA500",
      backgroundColor: "rgba(255, 165, 0, 0.2)",
      borderWidth: 4,
      pointRadius: 2,
      pointBackgroundColor: "#FFA500",
      pointStyle: "circle",
      tension: 0.4,
    },
    {
      label: "العائدات",
      data: [600, 900, 950, 850, 1000, 750, 900],
      borderColor: "#008000",
      backgroundColor: "rgba(0, 128, 0, 0.2)",
      borderWidth: 4,
      pointRadius: 2,
      pointBackgroundColor: "#008000",
      pointStyle: "circle",
      tension: 0.4,
    },
  ],
};

function Dashboard() {
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
      amount: "$55.00",
      statusClass: "bg-success text-white",
    },

    {
      id: "#5321",
      name: "أحمد توفيق",
      date: "17/1/2025",
      status: "ملغي",
      amount: "$55.00",
      statusClass: "bg-danger text-white",
    },
  ];

  const dataTeind = {
    labels: ["الشرقية", "أسيوط", "القاهرة", "الإسكندرية"],
    datasets: [
      {
        data: [40, 10, 20, 30],
        backgroundColor: ["#3D5AFE", "#D1C4E9", "#FF9800", "#E53935"],
      },
    ],
  };
  return (
    <>
      {loading ? (
        <div className="d-flex justify-content-center align-items-center vh-100">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <motion.div
          className="container-fluid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="row">
            <div className="col-xl-3 col-md-12 d-flex flex-column gap-3 mb-lg-4 mb-md-4  mb-sm-4">
              <motion.div
                className="shadow-lg card p-3"
                style={{ direction: "rtl" }}
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, transform: "translateX(100%)" }}
                animate={{ opacity: 1, transform: "translateX(0)" }}
                transition={{ duration: 0.5 }}
              >
                <div className="d-flex justify-content-between align-items-center mb-2 ">
                  <h5
                    className={`${Style.heroHeadCaption} fw-bold`}
                    style={{ fontSize: "18px" }}
                  >
                    المنتجات المتصدرة
                  </h5>
                  <FontAwesomeIcon icon={faEllipsisV} size="sm" />
                </div>
                <p
                  className={`${Style.pragraphTop} text-secondary `}
                  style={{ fontSize: "14px" }}
                >
                  9.5k مشتريات
                </p>
                <div>
                  {products.map((product, index) => (
                    <div key={index} className="d-flex">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="me-3"
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "5px",
                        }}
                      />
                      <div className="flex-grow-1">
                        <p
                          className="mb-1 fw-bold"
                          style={{ fontSize: "14px" }}
                        >
                          {product.name}
                        </p>
                        <div
                          className="d-flex align-items-center text-secondary"
                          style={{ fontSize: "12px" }}
                        >
                          <FontAwesomeIcon
                            icon={faStar}
                            color="gold"
                            size="xs"
                            className="me-1"
                          />
                          {product.rating}
                          {""}
                          <span className="ms-1">
                            ({product.reviews} تقييم )
                          </span>
                        </div>
                      </div>
                      <p
                        className="fw-bold mt-lg-3 m-4"
                        style={{ fontSize: "14px" }}
                      >
                        {product.price}
                      </p>
                    </div>
                  ))}
                </div>
                <button className={`${Style.herobttn} btn btn-outline-success`}>
                  رؤية الكل
                </button>
              </motion.div>
              <motion.div
                className="shadow-lg card p-4 text-center w-100 w-md-75  "
                style={{ margin: "auto" }}
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, transform: "translateX(100%)" }}
                animate={{ opacity: 1, transform: "translateX(0)" }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="d-flex justify-content-between align-items-center mb-3   ">
                  <h6 className="mb-0">المحافظات المتصدرة</h6>
                  <select className="form-select form-select-sm w-auto">
                    <option>شهري</option>
                    <option>سنوي</option>
                    <option>اسبوعي</option>
                  </select>
                </div>
                <h2 className="fw-bold text-end">598374</h2>
                <p className="text-muted text-end">عميل</p>
                <hr />

                <div className="d-flex justify-content-center align-items-center">
                  <div style={{ width: "100%", height: "200px" }}>
                    <Pie data={dataTeind} options={options} />
                  </div>
                </div>
              </motion.div>
            </div>
            <div className=" col-xl-9 col-md-12 d-flex flex-column gap-4">
              <div className="row ">
                <div className="col-lg-4 col-md-6 mb-3">
                  <Cards
                    imgPath={dashLogo1}
                    Title=" العائد الكلي "
                    Value="$100000"
                    rate="40"
                    color="#009247"
                    background="#3BFF9A"
                  />
                </div>
                <div className="col-lg-4 col-md-6 mb-3">
                  <Cards
                    imgPath={userimg}
                    Title="  المستخدمون "
                    Value="100"
                    rate="50"
                    color="#009247"
                    background="#3BFF9A"
                  />
                </div>
                <div className="col-lg-4 col-md-6 mb-3">
                  <Cards
                    imgPath={Logoacceptcart}
                    Title="الطلبات "
                    Value="2000"
                    rate="15"
                    color="#009247"
                    background="#3BFF9A"
                  />
                </div>
              </div>
              <div className="row">
                <div className={`col-12 mb-4`}>
                  <motion.div
                    className={`${Style.chartsLastRequiest} shadow-lg card p-4`}
                    style={{ direction: "rtl", height: "350px" }}
                    whileHover={{ scale: 1.05 }}
                    initial={{ opacity: 0, transform: "translateX(100%)" }}
                    animate={{ opacity: 1, transform: "translateX(0)" }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5
                        className="fw-bold text-dark"
                        style={{ fontSize: "22px", fontWeight: "bold" }}
                      >
                        معدل النمو
                      </h5>
                      <div className="d-flex align-items-center gap-3">
                        <span className="d-flex align-items-center gap-2">
                          <span
                            className="rounded-circle d-inline-block me-1"
                            style={{
                              width: "12px",
                              height: "12px",
                              backgroundColor: "#FFA500",
                            }}
                          ></span>
                          المبيعات
                        </span>
                        <span className="d-flex align-items-center gap-2">
                          <span
                            className="rounded-circle d-inline-block "
                            style={{
                              width: "12px",
                              height: "12px",
                              backgroundColor: "#008000",
                            }}
                          ></span>
                          العائدات
                        </span>
                      </div>
                    </div>
                    <div style={{ width: "100%", height: "100%" }}>
                      <Line data={data} options={options} />
                    </div>
                  </motion.div>
                </div>
                <div className={` col-12  `}>
                  <motion.div
                    className={`shadow-lg card shadow-sm mt-2`}
                    style={{ borderRadius: "12px" }}
                    whileHover={{ scale: 1.05 }}
                    initial={{ opacity: 0, transform: "translateX(100%)" }}
                    animate={{ opacity: 1, transform: "translateX(0)" }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <div
                      className={`  d-flex justify-content-between align-items-center mb-2 `}
                    >
                      <h5 className="fw-bold m-2">الطلبات الأخيرة</h5>
                      <div className="d-flex gap-5 flex-md-row-reverse w-75">
                        <select
                          className={`${Style.heroSelect} form-select m-2`}
                          style={{ maxWidth: "120px" }}
                        >
                          <option>الاسم</option>
                          <option>التعقب</option>
                          <option>المعرف</option>
                        </select>
                        <input
                          type="text"
                          className={`${Style.heroSearch} form-control border m-2`}
                          placeholder="ابحث..."
                        />
                      </div>
                    </div>
                    <table className="table align-middle text-center  ">
                      <thead>
                        <tr>
                          <th>معرف المستخدم</th>
                          <th>الاسم</th>
                          <th>التاريخ</th>
                          <th>التعقب</th>
                          <th>المبلغ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order, index) => (
                          <tr key={index}>
                            <td>{order.id}</td>
                            <td>
                              {order.name}{" "}
                              <span role="img" aria-label="user">
                                🧑🏻
                              </span>
                            </td>
                            <td>{order.date}</td>
                            <td>
                              <span
                                className={`badge ${order.statusClass}`}
                                style={{
                                  padding: "6px 12px",
                                  borderRadius: "8px",
                                }}
                              >
                                {order.status}
                              </span>
                            </td>
                            <td>{order.amount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}

export default Dashboard;
