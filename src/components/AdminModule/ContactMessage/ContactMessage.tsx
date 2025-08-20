import axios from 'axios';
import { useContext } from 'react';
import { ContactMessageContext } from '../../../context/ContactMessageContext';
import React, { useEffect, useState } from 'react'
import { contactMessagesPoint } from '../../../constant/Const';
import styles from './style/ContactMessage.module.css';
import { toast } from 'react-toastify';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// Replaced shimmer usage on small screens if needed
interface ContactMessage{
  Id: number
  Name: string
  Email: string
  Phone: string
  Address: string
  Government: string
  Message: string
  SentAt: string
  IsRead: boolean
  Service_type: string
  User_type: string
}

// ContactMessage component - RFC (React Functional Component)
const ContactMessage: React.FC = () => {
  const { messages: contactMessages, setMessages: setContactMessages, fetchMessages } = useContext(ContactMessageContext) || { messages: [], setMessages: () => {}, fetchMessages: async () => {} };
  const [loading, setLoading] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // لم نعد بحاجة لجلب الرسائل هنا، فهي تأتي من الـ Context

  const handleToggleRead = async (msg: ContactMessage) => {
    try {
      const response = await axios.put(
        contactMessagesPoint.Put(msg.Id),
        {
          ...msg,
          IsRead: !msg.IsRead,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}` },
        }
      );
      // حدث الرسائل في الـ Context
      setContactMessages((prev: ContactMessage[]) =>
        prev.map((m) =>
          m.Id === msg.Id ? { ...m, IsRead: !m.IsRead } : m
        )
      );
      toast.success(response.data);
    } catch (error) {
      toast.error("حدث خطأ أثناء تحديث حالة الرسالة");
    }
  };

  const handleCardClick = (msg: ContactMessage) => {
    setSelectedMessage(msg);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedMessage(null);
  };

  const handleDeleteClick = () => {
    setShowConfirmDelete(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedMessage) return;
    setDeleting(true);
    try {
      await axios.delete(contactMessagesPoint.Delete(selectedMessage.Id), {
        headers: { Authorization: `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}` },
      });
      setContactMessages((prev: ContactMessage[]) => prev.filter((m) => m.Id !== selectedMessage.Id));
      toast.success('تم حذف الرسالة بنجاح');
      handleCloseModal();
    } catch (error) {
      toast.error('حدث خطأ أثناء حذف الرسالة');
    } finally {
      setDeleting(false);
      setShowConfirmDelete(false);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmDelete(false);
  };

  const handleSelect = (id: number) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleSelectAll = () => {
    const unreadIds = contactMessages.filter(m => !m.IsRead).map(m => m.Id);
    if (unreadIds.length === 0) return;
    if (unreadIds.every(id => selectedIds.includes(id))) {
      setSelectedIds(selectedIds.filter(id => !unreadIds.includes(id)));
    } else {
      setSelectedIds(Array.from(new Set([...selectedIds, ...unreadIds])));
    }
  };

  const handleBulkToggleRead = async () => {
    const selectedMsgs = contactMessages.filter(m => selectedIds.includes(m.Id));
    try {
      await Promise.all(selectedMsgs.map(msg =>
        axios.put(contactMessagesPoint.Put(msg.Id), {
          ...msg,
          IsRead: !msg.IsRead,
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}` },
        })
      ));
      setContactMessages((prev) =>
        prev.map(m => selectedIds.includes(m.Id) ? { ...m, IsRead: !m.IsRead } : m)
      );
      toast.success('تم تحديث حالة الرسائل المحددة بنجاح');
      setSelectedIds([]);
    } catch (error) {
      toast.error('حدث خطأ أثناء تحديث حالة الرسائل');
    }
  };

  const unreadCount = contactMessages.filter(m => !m.IsRead).length;

  return (
    <div className={styles.container}>
      {loading ? (
        <>
          {/* شيمر الهيدر */}
          <div style={{ marginBottom: 24 }}>
            <ShimmerPostItem hasImage={false} title cta />
          </div>
          {/* شيمر شريط الأدوات */}
          <div style={{ marginBottom: 16 }}>
            <ShimmerSimpleGallery row={1} col={2} imageHeight={28} />
          </div>
          {/* شيمر كروت الرسائل */}
          <div className={styles.cardsWrapper}>
            <ShimmerPostItem title cta />
            <ShimmerPostItem title cta />
            <ShimmerPostItem title cta />
          </div>
        </>
      ) : (
        <>
          <h2 style={{display:'flex',alignItems:'center',gap:'0.7rem'}}>
            رسائل التواصل
            <span className={unreadCount > 0 ? styles.unreadBadge : styles.readBadge}>
              {unreadCount} غير مقروءة
            </span>
          </h2>
          {contactMessages.length > 0 && contactMessages.some(m => !m.IsRead) && (
            <div style={{display:'flex',alignItems:'center',gap:'1.2rem',marginBottom:'1rem'}}>
              <label style={{display:'flex',alignItems:'center',gap:'0.4rem',fontWeight:'bold'}}>
                <input type="checkbox" checked={contactMessages.filter(m => !m.IsRead).length > 0 && contactMessages.filter(m => !m.IsRead).every(m => selectedIds.includes(m.Id))} onChange={handleSelectAll} />
                تحديد الكل
              </label>
              {selectedIds.length > 0 && (
                <button className={styles.bulkBtn} onClick={handleBulkToggleRead}>
                  تغيير حالة القراءة ({selectedIds.length})
                </button>
              )}
            </div>
          )}
          <p>هنا ستظهر رسائل التواصل من المستخدمين.</p>
          <div className={styles.cardsWrapper}>
            {contactMessages.length === 0 ? (
              <div className={styles.emptyState}>
                <span role="img" aria-label="no-messages" style={{fontSize: '2.5rem'}}>📭</span>
                <p>لا توجد رسائل حالياً</p>
              </div>
            ) : contactMessages.map((msg) => (
              <div key={msg.Id} className={styles.messageCard + ' ' + (!msg.IsRead ? styles.unread : '')} 
                onClick={e => {
                  // لا تفتح المودال إذا كان الضغط على checkbox أو label للسويتش
                  if (
                    (e.target as HTMLElement).closest('input[type="checkbox"]') ||
                    (e.target as HTMLElement).closest('label.' + styles.switch)
                  ) return;
                  handleCardClick(msg);
                }}
                style={{cursor:'pointer',position:'relative'}}
              >
                <input
                  type="checkbox"
                  checked={selectedIds.includes(msg.Id)}
                  onChange={e => { e.stopPropagation(); handleSelect(msg.Id); }}
                  className={styles.cardCheckbox}
                  style={{position:'absolute',top:'.5rem',right:'1rem',zIndex:2}}
                />
                <div className={styles.messageHeader}>
                  <span>{msg.Name}</span>
                  <span>{msg.Email}</span>
                  <label className={styles.switch} title={msg.IsRead ? 'مقروء' : 'غير مقروء'} onClick={e => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={msg.IsRead}
                      onChange={() => handleToggleRead(msg)}
                    />
                    <span className={styles.slider + ' ' + (msg.IsRead ? styles.read : styles.unread)}></span>
                  </label>
                </div>
                <div className={styles.messageBody}>
                  <p>{msg.Message.length > 80 ? msg.Message.slice(0, 80) + '...' : msg.Message}</p>
                </div>
                <div className={styles.messageFooter}>
                  <span>هاتف: {msg.Phone}</span>
                  <span>محافظة: {msg.Government}</span>
                  <span>نوع الخدمة: {msg.Service_type}</span>
                  <span>نوع المستخدم: {msg.User_type}</span>
                  <span>العنوان: {msg.Address}</span>
                  <span>تاريخ الإرسال: {new Date(msg.SentAt).toLocaleString('ar-EG')}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      {/* Modal */}
      {showModal && selectedMessage && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div className={styles.modalBox} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>تفاصيل الرسالة</h3>
              <button className={styles.deleteBtn} onClick={handleDeleteClick} disabled={deleting} title="حذف الرسالة">
                <FontAwesomeIcon icon={faTrash} />
              </button>
              <button className={styles.closeBtn} onClick={handleCloseModal} title="إغلاق">×</button>
            </div>
            <div className={styles.modalBody}>
              <div><b>الاسم:</b> {selectedMessage.Name}</div>
              <div><b>البريد الإلكتروني:</b> {selectedMessage.Email}</div>
              <div><b>الهاتف:</b> {selectedMessage.Phone}</div>
              <div><b>المحافظة:</b> {selectedMessage.Government}</div>
              <div><b>نوع الخدمة:</b> {selectedMessage.Service_type}</div>
              <div><b>نوع المستخدم:</b> {selectedMessage.User_type}</div>
              <div><b>العنوان:</b> {selectedMessage.Address}</div>
              <div><b>تاريخ الإرسال:</b> {new Date(selectedMessage.SentAt).toLocaleString('ar-EG')}</div>
              <div className={styles.modalMessage}><b>الرسالة:</b><br />{selectedMessage.Message}</div>
            </div>
          </div>
        </div>
      )}
      {/* Confirm Delete Modal */}
      {showConfirmDelete && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox} style={{maxWidth:'350px',textAlign:'center'}}>
            <div className={styles.modalHeader} style={{justifyContent:'center'}}>
              <h4 style={{color:'#e74c3c',margin:'0'}}>تأكيد الحذف</h4>
            </div>
            <div className={styles.modalBody}>
              <p>هل أنت متأكد أنك تريد حذف هذه الرسالة؟</p>
              <div style={{display:'flex',gap:'1rem',justifyContent:'center',marginTop:'1.2rem'}}>
                <button className={styles.deleteBtn} onClick={handleConfirmDelete} disabled={deleting}>حذف</button>
                <button className={styles.closeBtn} onClick={handleCancelDelete} disabled={deleting}>إلغاء</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactMessage;
