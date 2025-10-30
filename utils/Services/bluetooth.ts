import { Linking } from 'react-native';
import { BluetoothStateManager } from 'react-native-bluetooth-state-manager';

/**
 * Request the system to enable or open Bluetooth settings.
 * This function attempts platform helpers provided by
 * `react-native-bluetooth-state-manager` and falls back to
 * opening the app settings via Linking.
 */
export async function requestEnableBluetooth(): Promise<void> {
    try {
        const anyMgr = BluetoothStateManager;
        if (anyMgr.requestToEnable) {
            await anyMgr.requestToEnable();
            return;
        }
    } catch {
        try {
            await Linking.openSettings();
        } catch {
            // ignore errors
        }
    }
}

export default requestEnableBluetooth;
