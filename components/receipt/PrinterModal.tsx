import { ItemWithProduct, SaleWithExtras } from '@/types';
import buildEscPosReceipt from '@/utils/Services/escpos';
import printerService, { Device } from '@/utils/Services/printer';
import React, { useEffect, useRef, useState } from 'react';

import Store from '@/db/models/stores';
import { requestEnableBluetooth } from '@/utils/Services/bluetooth';
import {
    ActivityIndicator,
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import Payment from '@/db/models/payments';

type Props = {
    visible: boolean;
    onClose: () => void;
    sale: SaleWithExtras;
    payments: Payment[];
    items?: ItemWithProduct[];
    buildHtml?: () => Promise<string>;
    store: Store | null;
    cashierName?: string;
    currency?: string;
    generatedAt?: Date;
};

const PrinterModal: React.FC<Props> = ({
    visible,
    onClose,
    sale,
    items,
    payments,
    buildHtml,
    store,
    cashierName,
    currency,
    generatedAt,
}) => {
    const [scanning, setScanning] = useState(false);
    const [devices, setDevices] = useState<Device[]>([]);
    const [connected, setConnected] = useState<string | null>(null);
    const [loadingAction, setLoadingAction] = useState(false);
    const [bluetoothAvailable, setBluetoothAvailable] = useState<boolean>(true);
    const [preferredDevice, setPreferredDevice] = useState<Device | null>(null);
    const [scanError, setScanError] = useState<string | null>(null);
    const [scanCountdown, setScanCountdown] = useState<number>(0);
    const scanIntervalRef = useRef<number | null>(null);

    useEffect(() => {
        if (!visible) {
            setDevices([]);
            setScanning(false);
        }

        // when opened, load preferred device and bluetooth status
        if (visible) {
            (async () => {
                try {
                    const pref = await printerService.getPreferredDevice();
                    // ignore placeholder preferences that have an empty device id
                    if (pref && pref.id && pref.id.toString().trim() !== '') {
                        setPreferredDevice(pref);
                    } else {
                        setPreferredDevice(null);
                    }

                    // initialize connected state from service if already connected
                    const conn = printerService.getConnectedDeviceInfo();
                    if (conn) setConnected(conn.id);
                    const enabled = await printerService.isBluetoothEnabled();
                    setBluetoothAvailable(enabled);
                } catch {
                    setBluetoothAvailable(false);
                }
            })();
        }
    }, [visible]);

    const promptEnableBluetooth = async () => {
        await requestEnableBluetooth();
        try {
            const enabled = await printerService.isBluetoothEnabled();
            setBluetoothAvailable(enabled);
        } catch {
            setBluetoothAvailable(false);
        }
    };

    // Safe toast wrapper — avoid runtime crash if Toast isn't available
    const safeToast = (opts: {
        type?: string;
        text1?: string;
        text2?: string;
        position?: string;
        visibilityTime?: number;
    }) => {
        try {
            if (Toast && typeof (Toast as any).show === 'function') {
                (Toast as any).show(opts);
            } else {
                console.log('toast:', opts.text1, opts.text2);
            }
        } catch (e) {
            console.log('toast error', e);
        }
    };

    const startScan = async () => {
        setDevices([]);
        setScanning(true);
        setScanError(null);
        try {
            const enabled = await printerService.isBluetoothEnabled();
            if (!enabled) {
                // Ask the system to enable/open bluetooth settings
                await promptEnableBluetooth();
                setScanning(false);
                return;
            }
        } catch {
            safeToast({
                type: 'error',
                text1: 'Printer module',
                text2: 'Failed to check Bluetooth state',
                position: 'bottom',
            });
            setScanning(false);
            return;
        }

        // Start scan (shim may emit paired devices)
        try {
            await printerService.startScan((d) => {
                setDevices((prev) => {
                    if (prev.find((p) => p.id === d.id)) return prev;
                    return [...prev, d];
                });
            });

            // start countdown and interval (8s)
            setScanCountdown(8);
            scanIntervalRef.current = setInterval(() => {
                setScanCountdown((c) => Math.max(0, c - 1));
            }, 1000) as unknown as number;
        } catch (e: any) {
            setScanning(false);
            setScanError(e.message || String(e));
            safeToast({
                type: 'error',
                text1: 'Scan failed',
                text2: e.message || String(e),
                position: 'bottom',
            });
        }
    };

    // When countdown reaches zero perform side-effects (stop scan, toasts) outside of state updater.
    useEffect(() => {
        if (scanCountdown === 0 && scanning) {
            try {
                printerService.stopScan();
            } catch {
                // ignore
            }
            setScanning(false);
            if (devices.length === 0) {
                setScanError('No devices found');
                safeToast({
                    type: 'info',
                    text1: 'Scan',
                    text2: 'No devices found',
                    position: 'bottom',
                });
            } else {
                safeToast({
                    type: 'success',
                    text1: 'Scan',
                    text2: 'Scan finished',
                    position: 'bottom',
                });
            }
            if (scanIntervalRef.current) {
                clearInterval(scanIntervalRef.current as any);
                scanIntervalRef.current = null;
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scanCountdown]);

    const stopScan = () => {
        try {
            printerService.stopScan();
        } catch {
            // ignore
        }
        setScanning(false);
        if (scanIntervalRef.current) {
            clearInterval(scanIntervalRef.current as any);
            scanIntervalRef.current = null;
        }
        setScanCountdown(0);
        safeToast({ type: 'info', text1: 'Scan', text2: 'Scan stopped', position: 'bottom' });
    };

    const showToast = (msg: string) => {
        safeToast({ type: 'info', text1: msg, position: 'bottom' });
    };

    const connect = async (d: Device) => {
        setLoadingAction(true);
        try {
            await printerService.connect(d.id);
            showToast(`Connected to printer ${d.name || d.id}`);
            // stop any active scan and update UI state
            try {
                printerService.stopScan();
            } catch {
                // ignore
            }
            setScanning(false);
            setConnected(d.id);
            // persist preferred device when user connects
            try {
                await printerService.savePreferredDevice(d);
                setPreferredDevice(d);
            } catch {
                // ignore persistence failures
            }
            safeToast({
                type: 'success',
                text1: 'Connected',
                text2: `Connected to ${d.name || d.id}`,
                position: 'bottom',
            });
            // close modal after successful connection
            try {
                onClose();
            } catch {
                // ignore
            }
        } catch (e: any) {
            safeToast({
                type: 'error',
                text1: 'Connect failed',
                text2: e.message || String(e),
                position: 'bottom',
            });
        } finally {
            setLoadingAction(false);
        }
    };

    const disconnect = async () => {
        setLoadingAction(true);
        try {
            await printerService.disconnect();
            setConnected(null);
            safeToast({ type: 'info', text1: 'Disconnected', position: 'bottom' });
        } catch (e: any) {
            safeToast({
                type: 'error',
                text1: 'Disconnect failed',
                text2: e.message || String(e),
                position: 'bottom',
            });
        } finally {
            setLoadingAction(false);
        }
    };

    const doPrint = async () => {
        setLoadingAction(true);
        try {
            const customer = await sale?.customer;
            // Build ESC/POS bytes from sale/items and send raw bytes
            const genAt =
                generatedAt || (sale && sale.createdAt ? new Date(sale.createdAt) : new Date());
            const esc = buildEscPosReceipt({
                sale: sale || {},
                items: items || [],
                store: store,
                cashierName: cashierName,
                generatedAt: genAt,
                currency: currency || '$',
                customer: {
                    name: customer?.name || '',
                    phone: customer?.phone || '',
                    email: customer?.email || '',
                },
                payments: payments || [],
            });

            await printerService.printRaw(esc);
            safeToast({
                type: 'success',
                text1: 'Printed',
                text2: 'Sent to printer',
                position: 'bottom',
            });
            // close modal after print
            try {
                onClose();
            } catch {
                // ignore
            }
        } catch (e: any) {
            safeToast({
                type: 'error',
                text1: 'Print failed',
                text2: e.message || String(e),
                position: 'bottom',
            });
        } finally {
            setLoadingAction(false);
        }
    };

    return (
        <Modal visible={visible} animationType='slide' transparent onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.sheet}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Thermal Printer</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Text style={styles.close}>Close</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.body}>
                        <View style={styles.row}>
                            <Text style={styles.label}>Bluetooth:</Text>
                            <TouchableOpacity
                                style={styles.actionBtn}
                                onPress={() => (scanning ? stopScan() : startScan())}
                                disabled={!bluetoothAvailable}>
                                {scanning ? (
                                    <Text style={styles.actionText}>Stop Scan</Text>
                                ) : (
                                    <Text style={styles.actionText}>Scan Devices</Text>
                                )}
                            </TouchableOpacity>
                        </View>

                        {!bluetoothAvailable && (
                            <View style={{ marginTop: 8 }}>
                                <Text style={{ color: '#c00', marginBottom: 8 }}>
                                    Bluetooth unavailable — enable it to use thermal printing
                                </Text>
                                <TouchableOpacity
                                    style={[styles.actionBtn, { alignSelf: 'flex-start' }]}
                                    onPress={promptEnableBluetooth}>
                                    <Text style={styles.actionText}>Enable Bluetooth</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {scanning && <ActivityIndicator style={{ marginVertical: 8 }} />}
                        {scanning && scanCountdown > 0 && (
                            <Text style={{ color: '#444', marginTop: 6 }}>
                                Scanning... {scanCountdown}s
                            </Text>
                        )}
                        {scanError ? (
                            <View style={{ marginTop: 8 }}>
                                <Text style={{ color: '#c00', marginTop: 4 }}>{scanError}</Text>
                                <TouchableOpacity
                                    style={[styles.actionBtn, { marginTop: 8 }]}
                                    onPress={() => {
                                        setScanError(null);
                                        startScan();
                                    }}>
                                    <Text style={styles.actionText}>Retry Scan</Text>
                                </TouchableOpacity>
                            </View>
                        ) : null}

                        {/* If there's a preferred device, show it first and allow connect/disconnect. */}
                        {preferredDevice ? (
                            <View style={{ marginTop: 12 }}>
                                <Text style={{ color: '#666', marginBottom: 8 }}>Preferred</Text>
                                <View style={styles.deviceRow}>
                                    <Text style={styles.deviceText}>
                                        {preferredDevice.name || preferredDevice.id}
                                    </Text>
                                    {connected === preferredDevice.id ? (
                                        <TouchableOpacity
                                            style={styles.connectedBtn}
                                            onPress={disconnect}>
                                            <Text style={styles.connectedText}>Disconnect</Text>
                                        </TouchableOpacity>
                                    ) : (
                                        <TouchableOpacity
                                            style={styles.connectBtn}
                                            onPress={() => connect(preferredDevice)}>
                                            <Text style={styles.connectText}>Connect</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                                <TouchableOpacity
                                    style={[styles.actionBtn, { marginTop: 10 }]}
                                    onPress={async () => {
                                        // If currently connected to the preferred device, disconnect first.
                                        setLoadingAction(true);
                                        try {
                                            const conn = printerService.getConnectedDeviceInfo();
                                            if (
                                                conn &&
                                                preferredDevice &&
                                                conn.id === preferredDevice.id
                                            ) {
                                                try {
                                                    await printerService.disconnect();
                                                    setConnected(null);
                                                } catch {
                                                    // ignore disconnect failures but continue
                                                }
                                            }

                                            // Clear persisted preferred device (may be a placeholder)
                                            try {
                                                await printerService.clearPreferredDevice();
                                            } catch {
                                                // ignore persistence failures
                                            }

                                            // reset local state and start a scan
                                            setPreferredDevice(null);
                                            setDevices([]);
                                            setScanning(true);
                                            try {
                                                await startScan();
                                            } catch (e: any) {
                                                safeToast({
                                                    type: 'error',
                                                    text1: 'Scan failed',
                                                    text2: e.message || String(e),
                                                    position: 'bottom',
                                                });
                                                setScanning(false);
                                            }
                                        } finally {
                                            setLoadingAction(false);
                                        }
                                    }}>
                                    <Text style={styles.actionText}>Scan other devices</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <FlatList
                                data={devices}
                                keyExtractor={(i) => i.id}
                                ListEmptyComponent={() => (
                                    <Text style={{ color: '#666', marginTop: 12 }}>
                                        No devices found
                                    </Text>
                                )}
                                renderItem={({ item }) => (
                                    <View style={styles.deviceRow}>
                                        <Text style={styles.deviceText}>
                                            {item.name || item.id}
                                        </Text>
                                        {connected === item.id ? (
                                            <TouchableOpacity
                                                style={styles.connectedBtn}
                                                onPress={disconnect}>
                                                <Text style={styles.connectedText}>Disconnect</Text>
                                            </TouchableOpacity>
                                        ) : (
                                            <TouchableOpacity
                                                style={styles.connectBtn}
                                                onPress={() => connect(item)}>
                                                <Text style={styles.connectText}>Connect</Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                )}
                            />
                        )}

                        <View style={{ marginTop: 12 }}>
                            <TouchableOpacity
                                style={styles.printBtn}
                                onPress={doPrint}
                                disabled={!connected || loadingAction}>
                                {loadingAction ? (
                                    <ActivityIndicator color='#fff' />
                                ) : (
                                    <Text style={styles.printText}>Print</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
    },
    sheet: {
        backgroundColor: 'white',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        maxHeight: '80%',
        paddingBottom: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        alignItems: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: '#eee',
    },
    title: { fontSize: 16, fontWeight: '600' },
    close: { color: '#007aff' },
    body: { padding: 16 },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    label: { color: '#444' },
    actionBtn: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: '#eee',
        borderRadius: 8,
    },
    actionText: { color: '#333' },
    deviceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    deviceText: { color: '#111' },
    connectBtn: {
        backgroundColor: '#007aff',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    connectText: { color: '#fff' },
    connectedBtn: {
        backgroundColor: '#ff3b30',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    connectedText: { color: '#fff' },
    printBtn: { backgroundColor: '#111827', padding: 12, borderRadius: 8, alignItems: 'center' },
    printText: { color: '#fff', fontWeight: '600' },
});

export default PrinterModal;
