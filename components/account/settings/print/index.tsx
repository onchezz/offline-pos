import { PrintSettingsData } from '@/types';
import { requestEnableBluetooth } from '@/utils/Services/bluetooth';
import printerService, { Device } from '@/utils/Services/printer';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import AutoConnectToggle from './AutoConnectToggle';
import { AutoPrintToggle } from './AutoPrintToggle';
import { PrinterConfiguration } from './PrinterConfiguration';
import { PrinterSetupTips } from './PrinterSetupTips';
import { ReceiptContent } from './ReceiptContent';
import { SavePrintButton } from './SavePrintButton';

interface PrintSettingsProps {
    onSave?: (data: PrintSettingsData) => void;
}

const PrintSettings: React.FC<PrintSettingsProps> = ({ onSave }) => {
    const [printerName, setPrinterName] = useState('');
    const [paperWidth, setPaperWidth] = useState('Receipt (58mm) - Standard');
    const [fontSize, setFontSize] = useState('Medium - Standard readability');
    const [includeStoreHeader, setIncludeStoreHeader] = useState(true);
    const [includeFooterMessage, setIncludeFooterMessage] = useState(true);

    const handleSave = () => {
        const data: PrintSettingsData = {
            autoPrintReceipts,
            printerName,
            paperWidth,
            fontSize,
            includeStoreHeader,
            includeFooterMessage,
        };
        onSave?.(data);
        console.log('Saving print settings:', data);
    };

    const [preferred, setPreferred] = useState<Device | null>(null);
    const [connectedId, setConnectedId] = useState<string | null>(null);
    const [autoPrintReceipts, setAutoPrintReceipts] = useState(false);
    const [autoConnectEnabled, setAutoConnectEnabled] = useState(false);
    const [reconnecting, setReconnecting] = useState(false);
    const [enablingBluetooth, setEnablingBluetooth] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const p = await printerService.getPreferredDevice();
                setPreferred(p);
                const prefFull = await printerService.getPreferredPreference();
                setAutoPrintReceipts(!!prefFull?.autoPrint);
                setAutoConnectEnabled(!!prefFull?.autoConnect);
                const conn = printerService.getConnectedDeviceInfo();
                setConnectedId(conn ? conn.id : null);
            } catch {
                setPreferred(null);
            }
        })();
    }, []);

    const handleClearPreferred = async () => {
        try {
            await printerService.clearPreferredDevice();
            setPreferred(null);
        } catch {
            // ignore
        }
    };

    const handleReconnectPreferred = async () => {
        if (!preferred) return;
        // if already connected to this device, do nothing
        const conn = printerService.getConnectedDeviceInfo();
        if (conn && conn.id === preferred.id) {
            // already connected
            return;
        }
        // ensure bluetooth is enabled before attempting to connect
        try {
            const enabled = await printerService.isBluetoothEnabled();
            if (!enabled) {
                setEnablingBluetooth(true);
                await requestEnableBluetooth();
                setEnablingBluetooth(false);
                const nowEnabled = await printerService.isBluetoothEnabled();
                if (!nowEnabled) return;
            }
        } catch {
            // ignore and proceed; connect will fail with a toast
        }
        setReconnecting(true);
        try {
            const ok = await printerService.connect(preferred.id);
            if (ok) {
                setConnectedId(preferred.id);
                Toast.show({
                    type: 'success',
                    text1: 'Connected',
                    text2: `Connected to ${preferred.name || preferred.id}`,
                    position: 'bottom',
                });
            } else {
                Toast.show({ type: 'error', text1: 'Connect failed', position: 'bottom' });
            }
        } catch (e: any) {
            Toast.show({
                type: 'error',
                text1: 'Connect failed',
                text2: e.message || String(e),
                position: 'bottom',
            });
        } finally {
            setReconnecting(false);
        }
    };

    const handleToggleAutoPrint = async (value: boolean) => {
        setAutoPrintReceipts(value);
        try {
            await printerService.setPreferredAutoPrint(value);
        } catch {
            // ignore
        }
    };

    const handleToggleAutoConnect = async (value: boolean) => {
        setAutoConnectEnabled(value);
        try {
            await printerService.setPreferredAutoConnect(value);
        } catch {
            // ignore
        }
    };

    const handleScanTest = async () => {
        // ensure bluetooth is enabled before scanning
        try {
            const enabled = await printerService.isBluetoothEnabled();
            if (!enabled) {
                setEnablingBluetooth(true);
                await requestEnableBluetooth();
                setEnablingBluetooth(false);
                const nowEnabled = await printerService.isBluetoothEnabled();
                if (!nowEnabled) return;
            }
        } catch {
            // proceed and let printerService handle error
        }
        try {
            const found: string[] = [];
            await printerService.startScan((d) => {
                const label = d.name || d.id;
                if (!found.includes(label)) found.push(label);
            });
            // scan for 3s then stop
            setTimeout(() => {
                try {
                    printerService.stopScan();
                } catch {
                    // ignore
                }
                Toast.show({
                    type: 'info',
                    text1: 'Scan test',
                    text2: `Found ${found.length} devices:\n${found.join('\n')}`,
                    position: 'bottom',
                    visibilityTime: 4000,
                });
            }, 3000);
        } catch (e: any) {
            Toast.show({
                type: 'error',
                text1: 'Scan failed',
                text2: e.message || String(e),
                position: 'bottom',
            });
        }
    };

    const handleTestPrint = async () => {
        try {
            const pref = await printerService.getPreferredPreference();
            if (!pref || !pref.deviceId) {
                Toast.show({
                    type: 'error',
                    text1: 'No preferred printer',
                    text2: 'Set and connect a preferred printer first',
                    position: 'bottom',
                });
                return;
            }
            const conn = printerService.getConnectedDeviceInfo();
            if (!conn || conn.id !== pref.deviceId) {
                const ok = await printerService.connect(pref.deviceId);
                if (!ok) {
                    Toast.show({ type: 'error', text1: 'Connect failed', position: 'bottom' });
                    return;
                }
            }
            await printerService.printText('Test print\n');
            Toast.show({
                type: 'success',
                text1: 'Test print',
                text2: 'Test print sent to printer',
                position: 'bottom',
            });
        } catch (e: any) {
            Toast.show({
                type: 'error',
                text1: 'Test print failed',
                text2: e.message || String(e),
                position: 'bottom',
            });
        }
    };

    return (
        <ScrollView className='flex-1 px-4 py-4'>
            <PrinterSetupTips />

            <View style={{ marginVertical: 12 }}>
                <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>
                    Saved Printer
                </Text>
                {preferred ? (
                    <View>
                        <Text style={{ color: '#333' }}>{preferred.name || preferred.id}</Text>
                        <View style={{ flexDirection: 'row', marginTop: 8 }}>
                            <TouchableOpacity
                                style={{
                                    marginRight: 8,
                                    padding: 8,
                                    backgroundColor:
                                        connectedId === preferred.id ? '#6b7280' : '#007aff',
                                    borderRadius: 6,
                                }}
                                onPress={handleReconnectPreferred}
                                disabled={
                                    connectedId === preferred.id ||
                                    reconnecting ||
                                    enablingBluetooth
                                }>
                                {enablingBluetooth ? (
                                    <ActivityIndicator color='#fff' />
                                ) : reconnecting ? (
                                    <ActivityIndicator color='#fff' />
                                ) : (
                                    <Text style={{ color: '#fff' }}>
                                        {connectedId === preferred.id ? 'Connected' : 'Reconnect'}
                                    </Text>
                                )}
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ padding: 8, backgroundColor: '#ff3b30', borderRadius: 6 }}
                                onPress={handleClearPreferred}>
                                <Text style={{ color: '#fff' }}>Clear</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <Text style={{ color: '#666' }}>No preferred printer saved</Text>
                )}
            </View>

            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
                <TouchableOpacity
                    style={{
                        padding: 8,
                        backgroundColor: '#10b981',
                        borderRadius: 6,
                        marginRight: 8,
                    }}
                    onPress={handleScanTest}
                    disabled={enablingBluetooth}>
                    {enablingBluetooth ? (
                        <ActivityIndicator color='#fff' />
                    ) : (
                        <Text style={{ color: '#fff' }}>Scan Test</Text>
                    )}
                </TouchableOpacity>
                <TouchableOpacity
                    style={{ padding: 8, backgroundColor: '#374151', borderRadius: 6 }}
                    onPress={handleTestPrint}
                    disabled={enablingBluetooth}>
                    {enablingBluetooth ? (
                        <ActivityIndicator color='#fff' />
                    ) : (
                        <Text style={{ color: '#fff' }}>Test Print</Text>
                    )}
                </TouchableOpacity>
            </View>

            <AutoPrintToggle
                autoPrintReceipts={autoPrintReceipts}
                setAutoPrintReceipts={handleToggleAutoPrint}
            />

            <AutoConnectToggle
                autoConnect={autoConnectEnabled}
                setAutoConnect={handleToggleAutoConnect}
            />

            <PrinterConfiguration
                printerName={printerName}
                setPrinterName={setPrinterName}
                paperWidth={paperWidth}
                setPaperWidth={setPaperWidth}
                fontSize={fontSize}
                setFontSize={setFontSize}
            />

            <ReceiptContent
                includeStoreHeader={includeStoreHeader}
                setIncludeStoreHeader={setIncludeStoreHeader}
                includeFooterMessage={includeFooterMessage}
                setIncludeFooterMessage={setIncludeFooterMessage}
            />

            <SavePrintButton onPress={handleSave} />
        </ScrollView>
    );
};

export default PrintSettings;
