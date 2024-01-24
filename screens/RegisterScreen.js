import { useNavigation } from "@react-navigation/core";
import React, { useState } from "react";
import { GlobalStyles } from "../assets/style/globalStyles";
import {
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { auth, firebaseAuth } from "../firebase";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const handleSignUp = async () => {
    try {
      await validationSchema.validate({ email, password, name });
      const userCredential = await firebaseAuth.createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      firebaseAuth.updateProfile(userCredential.user, {
        displayName: name,
      });
      await firebaseAuth.sendEmailVerification(userCredential.user);
      navigation.replace("Login");
    } catch (error) {
      console.log("error", error);
      Alert.alert("Error", error.message);
    }
  };
  const navigateToLogin = () => {
    navigation.navigate("Login"); // "Login" est le nom de la route de votre page de connexion
  };

  return (
    <KeyboardAvoidingView style={GlobalStyles.container} behavior="padding">
      <Text style={GlobalStyles.buttonText}>Register</Text>
      <View style={GlobalStyles.inputContainer}>
        <TextInput
          placeholder="Name"
          placeholderTextColor={"white"}
          value={name}
          onChangeText={(text) => setName(text)}
          style={GlobalStyles.input}
        />
        <TextInput
          placeholder="Email"
          placeholderTextColor={"white"}
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={GlobalStyles.input}
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor={"white"}
          value={password}
          onChangeText={(text) => setPassword(text)}
          style={GlobalStyles.input}
          secureTextEntry
        />
      </View>

      <View style={GlobalStyles.buttonContainer}>
        <TouchableOpacity onPress={handleSignUp} style={GlobalStyles.button}>
          <Text style={GlobalStyles.buttonText}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={navigateToLogin}>
          <Text style={GlobalStyles.link}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
