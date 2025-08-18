import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./style/style.module.css";

// تعريف window.puter للتايبسكريبت
declare global {
  interface Window {
    puter: any;
  }
}

const quickReplies = [
  "ايه العروض المتاحة؟",
  "أريد التسوق",
  "عاوز اعرف عن الخدمات الزراعية",
  "منتجات الموسم الحالي",
];

// system prompt لتعريف الـ AI
const SYSTEM_PROMPT =
  " أنت مساعد ذكي لموقع إدارة النباتات والخدمات الزراعية. مهمتك فقط الرد على استفسارات العملاء حول خدمات ومنتجات الموقع، ولا ترد على أي أسئلة خارج هذا النطاق.ولو سالك سالك في سئال عن منتج معين هتبحث عنه استخدامه وفوائده والاثار الجانبيه  وكل شئ عنه ";

const ChatModal = ({ onClose }: { onClose: () => void }) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<{ from: "user" | "ai"; text: string }[]>([
    { from: "ai", text: "مرحبًا بك في مساعدك الزراعي! كيف يمكنني مساعدتك في خدمات ومنتجات الموقع؟" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll تلقائي لآخر رسالة
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // دالة للتحقق من كلمات العروض والخصومات
  const checkForOffersKeywords = (msg: string) => {
    const offersKeywords = ['عروض', 'خصم', 'تخفيض', 'offers', 'discount', 'sale'];
    return offersKeywords.some(keyword => 
      msg.toLowerCase().includes(keyword.toLowerCase())
    );
  };

  // دالة للانتقال مع تأكيد
  const navigateWithConfirmation = (path: string) => {
    setPendingNavigation(path);
    setShowConfirmDialog(true);
  };

  // دالة تأكيد الانتقال
  const confirmNavigation = () => {
    if (pendingNavigation) {
      onClose();
      navigate(pendingNavigation);
    }
    setShowConfirmDialog(false);
    setPendingNavigation(null);
  };

  // دالة إلغاء الانتقال
  const cancelNavigation = () => {
    setShowConfirmDialog(false);
    setPendingNavigation(null);
  };

  const sendMessage = async (msg: string) => {
    if (!msg.trim()) return;
    
    // إذا كان الرسالة هي "ممكن مساعدتي في الطلب؟"
    if (msg === "أريد التسوق") {
      setMessages((prev) => [...prev, { from: "user", text: msg }]);
      setLoading(true);
      setTimeout(() => {
        setMessages((prev) => [...prev, { 
          from: "ai", 
          text: "بالطبع! سأوجهك الآن لصفحة المنتجات والخدمات حيث يمكنك تصفح كل ما تحتاجه وطلب المنتجات بسهولة. هل تريد الانتقال الآن؟" 
        }]);
        setLoading(false);
        // انتظر قليلاً ثم اذهب للاستور
        setTimeout(() => {
          navigateWithConfirmation("/store");
        }, 2000);
      }, 1000);
      return;
    }

    // إذا كانت الرسالة تحتوي على كلمات العروض والخصومات
    if (checkForOffersKeywords(msg)) {
      setMessages((prev) => [...prev, { from: "user", text: msg }]);
      setLoading(true);
      setTimeout(() => {
        setMessages((prev) => [...prev, { 
          from: "ai", 
          text: "ممتاز! لدينا عروض وخصومات رائعة على منتجاتنا الزراعية. سأوجهك الآن لقسم العروض والخصومات لتصفح أحدث التخفيضات! هل تريد الانتقال الآن؟" 
        }]);
        setLoading(false);
        // انتظر قليلاً ثم اذهب لقسم العروض
        setTimeout(() => {
          navigateWithConfirmation("/offers");
        }, 2000);
      }, 1000);
      return;
    }
    
    setMessages((prev) => [...prev, { from: "user", text: msg }]);
    setInput("");
    setLoading(true);
    try {
      // أرسل prompt مخصص للـ AI
      const fullPrompt = `${SYSTEM_PROMPT}\n\nسؤال المستخدم: ${msg}`;
      const aiReply = await window.puter.ai.chat(fullPrompt);
      console.log("AI Reply:", aiReply);
      const aiText =
        typeof aiReply?.message?.content === "string" && aiReply.message.content.trim() !== ""
          ? aiReply.message.content
          : "حصل خطأ في الرد!";
      setMessages((prev) => [...prev, { from: "ai", text: aiText }]);
    } catch (err) {
      setMessages((prev) => [...prev, { from: "ai", text: "حصل خطأ في الاتصال!" }]);
    }
    setLoading(false);
  };

  // إذا كان الشات مخفي، اعرض زر صغير فقط
  if (isMinimized) {
    return (
      <div className={styles.minimizedChat}>
        <button 
          className={styles.minimizeBtn}
          onClick={() => setIsMinimized(false)}
          title="إعادة فتح الشات"

        >
فتح الشات 
        </button>
      </div>
    );
  }

  return (
    <>
      <div className={styles.overlay}>
        <div className={styles.modal}>
          {/* الهيدر */}
          <div className={styles.header}>
            <span className={styles.title}>مساعدك الزراعي</span>
            <div className={styles.headerButtons}>
              <button 
                className={styles.minimizeBtn} 
                onClick={() => setIsMinimized(true)}
                title="تصغير الشات"
              >
                −
              </button>
              <button className={styles.closeBtn} onClick={onClose} title="إغلاق الشات">&times;</button>
            </div>
          </div>
          <div className={styles.messages}>
            {messages.map((m, i) => (
              <div key={i} className={`${styles.bubble} ${m.from === "user" ? styles.user : styles.ai}`}>{m.text}</div>
            ))}
            <div ref={messagesEndRef} />
            {loading && <div className={`${styles.bubble} ${styles.ai}`}>جاري الكتابة...</div>}
          </div>
          <div className={styles.quickReplies}>
            {quickReplies.map((q, i) => (
              <button key={i} onClick={() => sendMessage(q)} className={styles.quickReplyBtn}>{q}</button>
            ))}
          </div>
          <div className={styles.inputRow}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !loading && sendMessage(input)}
              placeholder="اكتب سؤالك هنا..."
              disabled={loading}
              className={styles.input}
            />
            <button onClick={() => sendMessage(input)} disabled={loading || !input.trim()} className={styles.sendBtn}>إرسال</button>
          </div>
        </div>
      </div>

      {/* نافذة التأكيد */}
      {showConfirmDialog && (
        <div className={styles.confirmOverlay}>
          <div className={styles.confirmDialog}>
            <h3>تأكيد الانتقال</h3>
            <p>هل تريد الانتقال لصفحة أخرى؟</p>
            <div className={styles.confirmButtons}>
              <button onClick={confirmNavigation} className={styles.confirmBtn}>
                نعم، انتقل
              </button>
              <button onClick={cancelNavigation} className={styles.cancelBtn}>
                لا، إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatModal;
