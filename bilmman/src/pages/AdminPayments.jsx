import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import "../styles/adminPayments.css";

const tabs = [
  ["pending", "Kutilmoqda"],
  ["approved", "Tasdiqlangan"],
  ["rejected", "Rad etilgan"],
  ["", "Barchasi"],
];

function formatMoney(value) {
  const number = Number(value || 0);
  return `${new Intl.NumberFormat("uz-UZ", { maximumFractionDigits: 0 }).format(number)} UZS`;
}

function formatDate(value) {
  if (!value) return "—";
  try {
    return new Intl.DateTimeFormat("uz-UZ", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
  } catch {
    return value;
  }
}

function AdminPayments() {
  const { user, loading: authLoading } = useAuth();
  const [statusFilter, setStatusFilter] = useState("pending");
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [notes, setNotes] = useState({});

  const loadPayments = useCallback(async () => {
    if (!user?.is_staff) return;
    setLoading(true);
    setError("");
    try {
      const data = await api.adminPayments({ status: statusFilter });
      setPayments(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.message || "To‘lovlarni yuklab bo‘lmadi.");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, user?.is_staff]);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  const counts = useMemo(() => ({ current: payments.length }), [payments]);

  const decide = async (payment, action) => {
    const verb = action === "approve" ? "tasdiqlash" : "rad etish";
    if (!window.confirm(`${payment.username}ning ${payment.test_title} uchun to‘lovini ${verb}?`)) return;
    setBusyId(payment.id);
    setError("");
    try {
      await api.adminPaymentDecision(payment.id, {
        action,
        admin_note: notes[payment.id] || "",
      });
      await loadPayments();
    } catch (err) {
      setError(err?.message || "Amalni bajarib bo‘lmadi.");
    } finally {
      setBusyId(null);
    }
  };

  if (authLoading) return <div className="function1-admin-center">Tekshirilmoqda...</div>;
  if (!user) return <Navigate to="/account" replace />;
  if (!user.is_staff) {
    return (
      <main className="function1-admin-shell">
        <div className="function1-admin-forbidden">
          <span>403</span>
          <h1>Admin ruxsati kerak</h1>
          <p>Bu sahifa faqat staff/superuser hisoblari uchun.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="function1-admin-shell">
      <header className="function1-admin-header">
        <div>
          <span className="function1-admin-eyebrow">FUNCTION ADMIN</span>
          <h1>To‘lovlarni tekshirish</h1>
          <p>Telegramdagi chek yoki transaction ID’ni tekshiring va premium accessni boshqaring.</p>
        </div>
        <div className="function1-admin-user">
          <small>Admin</small>
          <strong>{user.name || user.email || user.username}</strong>
        </div>
      </header>

      <section className="function1-admin-toolbar">
        <div className="function1-admin-tabs">
          {tabs.map(([value, label]) => (
            <button
              key={label}
              type="button"
              className={statusFilter === value ? "is-active" : ""}
              onClick={() => setStatusFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>
        <button type="button" className="function1-admin-refresh" onClick={loadPayments}>Yangilash</button>
      </section>

      <div className="function1-admin-summary">
        <strong>{counts.current}</strong>
        <span>{statusFilter || "barcha"} to‘lov</span>
      </div>

      {error && <div className="function1-admin-error">{error}</div>}
      {loading ? (
        <div className="function1-admin-empty">To‘lovlar yuklanmoqda...</div>
      ) : payments.length === 0 ? (
        <div className="function1-admin-empty">Bu bo‘limda to‘lov yo‘q.</div>
      ) : (
        <section className="function1-admin-grid">
          {payments.map((payment) => (
            <article className="function1-payment-card" key={payment.id}>
              <div className="function1-payment-card-head">
                <div>
                  <span className={`function1-payment-status is-${payment.status}`}>{payment.status}</span>
                  <h2>{payment.username}</h2>
                  <p>{payment.user_email || "Email yo‘q"}</p>
                </div>
                <strong>{formatMoney(payment.amount)}</strong>
              </div>

              <div className="function1-payment-meta">
                <div><span>Test</span><strong>{payment.test_title}</strong></div>
                <div><span>Fan</span><strong>{payment.subject_name}</strong></div>
                <div><span>Transaction ID</span><strong>{payment.transaction_id || "—"}</strong></div>
                <div><span>Chek kanali</span><strong>{payment.telegram_receipt_sent ? "Telegram" : (payment.receipt_url ? "Saytga yuklangan" : "—")}</strong></div>
                <div><span>Yuborilgan</span><strong>{formatDate(payment.created_at)}</strong></div>
              </div>

              <div className="function1-receipt-box">
                {payment.receipt_url ? (
                  payment.receipt_kind === "image" ? (
                    <a href={payment.receipt_url} target="_blank" rel="noreferrer">
                      <img src={payment.receipt_url} alt="To‘lov cheki" />
                      <span>Chekni kattalashtirish</span>
                    </a>
                  ) : (
                    <a className="function1-receipt-pdf" href={payment.receipt_url} target="_blank" rel="noreferrer">
                      PDF chekni ochish
                    </a>
                  )
                ) : payment.telegram_receipt_sent ? (
                  <div className="function1-no-receipt">Chek Telegram orqali yuborilgan — Telegramdan email va test nomi bo‘yicha tekshiring.</div>
                ) : (
                  <div className="function1-no-receipt">Chek fayli yuborilmagan</div>
                )}
              </div>

              <label className="function1-admin-note">
                <span>Admin izohi</span>
                <textarea
                  value={notes[payment.id] ?? payment.admin_note ?? ""}
                  onChange={(e) => setNotes((current) => ({ ...current, [payment.id]: e.target.value }))}
                  placeholder="Ixtiyoriy izoh..."
                  maxLength={3000}
                  disabled={payment.status !== "pending"}
                />
              </label>

              {payment.status === "pending" ? (
                <div className="function1-payment-actions">
                  <button type="button" className="reject" disabled={busyId === payment.id} onClick={() => decide(payment, "reject")}>Rad etish</button>
                  <button type="button" className="approve" disabled={busyId === payment.id} onClick={() => decide(payment, "approve")}>
                    {busyId === payment.id ? "Saqlanmoqda..." : "Approve · Premium ochish"}
                  </button>
                </div>
              ) : (
                <div className="function1-payment-reviewed">
                  {payment.status === "approved" ? "Premium aktiv ✅" : "To‘lov rad etilgan"}
                  {payment.reviewed_by_username ? ` · ${payment.reviewed_by_username}` : ""}
                </div>
              )}
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default AdminPayments;
