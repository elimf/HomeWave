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
    backgroundColor: Colors.transparent,
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
    marginTop: 5,
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
};
