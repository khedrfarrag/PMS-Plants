import React from "react";
import { motion } from "framer-motion";
import Style from "../../AdminModule/Home/Dashboard.module.css";

type Props = {
  imgPath: string;
  Title: string;
  Value: string;
  rate: string;
  color: string;
  background: string;
};
export default function Cards(props: Props) {
  return (
    <>
      <motion.div
        className={`${Style.cards1} border shadow-lg mb-3`}
        initial={{ opacity: 0, transform: "translate(100% )" }}
        animate={{ opacity: 1, transform: "translate(0 )" }}
        transition={{ duration: 0.5 }}
      >
        <h5 className=""> {props.Title} </h5>
        <div className={`${Style.heroCaption}`}>
          <span className={Style.herologo}>
            <img src={props.imgPath} alt="" />
          </span>
          <h1 className="me-3">{props.Value}</h1>
        </div>
        <div className={`${Style.heroDesc} `}>
          <span className="ms-1">
            <select className="form-select form-select-sm w-auto">
              <option>شهري</option>
              <option>سنوي</option>
              <option>اسبوعي</option>
            </select>
          </span>
          <span
            className={`${Style.heroinfo} ms-5`}
            style={{ background: props.background, color: props.color }}
          >
            {" "}
            {props.rate}%+{" "}
          </span>
        </div>
      </motion.div>
    </>
  );
}
