import { useEffect, useState } from "react";
import { LineChart } from '@mui/x-charts';
import { useMediaQuery } from '@mui/material';
import axios from "axios";
import { ordersPoint } from "../../../../constant/Const";

// دالة تجهيز بيانات آخر 7 أيام
function getLast7DaysData(orders: any[]) {
  const days = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  const paidCounts = days.map(day =>
    orders.filter(order => order.PaymentStatus === "Paid" && order.OrderDate.slice(0, 10) === day).length
  );
  const cancelledCounts = days.map(day =>
    orders.filter(order => order.PaymentStatus === "Cancelled" && order.OrderDate.slice(0, 10) === day).length
  );
  const pendingCounts = days.map(day =>
    orders.filter(order => order.PaymentStatus === "Pending" && order.OrderDate.slice(0, 10) === day).length
  );
  return { days, paidCounts, cancelledCounts, pendingCounts };
}

// الكومبوننت الرئيسي
export default function ChartsModel({ orders: propOrders }: { orders?: any[] }) {
  const [orders, setOrders] = useState<any[]>(propOrders || []);
  const [weekDays, setWeekDays] = useState<string[]>([]);
  const [paidCounts, setPaidCounts] = useState<number[]>([]);
  const [cancelledCounts, setCancelledCounts] = useState<number[]>([]);
  const [pendingCounts, setPendingCounts] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const isMobile = useMediaQuery('(max-width:768px)');

  // جلب الداتا إذا لم تُمرر كـ props
  useEffect(() => {
    if (propOrders && propOrders.length > 0) {
      setOrders(propOrders);
      return;
    }
    setLoading(true);
    async function fetchOrders() {
      let allOrders: any[] = [];
      let pageNumber = 1;
      const pageSize = 50;
      let totalPages = 1;
      do {
        const response = await axios.get(ordersPoint.GetAllOrders, {
          params: { pageNumber, pageSize },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`,
          },
        });
        if (!response.data || !response.data.data) break;
        allOrders = allOrders.concat(response.data.data);
        totalPages = response.data.pagination?.TotalPages || 1;
        pageNumber++;
      } while (pageNumber <= totalPages);
      setOrders(allOrders);
      setLoading(false);
    }
    fetchOrders();
  }, [propOrders]);

  // تجهيز بيانات الرسم
  useEffect(() => {
    if (!orders || orders.length === 0) return;
    const { days, paidCounts, cancelledCounts, pendingCounts } = getLast7DaysData(orders);
    setWeekDays(days);
    setPaidCounts(paidCounts);
    setCancelledCounts(cancelledCounts);
    setPendingCounts(pendingCounts);
  }, [orders]);

  // حساب إجمالي الطلبات ومعدل النمو
  const totalOrders = paidCounts.reduce((a, b) => a + b, 0) + cancelledCounts.reduce((a, b) => a + b, 0) + pendingCounts.reduce((a, b) => a + b, 0);
  let growth = 0;
  let growthDir: 'up' | 'down' | 'flat' = 'flat';
  if (paidCounts.length > 1) {
    const prev = paidCounts[paidCounts.length - 2];
    const last = paidCounts[paidCounts.length - 1];
    if (prev === 0 && last > 0) {
      growth = 100;
      growthDir = 'up';
    } else if (prev === 0 && last === 0) {
      growth = 0;
      growthDir = 'flat';
    } else {
      growth = Math.round(((last - prev) / (prev === 0 ? 1 : prev)) * 100);
      if (last > prev) growthDir = 'up';
      else if (last < prev) growthDir = 'down';
      else growthDir = 'flat';
    }
  }

  if (loading) return <div style={{textAlign:'center',padding:'2rem'}}>جاري تحميل البيانات...</div>;

  const containerStyle: React.CSSProperties = {
    width: '100%',
    background: '#fff',
    borderRadius: 18,
    boxShadow: '0 4px 24px rgba(1,143,44,0.13)',
    padding: isMobile ? '1rem 0.75rem 1rem 0.75rem' : '2rem 1.5rem 1.5rem 1.5rem',
    margin: '1.5rem 0',
    position: 'relative',
    minHeight: isMobile ? 330 : 370,
  };

  const titleStyle: React.CSSProperties = {
    fontWeight: 'bold',
    fontSize: isMobile ? 18 : 20,
    color: '#018f2c',
    marginBottom: isMobile ? 12 : 18,
    letterSpacing: 1,
    textAlign: 'center',
  };

  const infoCardTextStyle: React.CSSProperties = { color: '#018f2c', fontWeight: 700, fontSize: isMobile ? 14 : 16 };
  const infoCardValueStyle: React.CSSProperties = { color: '#222', fontWeight: 900, fontSize: isMobile ? 20 : 22, letterSpacing: 1 };

  const legendStyle: React.CSSProperties = isMobile
    ? { position: 'static', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 8 }
    : { position: 'absolute', left: 24, top: 32, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8, zIndex: 2 };

  const chartHeight = isMobile ? 260 : 300;

  return (
    <div style={containerStyle}>
      {/* العنوان */}
      <div style={titleStyle}>
        إحصائيات الطلبات خلال آخر 7 أيام
      </div>
      {/* معلومات معدل النمو وإجمالي الطلبات */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 32,
        marginBottom: isMobile ? 8 : 12,
        marginTop: 8,
        flexWrap: 'wrap'
      }}>
        {/* إجمالي الطلبات */}
        <div style={{
          background: '#f6fff9',
          borderRadius: 10,
          padding: '10px 22px',
          boxShadow: '0 2px 8px rgba(1,143,44,0.07)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minWidth: isMobile ? 110 : 120
        }}>
          <span style={infoCardTextStyle}>إجمالي الطلبات</span>
          <span style={infoCardValueStyle}>{totalOrders}</span>
        </div>
        {/* معدل النمو */}
        <div style={{
          background: '#f6fff9',
          borderRadius: 10,
          padding: '10px 22px',
          boxShadow: '0 2px 8px rgba(1,143,44,0.07)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minWidth: isMobile ? 110 : 120
        }}>
          <span style={infoCardTextStyle}>معدل النمو</span>
          <span style={{
            color:
              growthDir === 'up' ? 'green' : growthDir === 'down' ? 'red' : 'gray',
            fontWeight: 900,
            fontSize: isMobile ? 20 : 22,
            letterSpacing: 1,
            display: 'flex',
            alignItems: 'center'
          }}>
            {growthDir === 'up' && <span style={{ fontSize: 18, marginInlineEnd: 4 }}>↑</span>}
            {growthDir === 'down' && <span style={{ fontSize: 18, marginInlineEnd: 4 }}>↓</span>}
            {growthDir === 'flat' && <span style={{ fontSize: 18, marginInlineEnd: 4 }}>→</span>}
            {Math.abs(growth)}%
          </span>
        </div>
      </div>
      {/* الليجند أعلى الشمال */}
      <div style={legendStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ display: 'inline-block', width: 16, height: 8, borderRadius: 4, background: '#009247', marginInlineEnd: 6 }}></span>
          <span style={{ color: '#009247', fontWeight: 600, fontSize: isMobile ? 13 : 15 }}>الطلبات المدفوعة</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ display: 'inline-block', width: 16, height: 8, borderRadius: 4, background: '#e53935', marginInlineEnd: 6 }}></span>
          <span style={{ color: '#e53935', fontWeight: 600, fontSize: isMobile ? 13 : 15 }}>الطلبات الملغاة</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ display: 'inline-block', width: 16, height: 8, borderRadius: 4, background: '#ff9800', marginInlineEnd: 6 }}></span>
          <span style={{ color: '#ff9800', fontWeight: 600, fontSize: isMobile ? 13 : 15 }}>قيد المعالجة</span>
        </div>
      </div>
      {/* الرسم البياني */}
      <LineChart
        height={chartHeight}
        series={[
          { data: paidCounts, label: " ", area: true, color: "#009247", curve: "bumpX" },
          { data: cancelledCounts, label: " ", area: true, color: "#e53935", curve: "bumpX" },
          { data: pendingCounts, label: " ", area: true, color: "#ff9800", curve: "bumpX" },
        ]}
        xAxis={[
          {
            scaleType: 'point',
            data: weekDays,
            valueFormatter: (value) => value.slice(5),
            label: 'اليوم',
            tickLabelStyle: { fontWeight: 600, fontSize: isMobile ? 10 : 14, color: '#018f2c' },
          },
        ]}
        yAxis={[{
          width: isMobile ? 36 : 50,
          tickLabelStyle: { fontWeight: 600, fontSize: isMobile ? 10 : 14, color: '#018f2c' },
        }]}
        margin={{ right: isMobile ? 10 : 24, left: isMobile ? 10 : 24, top: isMobile ? 10 : 24, bottom: isMobile ? 16 : 24 }}
        grid={{ vertical: true, horizontal: true }}
      />
    </div>
  );
}
