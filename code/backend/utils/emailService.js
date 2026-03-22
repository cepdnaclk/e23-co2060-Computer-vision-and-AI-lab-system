// backend/utils/emailService.js
// Sends transactional emails for booking events.
// Uses Nodemailer — configure SMTP in .env (works with Gmail, Outlook, or any SMTP).

const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST   || 'smtp.gmail.com',
  port:   parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

const FROM = `"CV & AI Lab" <${process.env.SMTP_USER || 'noreply@eng.pdn.ac.lk'}>`
const LAB_URL = process.env.CLIENT_URL || 'http://localhost:3000'

// ── Shared HTML wrapper ────────────────────────────────────────
const wrapHtml = (content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background:#f5f6f8; margin:0; padding:0; }
    .container { max-width:580px; margin:40px auto; background:#fff; border-radius:8px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,.08); }
    .header { background:#0b1f3a; padding:28px 36px; }
    .header h1 { color:#fff; font-size:20px; margin:0; }
    .header p  { color:rgba(255,255,255,.5); font-size:12px; margin:4px 0 0; }
    .body { padding:32px 36px; color:#1a2332; }
    .body p { font-size:14px; line-height:1.7; margin:0 0 16px; }
    .detail-box { background:#f5f6f8; border-left:3px solid #c8102e; border-radius:4px; padding:16px 20px; margin:20px 0; }
    .detail-row { display:flex; justify-content:space-between; font-size:13px; padding:4px 0; }
    .detail-row strong { color:#0b1f3a; }
    .btn { display:inline-block; background:#c8102e; color:#fff; padding:12px 28px; border-radius:6px; text-decoration:none; font-size:14px; font-weight:600; margin:16px 0; }
    .footer { background:#f5f6f8; padding:20px 36px; font-size:12px; color:#5a6478; text-align:center; border-top:1px solid #e8eaee; }
    .badge-green  { background:#dcfce7; color:#16a34a; padding:3px 10px; border-radius:20px; font-size:12px; }
    .badge-red    { background:#fee2e2; color:#c8102e; padding:3px 10px; border-radius:20px; font-size:12px; }
    .badge-orange { background:#fef3c7; color:#d97706; padding:3px 10px; border-radius:20px; font-size:12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>CV &amp; AI Laboratory</h1>
      <p>University of Peradeniya · Faculty of Engineering</p>
    </div>
    <div class="body">${content}</div>
    <div class="footer">
      This is an automated message from the CV &amp; AI Lab Management System.<br/>
      <a href="${LAB_URL}" style="color:#c8102e">Visit Lab Portal</a>
    </div>
  </div>
</body>
</html>`

// ── Email templates ────────────────────────────────────────────

const sendBookingApproved = async ({ to, name, equipmentName, startTime, endTime, qrCode }) => {
  const html = wrapHtml(`
    <p>Hi <strong>${name}</strong>,</p>
    <p>Great news! Your equipment booking has been <span class="badge-green">Approved</span>.</p>
    <div class="detail-box">
      <div class="detail-row"><span>Equipment</span><strong>${equipmentName}</strong></div>
      <div class="detail-row"><span>Start</span><strong>${new Date(startTime).toLocaleString()}</strong></div>
      <div class="detail-row"><span>End</span><strong>${new Date(endTime).toLocaleString()}</strong></div>
      <div class="detail-row"><span>QR Code</span><strong>${qrCode}</strong></div>
    </div>
    <p>Please present your QR code to the Technical Officer when collecting the equipment.</p>
    <a class="btn" href="${LAB_URL}/dashboard/bookings">View My Bookings</a>
  `)
  await transporter.sendMail({ from: FROM, to, subject: `✅ Booking Approved — ${equipmentName}`, html })
}

const sendBookingRejected = async ({ to, name, equipmentName, reason }) => {
  const html = wrapHtml(`
    <p>Hi <strong>${name}</strong>,</p>
    <p>Unfortunately your booking request has been <span class="badge-red">Rejected</span>.</p>
    <div class="detail-box">
      <div class="detail-row"><span>Equipment</span><strong>${equipmentName}</strong></div>
      ${reason ? `<div class="detail-row"><span>Reason</span><strong>${reason}</strong></div>` : ''}
    </div>
    <p>You can submit a new booking request at a different time or contact the lab if you have questions.</p>
    <a class="btn" href="${LAB_URL}/dashboard/equipment">Browse Equipment</a>
  `)
  await transporter.sendMail({ from: FROM, to, subject: `❌ Booking Rejected — ${equipmentName}`, html })
}

const sendWelcomeEmail = async ({ to, name, role }) => {
  const roleMap = {
    student_internal: 'Student (Internal)',
    student_external: 'External Student',
    staff: 'Research Staff',
    professor: 'Professor',
    officer: 'Technical Officer',
    admin: 'Lab Admin',
  }
  const html = wrapHtml(`
    <p>Hi <strong>${name}</strong>,</p>
    <p>Welcome to the <strong>CV &amp; AI Lab Management System</strong>!</p>
    <p>Your account has been approved and you can now log in to access lab resources.</p>
    <div class="detail-box">
      <div class="detail-row"><span>Account Email</span><strong>${to}</strong></div>
      <div class="detail-row"><span>Role</span><strong>${roleMap[role] || role}</strong></div>
    </div>
    <a class="btn" href="${LAB_URL}/login">Sign In Now</a>
    <p>You can book equipment, reserve lab spaces, and request GPU compute jobs from the dashboard.</p>
  `)
  await transporter.sendMail({ from: FROM, to, subject: 'Welcome to CV & AI Lab System', html })
}

const sendConsultationUpdate = async ({ to, name, topic, status, staffName, proposedAt, notes }) => {
  const badge = status === 'approved'
    ? '<span class="badge-green">Approved</span>'
    : status === 'rejected'
    ? '<span class="badge-red">Rejected</span>'
    : `<span class="badge-orange">${status}</span>`

  const html = wrapHtml(`
    <p>Hi <strong>${name}</strong>,</p>
    <p>Your consultation request has been updated to ${badge}.</p>
    <div class="detail-box">
      <div class="detail-row"><span>Topic</span><strong>${topic}</strong></div>
      <div class="detail-row"><span>With</span><strong>${staffName}</strong></div>
      <div class="detail-row"><span>Proposed Time</span><strong>${new Date(proposedAt).toLocaleString()}</strong></div>
      ${notes ? `<div class="detail-row"><span>Notes</span><strong>${notes}</strong></div>` : ''}
    </div>
    <a class="btn" href="${LAB_URL}/dashboard/consultations">View Consultations</a>
  `)
  await transporter.sendMail({ from: FROM, to, subject: `Consultation ${status}: ${topic}`, html })
}

const sendPaymentVerified = async ({ to, name, equipmentName, verified }) => {
  const html = wrapHtml(`
    <p>Hi <strong>${name}</strong>,</p>
    <p>Your payment for <strong>${equipmentName}</strong> has been
       ${verified ? '<span class="badge-green">Verified</span>. Your booking is now approved.' : '<span class="badge-red">Not Verified</span>. Please resubmit your payment proof.'}</p>
    <a class="btn" href="${LAB_URL}/dashboard/fees">View Fees</a>
  `)
  await transporter.sendMail({
    from: FROM, to,
    subject: `Payment ${verified ? 'Verified' : 'Not Verified'} — ${equipmentName}`,
    html,
  })
}

// ── Safe wrapper: don't let email failures break API calls ─────
const safeSend = (fn) => async (data) => {
  try {
    await fn(data)
  } catch (err) {
    console.warn('[EmailService] Failed to send email:', err.message)
  }
}

module.exports = {
  sendBookingApproved:     safeSend(sendBookingApproved),
  sendBookingRejected:     safeSend(sendBookingRejected),
  sendWelcomeEmail:        safeSend(sendWelcomeEmail),
  sendConsultationUpdate:  safeSend(sendConsultationUpdate),
  sendPaymentVerified:     safeSend(sendPaymentVerified),
}