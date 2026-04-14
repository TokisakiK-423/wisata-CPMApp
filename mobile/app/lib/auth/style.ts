import { StyleSheet } from "react-native";

export const COLORS = {
  primary: "#7b2ff7",
  secondary: "#f107a3",
  white: "#fff",
  gray: "#ccc",
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },

  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },

  subtitle: {
    color: "#eee",
    textAlign: "center",
    marginBottom: 40,
    marginTop: 6,
  },

  formBox: {
    backgroundColor: "rgba(255,255,255,0.15)",
    padding: 20,
    borderRadius: 20,
  },

  input: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 14,
    fontSize: 16,
  },

  button: {
    backgroundColor: "#000",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  demo: {
    marginTop: 20,
    textAlign: "center",
    color: "#eee",
    fontSize: 13,
  },

  secondaryButton: {
  marginTop: 12,
  padding: 12,
  borderRadius: 12,
  alignItems: "center",
  borderWidth: 1,
  borderColor: "#fff",
},

secondaryText: {
  color: "#fff",
  fontWeight: "600",
},
});