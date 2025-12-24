import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Style from "../Style.module.css";
import userimg from "../svg/Image.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowAltCircleLeft,
  faArrowAltCircleRight,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { siteFeedbackPoint, ImgURLBeasd } from "../../../../constant/Const";
export default function Customer() {
  interface siteFeedBack {
    data: {
      Comment: string;
      CreatedAt: string;
      Rating: number;
      UserId: string;
      UserName: string;
      UserImage?: string;
    }[];
    pagination: {
      CurrentPage: number;
      PageSize: number;
      TotalCount: number;
      TotalPages: number;
    };
  }
  const [currentPage, setCurrentPage] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const pageSize = 1;

  const [siteFeedBack, setSiteFeedBack] = useState<siteFeedBack>();

  // دالة لتنسيق التاريخ
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      const day = date.getDate();
      const month = date.getMonth() + 1; // getMonth() returns 0-11
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString; // return original string if parsing fails
    }
  };

  const getAllSiteFeedBack = async ({
    pageNumber: pageNumber,
    pageSize: pageSize,
  }: {
    pageNumber: number;
    pageSize: number;
  }) => {
    try {
      const response = await axios<siteFeedBack>(siteFeedbackPoint.Get, {
        params: {
          pageSize,
          pageNumber,
        },
        headers: {
          Authorization: `Bearer ${
            localStorage.getItem("token") || sessionStorage.getItem("token")
          }`,
        },
      });
      setSiteFeedBack(response?.data);
    } catch (errors) {
      console.log(errors);
    }
  };
  const totalPages = siteFeedBack?.pagination?.TotalPages || 1;

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else {
      setCurrentPage(1); // infinity loop
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else {
      setCurrentPage(totalPages); // infinity loop
    }
  };
  useEffect(() => {
    getAllSiteFeedBack({ pageNumber: currentPage, pageSize });
  }, [currentPage]);

  // Auto-slide every 3 seconds, pause on hover
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      handleNextPage();
    }, 3000);
    return () => clearInterval(interval);
  }, [currentPage, isHovered, totalPages]);
  return (
    <>
      <div
        className={Style.SecCustomer}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={Style.headerCustomer}>
          <h1>آراء العملاء</h1>
          <p>تجارب حقيقية من عملائنا حول جودة منتجاتنا وخدماتنا المميزة!</p>
        </div>
        <AnimatePresence mode="wait">
          {siteFeedBack?.data?.map((item) => (
            <motion.div
              key={currentPage}
              className={Style.bodyCard}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.5, type: "tween" }}
            >
              <div className={Style.customerDetals}>
                <div className={Style.customerinfo}>
                  <img
                    style={{
                      borderRadius: "50%",
                      width: "60px",
                      height: "60px",
                    }}
                    src={
                      item.UserImage
                        ? `${ImgURLBeasd}/${item.UserImage}`
                        : userimg
                    }
                    alt="user"
                  />
                  <div className={Style.customerName}>
                    <h2>{item.UserName}</h2>
                  </div>
                </div>
                <div className={Style.customerRate}>
                  <p>{formatDate(item.CreatedAt)}</p>
                  <span>
                    <i className="fa fa-star" />
                    {""}
                    {item.Rating}
                  </span>
                </div>
              </div>
              <h6>{item.Comment}</h6>
            </motion.div>
          ))}
        </AnimatePresence>
        <div className={`${Style.heroPagenation}  `}>
          <FontAwesomeIcon
            icon={faArrowAltCircleRight}
            style={{ fontSize: "25px", color: "green", cursor: "pointer" }}
            onClick={handlePrevPage}
          />
          <span>
            {totalPages} / <span>{currentPage}</span>
          </span>
          <FontAwesomeIcon
            icon={faArrowAltCircleLeft}
            style={{ fontSize: "25px", color: "green", cursor: "pointer" }}
            onClick={handleNextPage}
          />
        </div>
      </div>
    </>
  );
}
