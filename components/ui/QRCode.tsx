import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

interface QRCodeComponentProps {
  visible: boolean;
  onClose: () => void;
  productData: string;
  store: string;
}

const QRCodeComponent: React.FC<QRCodeComponentProps> = ({ visible, onClose, productData, store }) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          
          {/* Botón de retroceso con fondo amarillo */}
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>←</Text>
          </TouchableOpacity>

          {/* Texto explicativo */}
          <Text style={styles.descriptionText}>Escanea en caja para redimir</Text>

          {/* View para centrar el QR */}
          <View style={styles.qrContainer}>
            <QRCode value={productData} size={200} />
          </View>

        </View>
      </View>
    </Modal>
  );
};

// Estilos
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#FFCC00', // Fondo amarillo
    padding: 10, // Espaciado interno
    borderRadius: 50, // Bordes redondeados
  },
  closeButtonText: {
    fontSize: 18,
    color: 'black', // Color de texto negro para mejor contraste
  },
  descriptionText: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 16,
  },
  qrContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default QRCodeComponent;
