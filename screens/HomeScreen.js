import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Button, Modal } from "react-native";
import { GlobalStyles } from "../assets/style/globalStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import init from "react_native_mqtt";
import { auth } from "../firebase";
import { STATUS } from "../utils/status";
init({
  size: 10000,
  storageBackend: AsyncStorage,
  defaultExpires: 1000 * 3600 * 24,
  enableCache: true,
  reconnect: true,
  sync: {},
});

const MQTT_OPTIONS = {
  host: "mqtt-dashboard.com",
  port: 8884,
  path: "/example-topic",
  id: auth.currentUser
    ? auth.currentUser.uid
    : "id_" + parseInt(Math.random() * 100000),
};
// Create a client instance
const client = new Paho.MQTT.Client(
  MQTT_OPTIONS.host,
  MQTT_OPTIONS.port,
  MQTT_OPTIONS.path
);

const HomeScreen = () => {
  const [topic, setTopic] = useState("object");
  const [active, setActive] = useState(false);
  const [subscribedTopic, setSubscribedTopic] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [status, setStatus] = useState(STATUS.DISCONNECTED);

  useEffect(() => {
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;
  }, []);

  const onConnect = () => {
    console.log("onConnect");
    subscribeTopic();
    setStatus(STATUS.CONNECTED);
  };

  const onFailure = (err) => {
    console.log("Connect failed!");
    console.log(err);
    setStatus(STATUS.FAILED);
  };

  const connect = () => {
    setStatus(STATUS.FETCHING);
    client.connect({
      onSuccess: onConnect,
      useSSL: true,
      timeout: 5,
      onFailure: onFailure,
    });
  };

  const onConnectionLost = (responseObject) => {
    if (responseObject.errorCode !== 0) {
      console.log("onConnectionLost:" + responseObject.errorMessage);
    }
    setStatus(STATUS.DISCONNECTED);
  };

  const onMessageArrived = (message) => {
    const content = message.payloadString;
    if (content === "Code envoyé correcte !") {
      setActive(true);
    }
    if (content === "ACTIVE") {
      return;
    }
    const newMessage = {
      id: Math.random().toString(36).substr(2, 9), 
      content: content,
      date: new Date().toLocaleString(),
    };
    if (content === "Mouvement détecté !") {
      setModalVisible(true);
    }
    setMessageList((prevMessageList) => [newMessage, ...prevMessageList]);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const subscribeTopic = () => {
    setSubscribedTopic(topic);
    client.subscribe(topic, { qos: 1 });
  };
  const sendMessageToActive = () => {
    setActive(false);
    const newMessage = new Paho.MQTT.Message("ACTIVE");
    newMessage.destinationName = subscribedTopic;
    client.send(newMessage);
  };

  const renderContent = () => {
    switch (status) {
      case STATUS.CONNECTED:
        return (
          <View>
            <View style={{ marginBottom: 30, alignItems: "center" }}>
              {active ? (
                <Button
                  type="solid"
                  title="Activer l'alarme"
                  onPress={sendMessageToActive}
                  buttonStyle={{
                    marginBottom: 50,
                    backgroundColor:
                      status === STATUS.FAILED ? "red" : "#397af8",
                  }}
                />
              ) : (
                <></>
              )}
              <Text style={GlobalStyles.titleText}>Donnée en temps réel</Text>
            </View>
          </View>
        );
      case STATUS.DISCONNECTED:
        return (
          <Button
            type="solid"
            title="Connect to my device"
            onPress={connect}
            buttonStyle={{
              marginBottom: 50,
              backgroundColor: status === STATUS.FAILED ? "red" : "#397af8",
            }}
            loading={status === STATUS.FETCHING}
            disabled={status === STATUS.FETCHING}
          />
        );
      default:
        return null;
    }
  };

  const renderRow = ({ item }) => {
    return (
      <View style={GlobalStyles.messageContainer}>
        <Text style={GlobalStyles.dateText}>{item.date}</Text>
        <Text style={GlobalStyles.textMessage}>{item.content}</Text>
      </View>
    );
  };

  return (
    <View style={GlobalStyles.container}>
      <Modal
        animationType="slide"
        transparent={false}
        visible={isModalVisible}
        onRequestClose={closeModal}
      >
        <View style={GlobalStyles.modalContainer}>
          <Text style={GlobalStyles.modalText}>
            Attention une présence a été détectée chez vous{" "}
          </Text>
          <Button title="Retour" onPress={closeModal} />
        </View>
      </Modal>
      {renderContent()}
      <View style={GlobalStyles.messageBox}>
        <FlatList
          data={messageList}
          renderItem={renderRow}
          keyExtractor={(item) => item.id}
        />
      </View>
    </View>
  );
};
export default HomeScreen;
