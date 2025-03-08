import Style from "../Home/Dashboard.module.css";
import { Pie } from "react-chartjs-2";
import userlogo from "../../../assets/svg/dashsvg/userimg.svg";
import resteimg from "../../../assets/svg/dashsvg/reate.svg";
import { motion } from "framer-motion";
import Cards from "../../shared/utils/Cards";

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

function UsersList() {
  const orders = [
    {
      id: "#5321",
      name: "أحمد توفيق",
      phone: "01090259510",
      email: "khedr.farrg@gmail.com",
      address: "kafr-elshikh",
      numberOrder: "0",
    },
    {
      id: "#5321",
      name: "أحمد توفيق",
      phone: "01090259510",
      email: "khedr.farrg@gmail.com",
      address: "kafr-elshikh",
      numberOrder: "75",
    },
    {
      id: "#5321",
      name: "أحمد توفيق",
      phone: "01090259510",
      email: "khedr.farrg@gmail.com",
      address: "kafr-elshikh",
      numberOrder: "30",
    },
    {
      id: "#5321",
      name: "أحمد توفيق",
      phone: "01090259510",
      email: "khedr.farrg@gmail.com",
      address: "kafr-elshikh",
      numberOrder: "100",
    },
    {
      id: "#5321",
      name: "أحمد توفيق",
      phone: "01090259510",
      email: "khedr.farrg@gmail.com",
      address: "kafr-elshikh",
      numberOrder: "0",
    },
    {
      id: "#5321",
      name: "أحمد توفيق",
      phone: "01090259510",
      email: "khedr.farrg@gmail.com",
      address: "kafr-elshikh",
      numberOrder: "0",
    },
    {
      id: "#5321",
      name: "أحمد توفيق",
      phone: "01090259510",
      email: "khedr.farrg@gmail.com",
      address: "kafr-elshikh",
      numberOrder: "75",
    },
    {
      id: "#5321",
      name: "أحمد توفيق",
      phone: "01090259510",
      email: "khedr.farrg@gmail.com",
      address: "kafr-elshikh",
      numberOrder: "30",
    },
    {
      id: "#5321",
      name: "أحمد توفيق",
      phone: "01090259510",
      email: "khedr.farrg@gmail.com",
      address: "kafr-elshikh",
      numberOrder: "100",
    },
    {
      id: "#5321",
      name: "أحمد توفيق",
      phone: "01090259510",
      email: "khedr.farrg@gmail.com",
      address: "kafr-elshikh",
      numberOrder: "0",
    },
    {
      id: "#5321",
      name: "أحمد توفيق",
      phone: "01090259510",
      email: "khedr.farrg@gmail.com",
      address: "kafr-elshikh",
      numberOrder: "0",
    },
    {
      id: "#5321",
      name: "أحمد توفيق",
      phone: "01090259510",
      email: "khedr.farrg@gmail.com",
      address: "kafr-elshikh",
      numberOrder: "75",
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
    <motion.div
      className="container-fluid"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="row">
        <div className="col-lg-3 col-md-12 mt-2">
          <Cards
            Title="المستخدمون"
            Value="100"
            rate="50"
            color="#009247"
            background="#3BFF9A"
            imgPath={userlogo}
          />
          <Cards
            Title="تقييم المستخدمين"
            Value="4.5"
            rate="18"
            color="#009247"
            background="#3BFF9A"
            imgPath={resteimg}
          />
          <motion.div
            className="shadow-lg card p-4 text-center w-100"
            style={{ margin: "auto" }}
            initial={{ opacity: 0, transform: "translate(100% )" }}
            animate={{ opacity: 1, transform: "translate(0 )" }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
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
        <div className="col-lg-9 col-md-12 d-flex flex-column gap-5">
          <motion.div
            className="shadow-lg card shadow-sm mt-2"
            style={{ borderRadius: "12px" }}
            initial={{ opacity: 0, transform: "translate(-100% )" }}
            animate={{
              opacity: 1,
              transform: "translate(0 )",
            }}
            transition={{ duration: 0.5, delay: 0.3 }}
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
            <table className="table align-middle text-center ">
              <thead>
                <tr>
                  <th>معرف المستخدم</th>
                  <th>الاسم</th>
                  <th>رقم الهاتف</th>
                  <th>البريدالالكتروني</th>
                  <th>عنوان المنزل </th>
                  <th>عدد العمليات</th>
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
                    <td>{order.phone}</td>
                    <td>
                      <span
                        className={` `}
                        style={{
                          padding: "6px 12px",
                          borderRadius: "8px",
                        }}
                      >
                        {order.email}
                      </span>
                    </td>
                    <td>{order.address}</td>
                    <td>
                      <span
                        style={{
                          padding: "6px 12px",
                          borderRadius: "8px",
                        }}
                        className={`badge ${
                          order.numberOrder !== "0" ? "bg-success" : "bg-danger"
                        } `}
                      >
                        {order.numberOrder}
                      </span>
                    </td>
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
    </motion.div>
  );
}

export default UsersList;
