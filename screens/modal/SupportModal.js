import React, { useState } from "react";
import { View, Modal, TouchableOpacity, Text, Linking, StyleSheet, Image } from "react-native";

const SupportModal = ({ phoneNumber = "5561981304920" }) => {  

  const openWhatsApp = () => {
    const url = `https://wa.me/${phoneNumber}`;
    Linking.openURL(url).catch(() => alert("Não foi possível abrir o WhatsApp"));
  };

  return (
    <>
      {/* Botão flutuante do WhatsApp */}
      <TouchableOpacity style={styles.floatingButton} onPress={openWhatsApp}>
        <Image source={require("../../assets/icons/zap-icon.png")} style={styles.icon} />
      </TouchableOpacity>      
    </>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#25D366",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  icon: {
    width: 30,
    height: 30,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
  },
  whatsappButton: {
    backgroundColor: "#25D366",
    padding: 10,
    borderRadius: 5,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  closeButton: {
    marginTop: 10,
  },
  closeButtonText: {
    color: "red",
    fontSize: 14,
  },
});

export default SupportModal;
