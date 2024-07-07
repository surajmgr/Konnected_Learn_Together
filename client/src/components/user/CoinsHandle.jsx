import axios from "axios";
import KhaltiCheckout from "khalti-checkout-web";
import React from "react";
import { Store } from "react-notifications-component";

function CoinsHandle(props) {
  const { username, uid } = props;
  const [amount, setAmount] = React.useState(1000);

  let config = {
    publicKey: "test_public_key_0d4a87a28c164bc6ad0b5fc16cc29f7c",
    productIdentity: "pID",
    productName: "Donation Tip",
    productUrl: "http://localhost:3000",
    eventHandler: {
      async onSuccess(payload) {
        // hit merchant api for initiating verfication
        console.log(payload);
        let data = {
          token: payload.token,
          amount: payload.amount,
        };
        await updateBalance(data.amount / 100);
        await addNotifications(data.amount / 100);
        props.fetchProfile();
        Store.addNotification({
          title: "Success!",
          message: "Payment Successfull.",
          type: "success",
          insert: "top",
          container: "top-right",
          animationIn: ["animate__animated"],
          animationOut: ["animate__animated", "animate__fadeOut"],
          dismiss: {
            duration: 3000,
            onScreen: false,
          },
        });
      },
      onError(error) {
        Store.addNotification({
          title: "Error!",
          message: error.response.data,
          type: "danger",
          insert: "top",
          container: "top-right",
          animationIn: ["animate__animated"],
          animationOut: ["animate__animated", "animate__fadeOut"],
          dismiss: {
            duration: 3000,
            onScreen: false,
          },
        });
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
  let checkout = new KhaltiCheckout(config);

  const showPrompt = () => {
    let userInput = prompt("Enter the amount of coins you want to buy");
    userInput = parseInt(userInput);
    if (userInput && userInput > 0) {
      setAmount(userInput);
      checkout.show({ amount: userInput * 100 });
    } else {
      Store.addNotification({
        title: "Error!",
        message: "Please enter a valid amount.",
        type: "danger",
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
          duration: 3000,
          onScreen: false,
        },
      });
    }
  };

  const updateBalance = async (amount) => {
    const res = await axios.post(
      `${process.env.REACT_APP_API_BASE_URL}/profile/update-coins`,
      {
        uid,
        amount,
      },
      {
        withCredentials: true,
      }
    );
  };

  const addNotifications = async (amount) => {
    const res = await axios.post(
      `${process.env.REACT_APP_API_BASE_URL}/profile/notifications/add`,
      {
        uid: uid,
        message: `You topped up your balance with ${amount} coins.`,
        link: "#",
        read: "0",
      },
      {
        withCredentials: true,
      }
    );
  };

  return (
    <div
        onClick={showPrompt}
      className="mt-0 ml-3 bg-yellow-500 text-white px-[25px] py-[10px] rounded-lg cursor-pointer font-poppins"
    >
      Coins
    </div>
  );
}

export default CoinsHandle;
