import { StyleSheet } from "react-native";

export const COLORS = {
  primary: "#6a11cb",
  secondary: "#ff4ecd",
  white: "#fff",
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scroll: {
    flex: 1,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },

  backBtn: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 8,
    borderRadius: 20,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 12,
  },

  image: {
    width: "98%",
    height: 220,
    alignSelf: "center",
    borderRadius: 10,
    marginBottom: 16,
    resizeMode: "contain",
    backgroundColor: "#383636",
  },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    elevation: 3,
  },

  nama: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },

  infoText: {
    marginLeft: 8,
    color: "#555",
    fontSize: 14,
  },

  bottomRow: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#6a11cb",
  },

  ratingBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  rating: {
    marginLeft: 4,
    fontWeight: "600",
  },

  review: {
    marginLeft: 4,
    color: "#777",
    fontSize: 12,
  },

  descTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },

  desc: {
    color: "#555",
    lineHeight: 20,
  },

  bookBtn: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#0ae79a",
    padding: 16,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },

  bookText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
