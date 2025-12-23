import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import WebView from 'react-native-webview';

const TestWebView = () => {
  const [showWebView, setShowWebView] = useState(false);

  const handleTestPost = () => {
    
    const htmlForm = `
      <html>
        <body onload="document.forms[0].submit()">
          <form method="post" action="http://192.168.8.200:5001/test">
            <input type="hidden" name="merchant_id" value="1231840" />
            <input type="hidden" name="order_id" value="TEST123" />
            <input type="hidden" name="amount" value="1000.00" />
            <input type="hidden" name="currency" value="LKR" />
            <input type="hidden" name="items" value="Test Item" />
          </form>
        </body>
      </html>
    `;
    setShowWebView(htmlForm);
  };

  const handleTestEndpoint2 = ()=>{
   fetch("http://192.168.8.200:5001/test", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key: "value" }) })

  // fetch('http://192.168.8.200:5001/return')

  }

  return (
    <SafeAreaView style={styles.container}>
       <TouchableOpacity style={styles.button} onPress={handleTestEndpoint2}>
          <Text style={styles.buttonText}>Send POST to localhost</Text>

        </TouchableOpacity>
      {showWebView ? (
        <WebView source={{ html: showWebView }} style={{ flex: 1 }} />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleTestPost}>
          <Text style={styles.buttonText}>Send POST to localhost:3000</Text>
        </TouchableOpacity>
      )}

    
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  button: {
    backgroundColor: '#4A90E2',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  buttonText: { color: '#FFF', fontSize: 16, textAlign: 'center' },
});

export default TestWebView;
