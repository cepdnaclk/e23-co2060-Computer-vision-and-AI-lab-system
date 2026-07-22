const nodemailer = require("nodemailer");

// Email service using nodemailer
// Configure with your email provider (Gmail, Outlook, etc.)

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD, // Use app-specific password for Gmail
    },
});

// Test connection
transporter.verify((error, success) => {
    if (error) {
        console.log("Email service error:", error.message);
    } else {
        console.log("Email service ready:", success);
    }
});

// Portal URL from environment or default
const portalUrl = process.env.PORTAL_URL || "http://localhost:5173";

// ── Send Registration Confirmation Email ─────────────
const sendRegistrationEmail = async (email, name, role) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Welcome to CV & AI Laboratory Portal",
            html: `
                <div style="font-family: Arial, sans-serif; color: #333;">
                    <h2 style="color: #1a3a52;">Welcome, ${name}!</h2>
                    <p>Your account has been successfully created on the <strong>CV & AI Laboratory Management System</strong>.</p>
                    
                    <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p><strong>Account Details:</strong></p>
                        <p>Email: ${email}</p>
                        <p>Role: ${role.charAt(0).toUpperCase() + role.slice(1)}</p>
                        <p>Institution: University of Peradeniya</p>
                    </div>
                    
                    <p>You can now log in to the portal using your credentials at:</p>
                    <p><a href="${portalUrl}" style="color: #c4a747; text-decoration: none; font-weight: bold;">CV & AI Lab Portal</a></p>
                    
                    <p><strong>Next Steps:</strong></p>
                    <ul>
                        <li>Complete your profile</li>
                        <li>Book equipment or GPU resources</li>
                        <li>Schedule consultations with advisors</li>
                        <li>View your reservations and approvals</li>
                    </ul>
                    
                    <p style="color: #999; font-size: 12px; margin-top: 30px;">
                        If you did not create this account, please contact itsupport@pdn.ac.lk
                    </p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`✓ Registration email sent to ${email}`);
        return true;
    } catch (error) {
        console.error("Failed to send registration email:", error);
        return false;
    }
};

// ── Send Booking Confirmation Email ──────────────────
const sendBookingConfirmationEmail = async (email, name, booking) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Booking Request Submitted - Awaiting Approval",
            html: `
                <div style="font-family: Arial, sans-serif; color: #333;">
                    <h2 style="color: #1a3a52;">Booking Request Received</h2>
                    <p>Hi ${name},</p>
                    <p>Your booking request has been successfully submitted and is now awaiting admin approval.</p>
                    
                    <div style="background: #fffbeb; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #f59e0b;">
                        <p><strong>Booking Details:</strong></p>
                        <p><strong>Request Type:</strong> ${booking.requestType}</p>
                        <p><strong>Resource:</strong> ${booking.resource}</p>
                        <p><strong>Date:</strong> ${booking.date}</p>
                        <p><strong>Time Slot:</strong> ${booking.time}</p>
                        <p><strong>Purpose:</strong> ${booking.purpose || "Not specified"}</p>
                    </div>
                    
                    <p><strong>Current Status:</strong> <span style="color: #f59e0b; font-weight: bold;">Pending</span></p>
                    <p>You will receive another email notification once your booking is approved or rejected.</p>
                    
                    <p>Track your booking status in the <a href="${portalUrl}" style="color: #c4a747; text-decoration: none; font-weight: bold;">Portal Dashboard</a></p>
                    
                    <p style="color: #999; font-size: 12px; margin-top: 30px;">
                        Questions? Contact: itsupport@pdn.ac.lk
                    </p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`✓ Booking confirmation email sent to ${email}`);
        return true;
    } catch (error) {
        console.error("Failed to send booking confirmation email:", error);
        return false;
    }
};

// ── Send Booking Status Update Email ─────────────────
const sendBookingStatusEmail = async (email, name, booking, status, feedbackNote = "") => {
    const statusColor = status === "Approved" ? "#10b981" : "#ef4444";
    const statusMessage = status === "Approved" 
        ? "Your booking request has been <strong style='color: #10b981;'>APPROVED</strong>"
        : "Your booking request has been <strong style='color: #ef4444;'>REJECTED</strong>";

    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `Booking ${status} - CV & AI Laboratory`,
            html: `
                <div style="font-family: Arial, sans-serif; color: #333;">
                    <h2 style="color: #1a3a52;">Booking Status Update</h2>
                    <p>Hi ${name},</p>
                    <p>${statusMessage}!</p>
                    
                    <div style="background: ${statusColor}18; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid ${statusColor};">
                        <p><strong>Booking Details:</strong></p>
                        <p><strong>Request Type:</strong> ${booking.requestType}</p>
                        <p><strong>Resource:</strong> ${booking.resource}</p>
                        <p><strong>Scheduled Date:</strong> ${booking.date}</p>
                        <p><strong>Time Slot:</strong> ${booking.time}</p>
                        ${feedbackNote ? `<p><strong>Admin Notes:</strong> ${feedbackNote}</p>` : ""}
                    </div>
                    
                    ${status === "Approved" ? `
                        <p><strong>Next Steps:</strong></p>
                        <ul>
                            <li>Equipment/resource will be ready for use at the scheduled time</li>
                            <li>Please arrive 5-10 minutes early</li>
                            <li>Contact lab staff if you need to reschedule</li>
                        </ul>
                    ` : `
                        <p>If you have questions about this decision, please contact the lab administration at itsupport@pdn.ac.lk</p>
                    `}
                    
                    <p>View your bookings in the <a href="${portalUrl}" style="color: #c4a747; text-decoration: none; font-weight: bold;">Portal Dashboard</a></p>
                    
                    <p style="color: #999; font-size: 12px; margin-top: 30px;">
                        CV & AI Laboratory • University of Peradeniya<br>
                        This is an automated email. Please do not reply.
                    </p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`✓ Booking status email (${status}) sent to ${email}`);
        return true;
    } catch (error) {
        console.error("Failed to send booking status email:", error);
        return false;
    }
};

// ── Send Admin Notification Email ────────────────────
const sendAdminNotificationEmail = async (adminEmail, message, data) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: adminEmail,
            subject: "Lab System Admin Notification",
            html: `
                <div style="font-family: Arial, sans-serif; color: #333;">
                    <h2 style="color: #1a3a52;">Admin Notification</h2>
                    <p>${message}</p>
                    
                    <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <pre style="font-size: 12px;">${JSON.stringify(data, null, 2)}</pre>
                    </div>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`✓ Admin notification email sent to ${adminEmail}`);
        return true;
    } catch (error) {
        console.error("Failed to send admin notification:", error);
        return false;
    }
};

// ── Send OTP Verification Email ──────────────────────
const sendOtpEmail = async (email, otp) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Your Registration Code - CV & AI Laboratory",
            html: `
                <div style="font-family: Arial, sans-serif; color: #333; max-width: 500px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px;">
                    <h2 style="color: #1a3a52; margin-top: 0;">Verify your email</h2>
                    <p>You recently requested to create an account on the CV & AI Laboratory Portal.</p>
                    <p>Enter the following 6-digit code to verify your identity and complete registration:</p>
                    
                    <div style="background: #f8fafc; padding: 20px; border-radius: 8px; text-align: center; margin: 24px 0; border: 1px solid #e2e8f0;">
                        <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #c4a747;">${otp}</span>
                    </div>
                    
                    <p style="font-size: 14px; color: #64748b;">This code will expire in 10 minutes.</p>
                    
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
                    <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                        If you did not request this code, you can safely ignore this email.<br>
                        CV & AI Laboratory • University of Peradeniya
                    </p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`✓ OTP email sent to ${email}`);
        return true;
    } catch (error) {
        console.error("Failed to send OTP email:", error);
        return false;
    }
};

// ── Send Password Reset OTP Email ────────────────────
const sendPasswordResetOtpEmail = async (email, otp) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Your Password Reset Code - CV & AI Laboratory",
            html: `
                <div style="font-family: Arial, sans-serif; color: #333; max-width: 500px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px;">
                    <h2 style="color: #1a3a52; margin-top: 0;">Reset your password</h2>
                    <p>You recently requested to reset your password for your CV & AI Laboratory Portal account.</p>
                    <p>Enter the following 6-digit code to verify your identity and set a new password:</p>
                    
                    <div style="background: #f8fafc; padding: 20px; border-radius: 8px; text-align: center; margin: 24px 0; border: 1px solid #e2e8f0;">
                        <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #c4a747;">${otp}</span>
                    </div>
                    
                    <p style="font-size: 14px; color: #64748b;">This code will expire in 10 minutes.</p>
                    
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
                    <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                        If you did not request a password reset, you can safely ignore this email — your password will remain unchanged.<br>
                        CV & AI Laboratory • University of Peradeniya
                    </p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`✓ Password reset OTP email sent to ${email}`);
        return true;
    } catch (error) {
        console.error("Failed to send password reset OTP email:", error);
        return false;
    }
};

module.exports = {
    sendRegistrationEmail,
    sendBookingConfirmationEmail,
    sendBookingStatusEmail,
    sendAdminNotificationEmail,
    sendOtpEmail,
    sendPasswordResetOtpEmail,
};
