Thermal printing integration (notes and steps)
=============================================

This document explains how to enable thermal printing for the POS app and what the provided shim and modal do.

What I added
------------
- `utils/Services/printer.ts` — a runtime shim/wrapper that exposes a simple API:
  - isBluetoothEnabled()
  - startScan(onDevice)
  - stopScan()
  - connect(deviceId)
  - disconnect()
  - printText(text)
  - printRaw(bytes)

- `components/receipt/PrinterModal.tsx` — a modal UI to scan paired devices, connect/disconnect, and send a print command.
- `app/(tabs)/checkout/receipt/[id].tsx` — replaced `ReceiptActions` with a Print button that opens the modal.

Important: BLE native dependency required
--------------------------------------
This repo is now using a BLE-only implementation. You must install `react-native-ble-plx` and rebuild the app (EAS or prebuild + dev client) because BLE access requires native code.

Install & build (Expo managed)
------------------------------
1. Install the BLE package:

   ```bash
   yarn add react-native-ble-plx buffer
   # or
   npm install react-native-ble-plx buffer --save
   ```

2. Prebuild or create a dev client / EAS build because this module contains native code:
   - `expo prebuild` (if you want local native project) or use EAS:
   - `eas build --profile preview --platform android` (example)

3. Install the built dev client to your device or install the app built by EAS.

Android permissions
-------------------
- Add the following permissions to `AndroidManifest.xml` if the plugin's README requires them:
  - android.permission.BLUETOOTH
  - android.permission.BLUETOOTH_ADMIN
  - android.permission.ACCESS_FINE_LOCATION (sometimes required for scanning on older Android versions)

iOS notes
---------
- Add Bluetooth usage keys to `Info.plist` as required by Apple and the BLE library:
  - NSBluetoothAlwaysUsageDescription or NSBluetoothPeripheralUsageDescription (check plugin docs and iOS version requirements)

How the BLE service works
------------------------
- `utils/Services/printer.ts` now implements a BLE-only service using `react-native-ble-plx`.
- Behavior:
  - `isBluetoothEnabled()` checks the BLE manager state.
  - `startScan(onDevice)` starts scanning and calls `onDevice` for every discovered device.
  - `stopScan()` stops scanning.
  - `connect(deviceId)` connects and attempts to discover a writable characteristic automatically.
  - `disconnect()` disconnects the device.
  - `printText()` and `printRaw()` write bytes to the discovered writable characteristic using base64-encoded payloads.

Notes & caveats
---------------
- Many inexpensive thermal printers use Bluetooth Classic (SPP) and will not be discoverable or connectable via BLE. Ensure your printer advertises BLE services.
- The service attempts to find any writable characteristic; if your printer documents specific service/characteristic UUIDs, update `utils/Services/printer.ts` to use those directly for more reliable operation.
- For ESC/POS you will likely need to send binary ESC/POS command sequences (cut paper, bold, align). Use `printRaw()` with the ESC/POS bytes.

ESC/POS commands
-----------------
- Thermal printers usually accept ESC/POS command streams (binary). The shim exposes `printRaw(bytes)` for sending raw ESC/POS bytes. We also provide `printText` for simple text printing.
- For a faithful printed receipt appearance you will likely convert your receipt HTML into ESC/POS commands (there are libraries and utilities to convert HTML/text to ESC/POS sequences).

Next steps for full integration
------------------------------
1. Pick the native library that matches your printer (classic SPP vs BLE).
2. Install it and rebuild your app (EAS/prebuild). Follow the package README for platform-specific setup.
3. Replace or extend the implementations in `utils/Services/printer.ts` to call the real native APIs the package exposes (scan, connect, write).
4. Implement ESC/POS generation from your existing `buildHtml()` or a structured receipt model. Send via `printRaw()`.
5. Test on a physical device and adjust RTL/line breaks/formatting for the printer's width.

If you want, I can:
- Add a concrete implementation using a chosen native package (I will: update the shim to directly call that package's API and adjust types).
- Add a conversion utility to turn your receipt layout into ESC/POS bytes.
