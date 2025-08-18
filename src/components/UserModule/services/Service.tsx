import React from "react";
import { useLocation } from "react-router-dom";

export default function Service() {
  const data = useLocation();
  console.log(data);

  const renderServiceTitle = () => {
    switch (data.state) {
      case "استصلاح اراضي":
        return "استصلاح اراضي";
      case "خدمة تساهيل ":
        return "خدمة تساهيل";
      case "دعم فني":
        return "دعم فني";
      default:
        return data.state || "No service information available";
    }
  };

  const renderServiceContent = () => {
    switch (data.state) {
      case "استصلاح اراضي":
        return <p>Content for استصلاح اراضي</p>;
      case "خدمة تساهيل ":
        return <p>Content for خدمة تساهيل</p>;
      case "دعم فني":
        return <p>Content for دعم فني</p>;
      default:
        return <p>No service information available</p>;
    }
  };

  return (
    <>
      <div className="service mt-5">
        <div className="service__container">
          <div className="service__title mt-5">{renderServiceContent()}</div>
        </div>
      </div>
    </>
  );
}
