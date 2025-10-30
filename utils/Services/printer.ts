import { database, printerPreferencesCollection } from '@/db';
import { Buffer } from 'buffer';
import { PermissionsAndroid, Platform } from 'react-native';
import { Device as BleDevice, BleManager } from 'react-native-ble-plx';

type Device = { id: string; name?: string };

class PrinterBLEService {
    private manager: BleManager | null = null;
    private scanning = false;
    private discovered = new Map<string, Device>();
    private connectedDevice: BleDevice | null = null;
    private serviceUUID: string | null = null;
    private characteristicUUID: string | null = null;

    // Do not instantiate BleManager in constructor — instantiate lazily to avoid
    // errors during module import when native module isn't ready.

    private getManager(): BleManager {
        if (!this.manager) {
            try {
                this.manager = new BleManager();
            } catch {
                // Provide a clearer message for runtime where native module is missing
                throw new Error(
                    'BLE manager not available. Ensure react-native-ble-plx is installed, linked, and the app is running on a native device (not web).',
                );
            }
        }
        return this.manager;
    }

    async isBluetoothEnabled(): Promise<boolean> {
        try {
            const state = await this.getManager().state();
            return state === 'PoweredOn';
        } catch {
            return false;
        }
    }

    // Ensure runtime permissions for BLE scanning on Android (API 31+ requires BLUETOOTH_SCAN/CONNECT)
    private async ensurePermissions(): Promise<boolean> {
        if (Platform.OS !== 'android') return true;

        try {
            const sdk = Platform.Version as number;
            if (sdk >= 31) {
                const granted = await PermissionsAndroid.requestMultiple([
                    PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                    PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                ]);
                // check responses
                const ok =
                    granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] ===
                        PermissionsAndroid.RESULTS.GRANTED &&
                    granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] ===
                        PermissionsAndroid.RESULTS.GRANTED &&
                    granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] ===
                        PermissionsAndroid.RESULTS.GRANTED;
                return ok;
            }

            // older Android versions: location permission is usually required for BLE scanning
            const res = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            );
            return res === PermissionsAndroid.RESULTS.GRANTED;
        } catch (err) {
            console.warn('BLE permission request failed', err);
            return false;
        }
    }

    // preference persistence via WatermelonDB (printer_preferences table)
    async savePreferredDevice(device: Device): Promise<void> {
        try {
            await database.write(async () => {
                const col = printerPreferencesCollection;
                // preserve existing auto_print preference if present
                const existing = await col.query().fetch();
                let autoPrint = true;
                if (existing && existing.length > 0) {
                    try {
                        autoPrint = (existing[0] as any).autoPrint || false;
                    } catch {
                        autoPrint = false;
                    }
                    for (const e of existing) {
                        try {
                            await (e as any).destroyPermanently();
                        } catch {
                            // ignore
                        }
                    }
                }

                await col.create((p: any) => {
                    p.deviceId = device.id;
                    p.name = device.name || '';
                    p.serviceUuid = this.serviceUUID || '';
                    p.characteristicUuid = this.characteristicUUID || '';
                    p.savedAt = Date.now();
                    p.autoPrint = autoPrint;
                });
            });
        } catch {
            // ignore persistence errors
        }
    }

    // Return the full stored preference row as a plain object (including autoPrint)
    async getPreferredPreference(): Promise<{
        deviceId: string;
        name?: string;
        serviceUuid?: string;
        characteristicUuid?: string;
        savedAt?: number;
        autoPrint?: boolean;
        autoConnect?: boolean;
    } | null> {
        try {
            const col = printerPreferencesCollection;
            const rows = await col.query().fetch();
            if (!rows || rows.length === 0) return null;
            const first = rows[0] as any;
            return {
                deviceId: first.deviceId,
                name: first.name,
                serviceUuid: first.serviceUuid,
                characteristicUuid: first.characteristicUuid,
                savedAt: first.savedAt,
                autoPrint: !!first.autoPrint,
                autoConnect: !!first.autoConnect,
            };
        } catch {
            return null;
        }
    }

    async setPreferredAutoPrint(value: boolean): Promise<void> {
        try {
            await database.write(async () => {
                const col = printerPreferencesCollection;
                const rows = await col.query().fetch();
                if (rows && rows.length > 0) {
                    const r = rows[0] as any;
                    await r.update((rec: any) => {
                        rec.autoPrint = value;
                    });
                } else {
                    // create a placeholder preference with autoPrint set
                    await col.create((p: any) => {
                        p.deviceId = '';
                        p.name = '';
                        p.serviceUuid = '';
                        p.characteristicUuid = '';
                        p.savedAt = Date.now();
                        p.autoPrint = value;
                    });
                }
            });
        } catch {
            // ignore
        }
    }

    async setPreferredAutoConnect(value: boolean): Promise<void> {
        try {
            await database.write(async () => {
                const col = printerPreferencesCollection;
                const rows = await col.query().fetch();
                if (rows && rows.length > 0) {
                    const r = rows[0] as any;
                    await r.update((rec: any) => {
                        rec.autoConnect = value;
                    });
                } else {
                    // create a placeholder preference with autoConnect set
                    await col.create((p) => {
                        p.deviceId = '';
                        p.name = '';
                        p.serviceUuid = '';
                        p.characteristicUuid = '';
                        p.savedAt = Date.now();
                        p.autoConnect = value;
                    });
                }
            });
        } catch {
            // ignore
        }
    }

    async getPreferredDevice(): Promise<Device | null> {
        try {
            const col = printerPreferencesCollection;
            const rows = await col.query().fetch();
            if (!rows || rows.length === 0) return null;
            const first = rows[0] as any;
            return { id: first.deviceId, name: first.name || undefined };
        } catch {
            return null;
        }
    }

    async clearPreferredDevice(): Promise<void> {
        try {
            await database.write(async () => {
                const col = printerPreferencesCollection;
                const rows = await col.query().fetch();
                for (const r of rows) {
                    try {
                        await (r as any).destroyPermanently();
                    } catch {
                        // ignore
                    }
                }
            });
        } catch {
            // ignore
        }
    }

    getConnectedDeviceInfo(): Device | null {
        if (!this.connectedDevice) return null;
        return { id: this.connectedDevice.id, name: this.connectedDevice.name || undefined };
    }

    async startScan(onDevice: (dev: Device) => void): Promise<void> {
        if (this.scanning) return;
        this.scanning = true;
        this.discovered.clear();
        const ok = await this.ensurePermissions();
        if (!ok) {
            this.scanning = false;
            throw new Error('Required Bluetooth permissions not granted');
        }

        this.getManager().startDeviceScan(null, null, (error, device) => {
            if (!this.scanning) return;
            if (error) {
                console.warn('BLE scan error', error);
                // stop scanning on fatal errors
                try {
                    this.getManager().stopDeviceScan();
                } catch {
                    // ignore
                }
                this.scanning = false;
                return;
            }
            if (!device) return;
            const id = device.id;
            const name = device.name || device.localName || undefined;
            if (!this.discovered.has(id)) {
                const d = { id, name };
                this.discovered.set(id, d);
                try {
                    onDevice(d);
                } catch (e) {
                    // swallow UI handler errors
                    console.warn('onDevice handler error', e);
                }
            }
        });
    }

    stopScan(): void {
        if (!this.scanning) return;
        this.scanning = false;
        try {
            this.getManager().stopDeviceScan();
        } catch {
            // ignore
        }
    }

    // Connect to a BLE device by id. After connecting we attempt to discover a
    // writable characteristic automatically. Returns true on success.
    async connect(deviceId: string): Promise<boolean> {
        this.stopScan();
        try {
            const device = await this.getManager().connectToDevice(deviceId);
            await device.discoverAllServicesAndCharacteristics();
            // try to find a writable characteristic
            const services = await device.services();
            for (const svc of services) {
                try {
                    // characteristicsForService is available on device; use any cast for typing
                    const chars = await (device as any).characteristicsForService(svc.uuid);
                    for (const c of chars) {
                        const props = c.properties || {};

                        // prefer writeWithResponse then writeWithoutResponse
                        if (
                            props.Write ||
                            props.write ||
                            c.isWritableWithResponse ||
                            c.isWritableWithoutResponse
                        ) {
                            this.connectedDevice = device;
                            this.serviceUUID = svc.uuid;
                            this.characteristicUUID = c.uuid;
                            return true;
                        }
                    }
                } catch {
                    // ignore and try next service
                }
            }

            // if we reach here, no writable characteristic found — disconnect
            try {
                await device.cancelConnection();
            } catch {
                // ignore
            }
            throw new Error('No writable characteristic found on device');
        } catch (e) {
            throw e;
        }
    }

    async disconnect(): Promise<void> {
        if (!this.connectedDevice) return;
        try {
            await this.getManager().cancelDeviceConnection(this.connectedDevice.id);
        } catch {
            // ignore
        } finally {
            this.connectedDevice = null;
            this.serviceUUID = null;
            this.characteristicUUID = null;
        }
    }

    private ensureConnected() {
        if (!this.connectedDevice || !this.serviceUUID || !this.characteristicUUID) {
            throw new Error('Not connected to a printer or writable characteristic not selected');
        }
    }

    async printRaw(bytes: number[] | Uint8Array): Promise<void> {
        this.ensureConnected();

        // Many BLE stacks and devices enforce an MTU - attempting to write a very
        // large base64 payload in a single call can crash the native BLE layer on
        // some Android devices. Chunk the payload into smaller slices and write
        // them sequentially. Use a conservative default chunk size; callers can
        // still tune this value if necessary.
        const buf = Buffer.from(bytes);
        const total = buf.length;
        const CHUNK_SIZE = 180; // bytes per chunk (safe conservative default)
        const deviceId = this.connectedDevice!.id;
        const svc = this.serviceUUID!;
        const char = this.characteristicUUID!;

        let offset = 0;
        while (offset < total) {
            const end = Math.min(offset + CHUNK_SIZE, total);
            const slice = buf.slice(offset, end);
            const b64 = slice.toString('base64');

            // Try write with response first; fall back to without-response.
            try {
                await this.getManager().writeCharacteristicWithResponseForDevice(
                    deviceId,
                    svc,
                    char,
                    b64,
                );
            } catch {
                try {
                    await this.getManager().writeCharacteristicWithoutResponseForDevice(
                        deviceId,
                        svc,
                        char,
                        b64,
                    );
                } catch (err2) {
                    // Re-throw with contextual information for higher-level handling
                    throw new Error(`Failed to write BLE chunk ${offset}-${end} (${String(err2)})`);
                }
            }

            offset = end;
        }
    }

    async printText(text: string): Promise<void> {
        // many printers expect specific ESC/POS bytes — for a simple approach
        // send the plain utf8 text; you may need to add line feeds and cut commands
        const payload = Buffer.from(text + '\n', 'utf8');
        await this.printRaw(Array.from(payload));
    }
}

const printerService = new PrinterBLEService();

export type { Device };
export default printerService;
