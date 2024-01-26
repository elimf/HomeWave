import { useNavigation } from "@react-navigation/core";
import React, { useState } from "react";
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
import { GlobalStyles } from "../assets/style/globalStyles";

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      await validationSchema.validate({ email, password });
      const userCredentials = await firebaseAuth.signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredentials.user;
      if (user.emailVerified == false) {
        Alert.alert("Error", "Please verify your email");
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: "Home" }],
        });
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };
  const navigateToRegister = () => {
    navigation.navigate("Register");
  };

  return (
    <KeyboardAvoidingView style={GlobalStyles.container} behavior="padding">
      <Text style={GlobalStyles.buttonText}>Login</Text>
      <View style={GlobalStyles.inputContainer}>
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
        <TouchableOpacity onPress={handleLogin} style={GlobalStyles.button}>
          <Text style={GlobalStyles.buttonText}>Connexion</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={navigateToRegister}>
          <Text style={GlobalStyles.link}>Go to Register</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
