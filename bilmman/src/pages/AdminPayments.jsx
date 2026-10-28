import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import "../styles/adminPayments.css";

const tabs = [
  ["pending", "Kutilmoqda"],
  ["approved", "Tasdiqlangan"],
  ["rejected", "Rad etilgan"],
  ["", "Barchasi"],
];

const REFRESH_MS = 20000;

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
  const [allPayments, setAllPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [notes, setNotes] = useState({});
  const [premiumTests, setPremiumTests] = useState([]);
  const [grantEmail, setGrantEmail] = useState("");
  const [grantTestId, setGrantTestId] = useState("");
  const [granting, setGranting] = useState(false);
  const [grantResult, setGrantResult] = useState(null);

  // One unfiltered fetch feeds every tab and its counter; shortcut: no server paging, fine until payments reach the thousands.
  const loadPayments = useCallback(async ({ silent = false } = {}) => {
    if (!user?.is_staff) return;
    if (!silent) setLoading(true);
    setError("");
    try {
      const data = await api.adminPayments();
      setAllPayments(Array.isArray(data) ? data : []);
    } catch (err) {
      if (!silent) setError(err?.message || "To‘lovlarni yuklab bo‘lmadi.");
    } finally {
      if (!silent) setLoading(false);
    }
  }, [user?.is_staff]);

  useEffect(() => {
    loadPayments();
    const timer = window.setInterval(() => {
      if (!document.hidden) loadPayments({ silent: true });
    }, REFRESH_MS);
    return () => window.clearInterval(timer);
  }, [loadPayments]);

  useEffect(() => {
    if (!user?.is_staff) return;
    api.tests({ premium: "true" })
      .then((data) => setPremiumTests(Array.isArray(data) ? data : []))
      .catch(() => setPremiumTests([]));
  }, [user?.is_staff]);

  const grantAccess = async (event) => {
    event.preventDefault();
    setGranting(true);
    setGrantResult(null);
    try {
      const result = await api.adminGrantAccess({ email: grantEmail.trim(), test_id: Number(grantTestId) });
      setGrantResult({ ok: true, text: result.message });
      setGrantEmail("");
      await loadPayments({ silent: true });
    } catch (err) {
      setGrantResult({ ok: false, text: err?.message || "Access berib bo‘lmadi." });
    } finally {
      setGranting(false);
    }
  };

  const counts = useMemo(() => {
    const byStatus = { pending: 0, approved: 0, rejected: 0 };
    allPayments.forEach((item) => { byStatus[item.status] = (byStatus[item.status] || 0) + 1; });
    return { ...byStatus, "": allPayments.length };
  }, [allPayments]);

  const payments = useMemo(
    () => (statusFilter ? allPayments.filter((item) => item.status === statusFilter) : allPayments),
    [allPayments, statusFilter],
  );

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
      await loadPayments({ silent: true });
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
        <div className="function1-admin-side">
          <Link to="/" className="function1-admin-home">← Bosh sahifaga qaytish</Link>
          <div className="function1-admin-user">
            <small>Admin</small>
            <strong>{user.name || user.email || user.username}</strong>
          </div>
        </div>
      </header>

      <form className="function1-grant" onSubmit={grantAccess}>
        <div className="function1-grant-head">
          <strong>Foydalanuvchiga qo‘lda access berish</strong>
          <span>To‘lov so‘rovisiz, aynan bitta foydalanuvchiga bitta premium testni ochadi.</span>
        </div>
        <div className="function1-grant-fields">
          <input
            type="email"
            required
            placeholder="Foydalanuvchi emaili"
            value={grantEmail}
            onChange={(e) => setGrantEmail(e.target.value)}
            autoComplete="off"
          />
          <select required value={grantTestId} onChange={(e) => setGrantTestId(e.target.value)}>
            <option value="" disabled>Premium testni tanlang</option>
            {premiumTests.map((test) => (
              <option key={test.id} value={test.id}>{test.subject?.name} — {test.title}</option>
            ))}
          </select>
          <button type="submit" disabled={granting || !grantEmail || !grantTestId}>
            {granting ? "Berilmoqda..." : "Access berish"}
          </button>
        </div>
        {grantResult && (
          <p role="status" className={`function1-grant-result ${grantResult.ok ? "is-ok" : "is-error"}`}>{grantResult.text}</p>
        )}
      </form>

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
              <b className={value === "pending" && counts.pending ? "has-pending" : ""}>{counts[value]}</b>
            </button>
          ))}
        </div>
        <button type="button" className="function1-admin-refresh" onClick={loadPayments}>Yangilash</button>
      </section>

      <div className="function1-admin-summary">
        <strong>{payments.length}</strong>
        <span>{statusFilter || "barcha"} to‘lov · har 20 soniyada o‘zi yangilanadi</span>
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

              <div className={`function1-receipt-box${!payment.receipt_url && payment.telegram_receipt_sent ? " is-telegram" : ""}`}>
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
                  <div className="function1-no-receipt function1-telegram-hint">
                    <strong>Telegramda tekshiring</strong>
                    <span>Sizga (@itsgoodboii) chek kelganini va xabarda quyidagilar borligini ko‘ring:</span>
                    <code>{payment.user_email || payment.username}</code>
                    <code>{payment.test_title}</code>
                    <span>Summa {formatMoney(payment.amount)} bo‘lsa — Approve bosing.</span>
                  </div>
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
