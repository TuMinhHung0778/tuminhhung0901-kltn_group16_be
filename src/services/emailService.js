require("dotenv").config();
const nodemailer = require("nodemailer");

let sendSimpleEmail = async (dataSend) => {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_APP, // generated ethereal user
      pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"HealthCare 🥼 "lethanhloi2001@gmail.com"', // sender address
    to: dataSend.reciverEmail, // list of receivers
    subject: "Thông tin đặt lịch khám bệnh", // Subject line
    html: getBodyHTMLEMAIL(dataSend),
  });
};

let getBodyHTMLEMAIL = (dataSend) => {
  let result = "";
  if (dataSend.language === "vi") {
    result = `
        <h3>Xin chào ${dataSend.patientName}</h3>
        <p>Xin cảm ơn bạn đã đặt lịch khám tại HealthCare.</p>
        <p>Thông tin đặt lịch khám bệnh:</p>
        <div><b>Thời gian: ${dataSend.time}</b></div>
        <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>

        <p>Nếu các thông tin trên là đúng sự thật vui lòng click vào đường link bên dưới
        để xác nhận và hoàn tất thủ tục đặt lịch khám bệnh.</p>
        <div>
        <a href=${dataSend.redirectLink} target="_blank">Click here!</a>
        </div>

        <div>Xin chân thành cảm ơn quý khách đã sử dụng dịch vụ tại HealthCare!</div>
        `;
  }
  if (dataSend.language === "en") {
    result = `
        <h3>Dear ${dataSend.patientName}</h3>
        <p>Thank you for booking an appointment at HealthCare.</p>
        <p>Information to schedule an appointment:</p>
        <div><b>Time: ${dataSend.time}</b></div>
        <div><b>Doctor: ${dataSend.doctorName}</b></div>

        <p>If the above information is true, please click on the link below to confirm and complete the procedure to book an appointment.</p>
        <div>
        <a href=${dataSend.redirectLink} target="_blank">Click here!</a>
        </div>

        <div>Thank you very much for using the service at HealthCare!</div>
        `;
  }

  return result;
};

// async..await is not allowed in global scope, must use a wrapper
async function main() {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();
}

let getBodyHTMLEMAILRemedy = (dataSend) => {
  let result = "";
  if (dataSend.language === "vi") {
    result = `
        <h3>Xin chào ${dataSend.patientName}!</h3>
        <p>Xin cảm ơn bạn đã đặt lịch khám tại HealthCare.</p>
        <p>Thông tin đơn thuốc và hóa đơn được gửi trong file đính kèm bênh dưới.</p>
        <div>Xin chân thành cảm ơn quý khách đã sử dụng dịch vụ tại HealthCare!</div>
        `;
  }
  if (dataSend.language === "en") {
    result = `
        <h3>Dear ${dataSend.patientName}!</h3>
        <p>Thank you for booking an appointment at HealthCare.</p>
        <p>Prescription information and invoices are sent in the attached file!</p>
        <div>Thank you very much for using the service at HealthCare!</div>
        `;
  }

  return result;
};

let sendAttachment = async (dataSend) => {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_APP, // generated ethereal user
      pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"HealthCare 🥼 "lethanhloi22042001@gmail.com"', // sender address
    to: dataSend.email, // list of receivers
    subject: "Kết quả đặt lịch khám bệnh", // Subject line
    html: getBodyHTMLEMAILRemedy(dataSend),
    attachments: [
      {
        filename: `healthcare-remedy-${
          dataSend.patientId
        }-${new Date().getTime()}.png`,
        content: dataSend.imgBase64.split("base64,")[1],
        encoding: "base64",
      },
    ],
  });
};

module.exports = {
  sendSimpleEmail: sendSimpleEmail,
  sendAttachment: sendAttachment,
};
