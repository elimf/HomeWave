import { Colors } from "./colors";
import { Spacing } from "./spacing";

export const GlobalStyles = {
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  inputContainer: {
    width: "80%",
  },
  input: {
    color: Colors.white,
    backgroundColor: "gray",
    paddingHorizontal: Spacing.medium,
    paddingVertical: Spacing.small,
    borderRadius: 10,
    marginTop: Spacing.small,
  },
  buttonContainer: {
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: Spacing.large,
  },
  button: {
    backgroundColor: Colors.primary,
    width: "100%",
    padding: Spacing.medium,
    borderRadius: 10,
    alignItems: "center",
    marginTop: Spacing.small,
  },
  buttonText: {
    color: Colors.white,
    fontWeight: "700",
    fontSize: 16,
  },
  link: {
    color: Colors.accent,
    fontWeight: "700",
    fontSize: 16,
    marginTop: Spacing.medium,
    textDecorationLine: "underline",
  },
  containerTopBar: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    width: "100%",
    padding: 10,
    backgroundColor: Colors.primary,
    top: 15,
    position: "absolute",
  },
  signOutButton: {
    padding: 10,
  },
  signOutButtonText: {
    color: "white",
    fontWeight: "700",
  },
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
    margin: Spacing.small,
    borderWidth: 1,
    padding: Spacing.small,
  },
  messageContainer: {
    marginBottom: 10,
    backgroundColor: "#eee",
  },
  dateText: {
    color: Colors.gray,
    fontSize: 12,
    marginBottom: Spacing.small,
  },
  textMessage: {
    color: Colors.gray,
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
};
