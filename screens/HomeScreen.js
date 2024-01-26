import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Button,
  TextInput,
  Modal,
} from "react-native";
import { GlobalStyles } from "../assets/style/globalStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import init from "react_native_mqtt";
import { auth, db } from "../firebase";
init({
  size: 10000,
  storageBackend: AsyncStorage,
  defaultExpires: 1000 * 3600 * 24,
  enableCache: true,
  reconnect: true,
  sync: {},
});
const STATUS = {
  CONNECTED: "connected",
  FETCHING: "fetching",
  FAILED: "failed",
  DISCONNECTED: "disconnected",
};
const options = {
  host: "mqtt-dashboard.com",
  port: 8884,
  path: "/example-topic",
  id: auth.currentUser
    ? auth.currentUser.uid
    : "id_" + parseInt(Math.random() * 100000),
};
// Création d'une instance client
const client = new Paho.MQTT.Client(options.host, options.port, options.path);

const HomeScreen = () => {
  const [topic, setTopic] = useState("object");
  const [subscribedTopic, setSubscribedTopic] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [status, setStatus] = useState(STATUS.DISCONNECTED);

  useEffect(() => {
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;
  }, []);

  // Connexion réussie
  const onConnect = () => {
    console.log("onConnect");
    subscribeTopic();
    setStatus(STATUS.CONNECTED);
  };

  // Échec de la connexion
  const onFailure = (err) => {
    console.log("Connect failed!");
    console.log(err);
    setStatus(STATUS.FAILED);
  };

  // Connexion au serveur MQTT
  const connect = () => {
    setStatus(STATUS.FETCHING);
    client.connect({
      onSuccess: onConnect,
      useSSL: true,
      timeout: 5,
      onFailure: onFailure,
    });
  };

  // Perte de connexion
  const onConnectionLost = (responseObject) => {
    if (responseObject.errorCode !== 0) {
      console.log("onConnectionLost:" + responseObject.errorMessage);
    }
    setStatus(STATUS.DISCONNECTED);
  };

  // Réception d'un message
  const onMessageArrived = (message) => {
    // Create a new message object with a random id
    console.log("onMessageArrived:" + message.payloadString);

    const content = message.payloadString;

    // Skip adding the message if it starts with "Code"
    if (content.startsWith("code")) {
      return;
    }

    const newMessage = {
      id: Math.random().toString(36).substr(2, 9), // Generate a random id
      content: content,
      date: new Date().toLocaleString(),
    };

    if (content === "Mouvement détecté !") {
      setModalVisible(true);
    }

    // Use the functional update to append the new message to the existing list
    setMessageList((prevMessageList) => [newMessage, ...prevMessageList]);
  };

  const handleValidation = () => {
    if (inputValue.length == 0) {
      alert("Entrez le code");
    }
    if (inputValue) {
      closeModal();
      setInputValue("");
      const newMessage = new Paho.MQTT.Message("code:" + inputValue);
      newMessage.destinationName = subscribedTopic;
      client.send(newMessage);
    }
  };

  const closeModal = () => {
    // Close the modal when the user presses the close button
    setModalVisible(false);
  };

  // Souscription à un sujet
  const subscribeTopic = () => {
    setSubscribedTopic(topic);
    client.subscribe(topic, { qos: 1 });
  };

  const renderContent = () => {
    switch (status) {
      case STATUS.CONNECTED:
        return (
          <View>
            <View style={{ marginBottom: 30, alignItems: "center" }}>
              <Text style={GlobalStyles.titleText}>Data in Real Time</Text>
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
      <View style={styles.messageContainer}>
        <Text style={styles.dateText}>{item.date}</Text>
        <Text style={styles.textMessage}>{item.content}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={false}
        visible={isModalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>
            Attention une présence a été détecté chez vous{" "}
          </Text>
          <Text style={styles.modalText}>
            Entrez votre code si vous souhaitez désactivé
          </Text>

          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Entrez un numéro"
            value={inputValue}
            maxLength={4}
            onChangeText={(text) => setInputValue(text)}
          />

          <Button title="Valider" onPress={handleValidation} />
          <Button title="Retour" onPress={closeModal} />
        </View>
      </Modal>

      {renderContent()}
      <View style={styles.messageBox}>
        <FlatList
          data={messageList}
          renderItem={renderRow}
          keyExtractor={(item) => item.id}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 70,
  },
  messageBox: {
    margin: 16,
    flex: 1,
  },
  textInput: {
    height: 40,
    margin: 5,
    borderWidth: 1,
    padding: 5,
  },
  messageContainer: {
    marginBottom: 10,
    backgroundColor: "#eee",
  },
  dateText: {
    color: "#888",
    fontSize: 12,
    marginBottom: 5,
  },
  textMessage: {
    color: "gray",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
  },
});

export default HomeScreen;
