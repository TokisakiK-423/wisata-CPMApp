import { StyleSheet } from "react-native";

export const COLORS = {
  primary: "#7b2ff7",
  secondary: "#f107a3",
  white: "#fff",
  gray: "#9ca3af",
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
    paddingHorizontal: 12,
  },

  list: {
    paddingBottom: 100,
    paddingTop: 6,
  },

  tabBar: {
    backgroundColor: "#fff",
    borderTopWidth: 0,
    height: 70,
    paddingBottom: 8,
  },

  headerRight: {
    marginRight: 16,
  },

sectionTitle: {
  fontSize: 20,
  fontWeight: "bold",
  color: "#fff",
  marginBottom: 10,
  marginLeft: 4,
},

  cardHorizontal: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginBottom: 14,
    borderRadius: 16,
    overflow: "hidden",

    elevation: 4,
    borderWidth: 1,
    borderColor: "#eee",
  },

  imageHorizontal: {
    width: 150,
    height: 125,
  },

  contentHorizontal: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  namaHorizontal: {
    fontSize: 15,
    fontWeight: "bold",
    flex: 1,
    marginRight: 6,
  },

  price: {
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "right",
    color: "#6C5CE7",
  },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },

  desc: {
    fontSize: 12,
    color: "#666",
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },

  btn: {
    backgroundColor: "#6C5CE7",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },

  // ===== BOOKING =====
bookingTitle: {
  fontSize: 20,
  fontWeight: "bold",
  color: "#fff",
},

bookingSubtitle: {
  color: "#ddd",
  marginBottom: 12,
},

bookingCard: {
  backgroundColor: "#fff",
  padding: 14,
  borderRadius: 14,
  marginBottom: 12,
  elevation: 3,
},

bookingWisata: {
  fontSize: 16,
  fontWeight: "bold",
},

bookingNama: {
  fontSize: 14,
  color: "#666",
},

bookingDetail: {
  fontSize: 13,
  color: "#888",
  marginTop: 4,
},

bookingStatus: {
  alignSelf: "flex-start",
  marginTop: 8,
  paddingHorizontal: 10,
  paddingVertical: 4,
  borderRadius: 20,
},

bookingStatusText: {
  color: "#fff",
  fontSize: 11,
  fontWeight: "bold",
},

emptyContainer: {
  alignItems: "center",
  marginTop: 40,
},

emptyText: {
  color: "#fff",
},

loadingText: {
  marginTop: 10,
  color: "#fff",
},

// ===== REVIEW =====

reviewContainer: {
  flex: 1,
},

reviewContent: {
  padding: 16,
  paddingBottom: 120,
},

reviewTitle: {
  fontSize: 22,
  fontWeight: "bold",
  color: "#fff",
},

reviewHeader: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 10,
},

formBox: {
  backgroundColor: "rgba(255,255,255,0.15)",
  padding: 12,
  borderRadius: 14,
  marginBottom: 12,
},

wisataCard: {
  width: 120,
  marginRight: 10,
  borderRadius: 12,
  overflow: "hidden",
  backgroundColor: "#fff",
},

wisataImage: {
  width: "100%",
  height: 80,
},

wisataName: {
  padding: 6,
  fontSize: 12,
  fontWeight: "600",
},

wisataActive: {
  borderWidth: 3,
  borderColor: "#FFD700",
},

input: {
  backgroundColor: "#fff",
  padding: 10,
  borderRadius: 10,
  marginVertical: 10,
},

ratingRow1: {
  flexDirection: "row",
  marginBottom: 10,
},

star: {
  fontSize: 26,
  color: "#ccc",
  marginRight: 5,
},

starActive: {
  fontSize: 26,
  color: "#FFD700",
  marginRight: 5,
},

imageBtn: {
  backgroundColor: "#fff",
  padding: 10,
  borderRadius: 10,
  alignItems: "center",
  marginBottom: 10,
},

preview: {
  height: 120,
  borderRadius: 10,
  marginBottom: 10,
},

submitBtn: {
  backgroundColor: "#000",
  padding: 12,
  borderRadius: 10,
  alignItems: "center",
},

reviewCard: {
  backgroundColor: "#fff",
  padding: 14,
  borderRadius: 14,
  marginBottom: 12,
},

reviewTitleCard: {
  fontWeight: "bold",
  fontSize: 16,
},

ratingText: {
  color: "#FFD700",
  marginVertical: 4,
},

reviewName: {
  fontWeight: "600",
},

reviewComment: {
  color: "#555",
  marginTop: 4,
},

reviewImage: {
  height: 120,
  borderRadius: 10,
  marginTop: 8,
},

deleteBtn: {
  marginTop: 10,
  backgroundColor: "red",
  padding: 6,
  borderRadius: 6,
  alignItems: "center",
},
toggleBtn: {
  paddingHorizontal: 14,
  paddingVertical: 6,
  borderRadius: 20,
  elevation: 2, // android
  shadowColor: "#000", // ios
  shadowOpacity: 0.1,
  shadowRadius: 3,
  shadowOffset: { width: 0, height: 2 },
},

toggleOpen: {
  backgroundColor: "rgb(11, 206, 37)",
},

toggleClose: {
  backgroundColor: "#f50606",
},

toggleText: {
  fontSize: 12,
  fontWeight: "600",
},

toggleTextOpen: {
  color: "#fff",
},

toggleTextClose: {
  color: "#fbfafd",
},
});