import React from 'react';
import { View,Text } from 'react-native';

const Payment: React.FC = () => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Payment Page</Text>
            <Text style={{ marginTop: 20 }}>This is where the payment process will be handled.</Text>
        </View>
    );
};

export default Payment;