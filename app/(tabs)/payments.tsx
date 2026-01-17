// PaymentScreen.tsx
import md5 from "crypto-js/md5";
import React, { useMemo } from "react";
import { ActivityIndicator, View } from "react-native";
import { WebView } from "react-native-webview";

// Sandbox endpoint
const PAYHERE_SANDBOX_URL = "https://sandbox.payhere.lk/pay/checkout";

// Your sandbox credentials
const MERCHANT_ID = "1231840";
const MERCHANT_SECRET ="MTgwNTg4MDc3MTAxNzMyOTIyNTIzNTgwNTY1ODMzNDU4MDg2MTA1";

// Format amount to two decimals
const formatAmount = (value: number) => Number(value).toFixed(2);

// Generate MD5 hash
const generateHash = ({
  merchantId,
  orderId,
  amount,
  currency,
  merchantSecret,
}: {
  merchantId: string;
  orderId: string;
  amount: string;
  currency: string;
  merchantSecret: string;
}) => {
  const raw = merchantId + orderId + amount + currency + merchantSecret;
  return md5(raw).toString();
};

const PaymentScreen = () => {
  // Demo order details
  const orderId = "ORDER_1001"; // must be unique per request
  const amount = formatAmount(1500); // "1500.00"
  const currency = "LKR";

  const hash = useMemo(
    () =>
      generateHash({
        merchantId: MERCHANT_ID,
        orderId,
        amount,
        currency,
        merchantSecret: MERCHANT_SECRET,
      }),
    [orderId, amount, currency]
  );

  // Build form body
  const body = useMemo(() => {
    const params = new URLSearchParams();

    params.append("merchant_id", MERCHANT_ID);
    params.append("return_url", "https://example.com/return");
    params.append("cancel_url", "https://example.com/cancel");
    params.append("notify_url", "https://example.com/notify");

    params.append("order_id", orderId);
    params.append("items", "Premium Plan");
    params.append("amount", amount);
    params.append("currency", currency);
    params.append("hash", hash);

    // Customer details
    params.append("first_name", "Charitha");
    params.append("last_name", "Dev");
    params.append("email", "charitha@example.com");
    params.append("phone", "0771234567");
    params.append("address", "123 Test Street");
    params.append("city", "Colombo");
    params.append("country", "Sri Lanka");

    return params.toString();
  }, [orderId, amount, currency, hash]);

  // Handle navigation (optional)
  const onNavigationStateChange = (navState: any) => {
    const { url } = navState;
    if (url.startsWith("https://example.com/return")) {
      console.log("✅ Payment success/return");
    }
    if (url.startsWith("https://example.com/cancel")) {
      console.log("❌ Payment cancelled");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={{
          uri: PAYHERE_SANDBOX_URL,
          method: "POST",
          body,
        }}
        startInLoadingState
        renderLoading={() => (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <ActivityIndicator />
          </View>
        )}
        onNavigationStateChange={onNavigationStateChange}
        javaScriptEnabled
        domStorageEnabled
      />
    </View>
  );
};

export default PaymentScreen;
