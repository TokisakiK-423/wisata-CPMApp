import { StyleSheet } from "react-native";

export const COLORS = {
  primary: "#7b2ff7",
  secondary: "#f107a3",
  white: "#ffffff",
  gray: "#f5f5f5",
  text: "#333",
  danger: "#ef4444",
  success: "#22c55e",
  warning: "#f59e0b",
};

export const styles = StyleSheet.create({
  // 🔥 BACKGROUND GLOBAL
  background: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },

  container: {
    flex: 1,
    padding: 16,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.white,
    marginBottom: 10,
  },

  card: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },

  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },

  nama: {
    fontWeight: "bold",
    fontSize: 16,
    color: COLORS.text,
  },

  detail: {
    marginTop: 6,
    backgroundColor: COLORS.gray,
    padding: 8,
    borderRadius: 8,
  },

  row: {
    flexDirection: "row",
    marginTop: 8,
    gap: 10,
  },

  statusBtn: {
    padding: 6,
    borderRadius: 6,
  },

  deleteBtn: {
    backgroundColor: COLORS.danger,
    padding: 6,
    borderRadius: 6,
  },

  btnText: {
    color: COLORS.white,
  },

  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#000",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },

  fabText: {
    color: COLORS.white,
    fontSize: 30,
  },

  tabBar: {
    backgroundColor: "#fff",
    height: 70,
    borderTopWidth: 0,
  },

  headerRight: {
    marginRight: 16,
  },
  bookingContainer: {
  flex: 1,
  padding: 16,
},

bookingTitle: {
  fontSize: 22,
  fontWeight: 'bold',
  color: '#fff',
  marginBottom: 12,
},

bookingCard: {
  backgroundColor: '#fff',
  padding: 14,
  borderRadius: 12,
  marginBottom: 10,
},

bookingName: {
  fontWeight: 'bold',
  fontSize: 16,
  marginBottom: 4,
},

bookingStatus: {
  marginTop: 6,
  fontWeight: 'bold',
},

bookingActions: {
  flexDirection: 'row',
  marginTop: 10,
  gap: 8,
},

bookingBtn: {
  padding: 8,
  borderRadius: 6,
},

bookingBtnText: {
  color: '#fff',
  fontSize: 12,
},
  reviewContainer: {
  flex: 1,
  padding: 16,
},

reviewTitle: {
  fontSize: 22,
  fontWeight: 'bold',
  color: '#fff',
  marginBottom: 10,
},

reviewCard: {
  backgroundColor: '#fff',
  padding: 14,
  borderRadius: 12,
  marginBottom: 12,
},

reviewWisata: {
  fontSize: 16,
  fontWeight: 'bold',
},

reviewRating: {
  color: '#FFD700',
  marginVertical: 4,
},

reviewNama: {
  fontWeight: '600',
},

reviewKomentar: {
  color: '#555',
  marginTop: 4,
},

reviewImage: {
  height: 140,
  marginTop: 10,
  borderRadius: 10,
},
});
