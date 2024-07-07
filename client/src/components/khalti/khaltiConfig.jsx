import { NotificationManager } from "react-notifications";
import myKey from "./khaltiKey";
import axios from "axios";
let config = {
  publicKey: myKey.publicTestKey,
  productIdentity: "pID",
  productName: "Donation Tip",
  productUrl: "http://localhost:3000",
  eventHandler: {
    onSuccess(payload) {
      axios
        .post("http://localhost:5000/api/profile/transaction", {
          token: payload.token,
          amount: payload.amount,
          message: payload.message,
        })
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });

      // hit merchant api for initiating verfication
      console.log(payload);
      let data = {
        token: payload.token,
        amount: payload.amount,
        message: payload.message,
      };
      NotificationManager.success(payload.message, "Successful!", 2000);
    },
    onError(error) {
      NotificationManager.error("Payment has failed!", "Error!", 2000);
      console.log(error);
    },
    onClose() {
      console.log("widget is closing");
    },
  },
  paymentPreference: [
    "KHALTI",
    "EBANKING",
    "MOBILE_BANKING",
    "CONNECT_IPS",
    "SCT",
  ],
};

export default config;
