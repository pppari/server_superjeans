require('dotenv').config();
const dayjs = require('dayjs');
const nodemailer = require('nodemailer')

const { EMAIL_USER, EMAIL_PASS, SERVER_URL, CLIENT_URL, ADMIN_URL, SHOP_EMAIL } = process.env

function dateFormat(isoString) {
  return dayjs(isoString).format('DD/MM/YYYY, HH:mm A');
}

const createTransporter = () => {
  return nodemailer.createTransport({
    host: "smtp.gmail.com", // Corrected Gmail SMTP host
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
    pool: true, // Enable connection pooling
    maxConnections: 10, // Adjust based on your server's capacity
  });
};

const sendVerificationEmail = async (token, email) => {
  const transporter = createTransporter()

  const verificationUrl = `${SERVER_URL}/api/auth/verify?token=${token}`

  const mailOptions = {
    from: {
      name: "Super Jeans Furniture",
      address: EMAIL_USER,
    },
    to: email,
    subject: 'ยืนยันอีเมลเพื่อเข้าใช้งาน Super Jeans Furniture',
    html: `
       <h2>ยินดีต้อนรับสู่ Super Jeans Furniture</h2>
<p>กดปุ่มด้านล่างเพื่อยืนยันบัญชีของคุณ</p>
<a href="${verificationUrl}" style="padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">ยืนยันอีเมล</a>
<p>ถ้าคุณไม่ได้เป็นคนขอสมัคร สามารถไม่สนใจอีเมลนี้ได้เลย</p>
      `,
  }

  transporter.sendMail(mailOptions)
}

const sendResetRequest = async (token, email) => {
  const transporter = createTransporter()

  const verificationUrl = `${CLIENT_URL}/reset?token=${token}`

  const mailOptions = {
    from: {
      name: "Super Jeans Furniture",
      address: EMAIL_USER,
    },
    to: email,
    subject: 'รีเซ็ตรหัสผ่าน Super Jeans Furniture',
    html: `
       <h2>รีเซ็ตรหัสผ่าน Super Jeans Furniture</h2>
<p>กดปุ่มด้านล่างเพื่อรีเซ็ตรหัสผ่าน</p>
<a href="${verificationUrl}" style="padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">รีเซ็ตรหัสผ่าน</a>
<p>ถ้าคุณไม่ได้เป็นคนดำเนินการ สามารถไม่สนใจอีเมลนี้ได้เลย</p>
      `,
  }

  transporter.sendMail(mailOptions)
}
const sendAdminResetRequest = async (token, email) => {
  const transporter = createTransporter()

  const verificationUrl = `${ADMIN_URL}/reset?token=${token}`

  const mailOptions = {
    from: {
      name: "Super Jeans Admin",
      address: EMAIL_USER,
    },
    to: email,
    subject: 'รีเซ็ตรหัสผ่าน Super Jeans Admin',
    html: `
       <h2>รีเซ็ตรหัสผ่าน Super Jeans Admin</h2>
<p>กดปุ่มด้านล่างเพื่อรีเซ็ตรหัสผ่าน</p>
<a href="${verificationUrl}" style="padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">รีเซ็ตรหัสผ่าน</a>
<p>ถ้าคุณไม่ได้เป็นคนดำเนินการ สามารถไม่สนใจอีเมลนี้ได้เลย</p>
      `,
  }

  transporter.sendMail(mailOptions)
}

const sendOrderNotify = async (orderId) => {
  const transporter = createTransporter()

  const verificationUrl = `${ADMIN_URL}/order?oid=${orderId}`

  const mailOptions = {
    from: {
      name: "Super Jeans Admin",
      address: EMAIL_USER,
    },
    to: SHOP_EMAIL,
    subject: 'มีออเดอร์ใหม่',
    html: `
       <h2>มีออเดอร์ใหม่ รหัส ${orderId}</h2>
<p>กดปุ่มด้านล่างเพื่อไปที่ออเดอร์</p>
<a href="${verificationUrl}" style="padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">ไปที่ออเดอร์</a>
      `,
  }

  transporter.sendMail(mailOptions)
}

const sendBillingEmail = async (orderId, userEmail, orderDetails) => {
  const transporter = createTransporter()

  const orderUrl = `${CLIENT_URL}/account/orders/${orderId}`

  const mailOptions = {
    from: {
      name: "Super Jeans Furniture",
      address: EMAIL_USER,
    },
    to: userEmail,
    subject: 'ใบเสร็จรับเงิน Super Jeans Furniture',
    html: `
        <div style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; background-color: #f6f9fc;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2d3748; font-size: 24px; margin: 0;">Super Jeans Furniture</h1>
              <p style="color: #718096; font-size: 16px; margin-top: 8px;">ขอบคุณสำหรับการสั่งซื้อ</p>
              <p style="color: red; font-size: 12px; margin-top: 8px;">กรุณาไม่ตอบกลับอีเมลนี้ เนื่องจากเป็นข้อความจากระบบอัตโนมัติเท่านั้น</p>
            </div>
            
            <div style="background-color: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <div style="border-bottom: 1px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 20px;">
                <h2 style="color: #2d3748; font-size: 18px; margin: 0;">รายละเอียดคำสั่งซื้อ</h2>
                <p style="color: #718096; font-size: 14px; margin-top: 8px;">รหัสคำสั่งซื้อ: ${orderId}</p>
              </div>
              
              <div style="margin-bottom: 25px;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 12px 0; color: #718096;">ยอดรวมสินค้า</td>
                    <td style="padding: 12px 0; text-align: right; color: #2d3748;">฿${parseFloat(orderDetails.amount).toLocaleString()}</td>
                  </tr>
                  ${orderDetails.isDiscount ? `
                  <tr>
                    <td style="padding: 12px 0; color: #718096;">ส่วนลด</td>
                    <td style="padding: 12px 0; text-align: right; color: #f56565;">-฿${parseFloat(orderDetails.discount_amount).toLocaleString()}</td>
                  </tr>
                  ` : ''}
                  <tr>
                    <td style="padding: 12px 0; color: #718096;">ค่าธรรมเนียม</td>
                    <td style="padding: 12px 0; text-align: right; color: #2d3748;">฿${parseFloat(orderDetails.payment_fee).toLocaleString()}</td>
                  </tr>
                  <tr style="border-top: 2px solid #e2e8f0;">
                    <td style="padding: 12px 0; font-weight: bold; color: #2d3748;">ยอดรวมทั้งสิ้น</td>
                    <td style="padding: 12px 0; text-align: right; font-weight: bold; color: #2d3748;">฿${parseFloat(orderDetails.amount + orderDetails.payment_fee - (orderDetails.isDiscount ? orderDetails.discount_amount : 0)).toLocaleString()}</td>
                  </tr>
                </table>
              </div>
               <div style="margin-bottom: 25px;">
                <div style="background-color: #f8fafc; border-radius: 6px; padding: 15px;">
                  <p style="margin: 0; color: #718096;">วิธีการชำระเงิน</p>
                  <p style="margin: 5px 0 0; color: #2d3748; font-weight: 500;">${orderDetails.payment_method === "card" ? "บัตรเครดิต" : "พร้อมเพย์"}</p>
                </div>
              </div>
              
              <div style="background-color: #f0fff4; border-radius: 6px; padding: 15px; margin-bottom: 25px;">
                <p style="margin: 0; color: #2f855a;">สถานะคำสั่งซื้อ</p>
                <p style="margin: 5px 0 0; color: #2f855a; font-weight: 500;">${orderDetails.status}</p>
              </div>
             
            </div>
            <div style="display: flex; justify-content: space-center;">
            <a href=${orderUrl} style="padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
            ดูรายละเอียดคำสั่งซื้อ
            </a>
            </div>
          </div>
        </div>
    `,
  }

  await transporter.sendMail(mailOptions)
}

const orderUpdateNotify = async (orderId, userEmail, orderStatus) => {
  const transporter = createTransporter()

  const orderUrl = `${CLIENT_URL}/account/orders/${orderId}`

  const timeStamp = dateFormat(new Date());

  const mailOptions = {
    from: {
      name: "Super Jeans Furniture",
      address: EMAIL_USER,
    },
    to: userEmail,
    subject: 'แจ้งเตือนสถานะคำสั่งซื้อ',
    html: `
      <h2>สถานะคำสั่งซื้อ Super Jeans Furniture</h2>
      <p>คำสั่งซื้อของคุณอยู่ในสถานะ <span style="color: #2f855a;">${orderStatus}</span> แล้ว เมื่อ ${timeStamp}</p>
      <p>กดปุ่มด้านล่างเพื่อไปที่คำสั่งซื้อ</p>
      <a href="${orderUrl}" style="padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">ไปที่คำสั่งซื้อ</a>
    `,
  }

  await transporter.sendMail(mailOptions)
}

module.exports = {
  sendVerificationEmail,
  sendResetRequest,
  sendAdminResetRequest,
  sendOrderNotify,
  sendBillingEmail,
  orderUpdateNotify
}