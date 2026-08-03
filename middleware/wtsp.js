// const axios = require("axios");

// const API_URL = "PASTE_WACLUB_SEND_MESSAGE_API_URL_HERE";
// const API_KEY = "YOUR_API_KEY";
// const INSTANCE_ID = "YOUR_INSTANCE_ID";
// const TOKEN = "YOUR_TOKEN";
// const DEVICE_ID = "YOUR_DEVICE_ID";

// async function sendWhatsApp(phone, message) {
//   try {
//     const response = await axios.post(
//       API_URL,
//       {
//         instanceId: INSTANCE_ID,
//         deviceId: DEVICE_ID,
//         token: TOKEN,
//         phone: phone,
//         message: message,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${API_KEY}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     console.log("WhatsApp Sent:", response.data);
//     return response.data;
//   } catch (error) {
//     console.log(
//       "WhatsApp Error:",
//       error.response?.data || error.message
//     );
//     throw error;
//   }
// }

// module.exports = sendWhatsApp;const axios = require("axios");

// const API_URL = "https://waapi.waclub.in/api/v1/?action=send";
// const API_KEY = "YOUR_API_KEY";
// const INSTANCE_ID = "YOUR_INSTANCE_ID";
// const TOKEN = "92c33911-6b79-4fd1-903c-7889d18d6919";
// const DEVICE_ID = "YOUR_DEVICE_ID";

// async function sendWhatsApp(phone, message) {
//   try {
//     const response = await axios.post(
//       API_URL,
//       {
//         instanceId: INSTANCE_ID,
//         deviceId: DEVICE_ID,
//         token: TOKEN,
//         phone: phone,
//         message: message,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${API_KEY}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     console.log("WhatsApp Sent:", response.data);
//     return response.data;
//   } catch (error) {
//     console.log(
//       "WhatsApp Error:",
//       error.response?.data || error.message
//     );
//     throw error;
//   }
// }

// module.exports = sendWhatsApp;