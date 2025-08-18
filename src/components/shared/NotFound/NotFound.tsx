import React from "react";
import styles from "./style/Style.module.css";
import illustration from "./style/svg/error.svg"; // Add the illustration image to the assets folder
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBackward, faReply } from "@fortawesome/free-solid-svg-icons";

function NotFound() {
  return (
    <div className={styles.container}>
      <img
        src={illustration}
        alt="404 Illustration"
        className={styles.illustration}
      />
      <div className={styles.captioncontaner}>
        <div className={styles.header}>
          <h1 className={styles.heading}>
            عذراً!<span className={styles.styleheader}> حدث خطأ</span>
          </h1>
          <p className={styles.description}>
            نأسف، ولكن الصفحة التي تحاول الوصول إليها غير متاحة. قد يكون الرابط
            الذي أدخلته غير صحيح أو ربما تم نقل الصفحة.
          </p>
          <a href="/support" className={styles.supportlink}>
            للتواصل مع الدعم
          </a>
        </div>
        <div className={styles.buttons}>
          <button
            className={`${styles.button} ${styles.reload}`}
            onClick={() => window.location.reload()}
          >
            إعادة التحميل
            <FontAwesomeIcon icon={faReply} />
          </button>
          <button
            className={`${styles.button} ${styles.back}`}
            onClick={() => window.history.back()}
          >
            الرجوع للخلف
            <FontAwesomeIcon icon={faBackward} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
