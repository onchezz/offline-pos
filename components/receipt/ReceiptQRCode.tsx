import React, { useEffect, useState } from 'react';
import { View } from 'react-native';

interface Props {
    payload: object | string;
    size?: number;
}

const ReceiptQRCode: React.FC<Props> = ({ payload, size = 48 }) => {
    const [QRCode, setQRCode] = useState<any>(null);

    useEffect(() => {
        let mounted = true;
        const load = async () => {
            try {
                const mod = await import('react-native-qrcode-svg');
                if (mounted) setQRCode(() => mod.default || mod);
            } catch (e) {
                // module not available - silently ignore; we'll fallback to showing id text
                console.warn('react-native-qrcode-svg not available', e);
            }
        };

        load();
        return () => {
            mounted = false;
        };
    }, []);

    const value = typeof payload === 'string' ? payload : JSON.stringify(payload);

    if (QRCode) {
        return (
            <View>
                <QRCode value={value} size={size} />
            </View>
        );
    }

    return <View></View>;
};

export default ReceiptQRCode;
