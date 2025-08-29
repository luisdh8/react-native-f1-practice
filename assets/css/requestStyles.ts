import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  listContent: {
    paddingVertical: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginRight: 12,
    backgroundColor: "#eee",
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 2,
  },
  meta: {
    fontSize: 14,
  },
  separator: {
    height: 1,
    backgroundColor: "#ddd",
  },
});
