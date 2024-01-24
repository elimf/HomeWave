import React, { useLayoutEffect, useEffect, useState } from "react";
import { View, Button, Text } from "react-native";
import { useNavigation } from "@react-navigation/core";
import { GlobalStyles } from "../assets/style/globalStyles";
import { auth } from "../firebase";
import mqtt from "mqtt";

const HomeScreen = () => {
  const [receivedMessage, setReceivedMessage] = useState("");

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          onPress={handleSignOut}
          title="Sign Out"
          color="#007BFF" 
        />
      ),
    });
  }, [navigation]);

  const generateClientId = () => {
    return `client-${Date.now()}`;
  };

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace("Login");
      })
      .catch((error) => alert(error.message));
  };

  const handleSendDataOverMQTT = () => {
    const uniqueClientId = generateClientId();
    const client = mqtt.connect("mqtt://broker.hivemq.com", {
      clientId: uniqueClientId,
    });

    client.on("connect", function () {
      console.log("Connected to MQTT broker");

      // Subscribe to a topic
      client.subscribe("your-topic", function (err) {
        if (!err) {
          // Publish a message
          client.publish("your-topic", "your-payload");
        }
      });
    });

    client.on("message", function (topic, message) {
      console.log("Received message:", message.toString());
      setReceivedMessage(message.toString());
    });

    // Disconnect from MQTT broker
    client.end();
  };

  useEffect(() => {
    const client = mqtt.connect("mqtt://test.mosquitto.org:1883", {
      clientId: "your_client_id",
    });

    client.on("connect", function () {
      console.log("connected");

      // Subscribe to a topic
      client.subscribe("/data", function (err) {
        if (!err) {
          // Publish a message
          client.publish("/data", "test");
        }
      });
    });

    client.on("message", function (topic, message) {
      console.log("Received message:", message.toString());
      setReceivedMessage(message.toString());
    });

    return () => {
      // Clean up the MQTT client on component unmount
      client.end();
    };
  }, []);

  return (
    <View style={GlobalStyles.container}>
      <Text style={GlobalStyles.buttonText}>
        Welcome {auth.currentUser?.displayName}
      </Text>
      <Button
        title="Send Data Over MQTT"
        onPress={handleSendDataOverMQTT}
        color="#007BFF"
      />
      <Text style={GlobalStyles.buttonText}>
        Received Message: {receivedMessage}
      </Text>
    </View>
  );
};

export default HomeScreen;
