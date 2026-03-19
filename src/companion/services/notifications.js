// ═══════════════════════════════════════════════════════════════════
// Notification services — SMS (via email gateway) and Web Push
// ═══════════════════════════════════════════════════════════════════

const nodemailer = require('nodemailer');
const webpush = require('web-push');

const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';

/**
 * Send an SMS via email-to-SMS gateway (e.g. 5551234567@vtext.com).
 *
 * @param {string} to - Phone number (digits only)
 * @param {string} carrier - SMS gateway domain (e.g. "vtext.com")
 * @param {string} message - Message body
 */
async function sendSms(to, carrier, message) {
  if (!to || !carrier) return;
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
  await transporter.sendMail({
    from: `"Media Manager" <${SMTP_USER}>`,
    to: `${to}@${carrier}`,
    subject: '',
    text: message,
  });
  console.log(`[sms] Sent to ${to}@${carrier}`);
}

/**
 * Send a web push notification.
 *
 * @param {Object} subscription - PushSubscription object from client
 * @param {string} title - Notification title
 * @param {string} body - Notification body
 * @param {Object} [extra] - Additional payload fields (icon, badge, tag)
 * @returns {Promise<void>}
 */
async function sendPushNotification(subscription, title, body, extra) {
  const payload = {
    title,
    body,
    icon: '/companion/icon-192.png',
    badge: '/companion/icon-192.png',
    ...extra,
  };
  const options = {
    urgency: 'high',
    headers: {
      'apns-priority': '10',
      'apns-push-type': 'alert',
      'interruption-level': 'time-sensitive',
    },
  };
  await webpush.sendNotification(subscription, JSON.stringify(payload), options);
}

module.exports = { sendSms, sendPushNotification };
