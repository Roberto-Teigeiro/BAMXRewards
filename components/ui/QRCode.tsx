import React from 'react';
import { Modal, View, Button, Text } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

interface QRCodeComponentProps {
  visible: boolean; 
  onClose: () => void; 
  productData: string; 
}

const QRCodeComponent: React.FC<QRCodeComponentProps> = ({ visible, onClose, productData }) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ width: 300, height: 300, backgroundColor: 'white', padding: 20 }}>
          <Text style={{ marginBottom: 20, textAlign: 'center' }}>Código QR para {productData}</Text>
          <QRCode value={productData} size={250} />
          <Button title="Cerrar" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

export default QRCodeComponent;
