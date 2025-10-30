import { requestEnableBluetooth } from '@/utils/Services/bluetooth';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { Header } from '@/components/common/Header';
// replaced ReceiptActions with thermal print modal + button
import PrinterModal from '@/components/receipt/PrinterModal';
import ReceiptHeader from '@/components/receipt/ReceiptHeader';
import ReceiptItems from '@/components/receipt/ReceiptItems';
import ReceiptQRCode from '@/components/receipt/ReceiptQRCode';
import ReceiptTotals from '@/components/receipt/ReceiptTotals';
import { useAuth } from '@/contexts/AuthContext';
import { useBusiness } from '@/contexts/BusinessContext';
import Customer from '@/db/models/customers';
import Payment from '@/db/models/payments';
import Sale from '@/db/models/sales';
import { salesService } from '@/db/services/salesService';
import { ItemWithProduct, SaleWithExtras } from '@/types';
import buildEscPosReceipt from '@/utils/Services/escpos';
import printerService from '@/utils/Services/printer';
import capitalizeName from '@/utils/wordCapitlization';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
// currency formatting is provided where needed; keep receipt HTML builder self-contained
export type SaleDetails = {
    sale: SaleWithExtras;
    items: ItemWithProduct[];
    payments: Payment[];
    customer?: Customer | null;
};

const ReceiptPage: React.FC = () => {
    const { id } = useLocalSearchParams();
    const { user } = useAuth();
    const { selectedStore, selectedBusiness } = useBusiness();

    const [loading, setLoading] = useState(true);

    const [saleData, setSaleData] = useState<SaleDetails | null>(null);

    useEffect(() => {
        let mounted = true;
        const load = async () => {
            if (!id) return;
            try {
                const res = await salesService.getSaleWithItems(String(id));
                if (!mounted) return;

                // fetch payments for this sale so we can show split/breakdown info
                const payments = await salesService.getPaymentsForSale(String(id));

                // attempt to resolve customer if available on the sale model
                let customer: Customer | null = null;
                try {
                    const saleModel = res.sale as Sale | undefined;
                    if (saleModel && saleModel.customer) {
                        const custRel = saleModel.customer;
                        if (custRel) {
                            // custRel is a Relation<Customer>; fetch the related record
                            const cust = await custRel.fetch();
                            customer = cust || null;
                        }
                    }
                } catch {
                    // silently continue if fetching relation fails
                }

                if (!mounted) return;

                setSaleData({ sale: res.sale, items: res.items, payments, customer });
            } catch (e) {
                console.error('Failed to load sale', e);
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Failed to load receipt',
                    position: 'bottom',
                });
            } finally {
                setLoading(false);
            }
        };

        load();
        return () => {
            mounted = false;
        };
    }, [id]);

    const subtotal = useMemo(() => (saleData ? saleData.sale.subtotal || 0 : 0), [saleData]);
    const totalDiscount = useMemo(
        () => (saleData ? saleData.sale.discountAmount || 0 : 0),
        [saleData],
    );
    const total = useMemo(() => (saleData ? saleData.sale.totalAmount || 0 : 0), [saleData]);

    const generatedAt = useMemo(() => {
        if (!saleData) return new Date();
        try {
            return new Date(saleData.sale.createdAt || Date.now());
        } catch {
            return new Date();
        }
    }, [saleData]);

    const storeName = selectedStore?.name || selectedBusiness?.name || "AMARA'S DUKA";
    const cashierName =
        saleData?.sale?.cashierName ||
        user?.name ||
        user?.fullName ||
        saleData?.sale?.userId ||
        'N/A';

    // buildHtml: generate printable HTML for the receipt (excludes action buttons)
    // This is async because we generate a QR PNG data URL using an offline QR generator.
    const buildHtml = async () => {
        const store = selectedStore || { name: storeName, email: '', phone: '' };
        const currency = selectedStore?.currency || '$';
        const itemsHtml = (items || [])
            .map((it) => {
                const name = (it.product && it.product.name) || '';
                const qty = (it.item && it.item.quantity) || 0;
                const unit = (it.item && it.item.unitPrice) || 0;
                const line = (it.item && it.item.totalPrice) || unit * qty;
                return `
                <tr>
                    <td style="padding:4px 8px;">${String(name).replace(/</g, '&lt;')}</td>
                    <td style="padding:4px 8px;text-align:right;">${currency} ${Number(unit || 0).toFixed(2)}</td>
                    <td style="padding:4px 8px;text-align:center;">${qty}</td>
                    <td style="padding:4px 8px;text-align:right;">${currency} ${Number(line || 0).toFixed(2)}</td>
                </tr>
            `;
            })
            .join('');

        const paymentsHtml = (saleData?.payments || [])
            .map(
                (p) => `
                <tr>
                    <td style="padding:4px 8px;">${p.method || 'Payment'}</td>
                    <td style="padding:4px 8px;text-align:right;">${currency} ${Number(p.amount || 0).toFixed(2)}</td>
                </tr>
            `,
            )
            .join('');

        const location = selectedStore?.address || '';
        const header = `
            <div style="text-align:center;margin-bottom:12px;">
                <h2 style="margin:0;padding:0">${(store.name || '').replace(/</g, '&lt;')}</h2>
                <div style="font-size:12px;color:#666">${store.email || ''}</div>
                <div style="font-size:12px;color:#666">${location || store.phone || ''}</div>
            </div>
        `;

        const qrValue = JSON.stringify({
            id: sale.externalId || sale.id,
            total,
            date: generatedAt.toISOString(),
            cashier: capitalizeName(cashierName),
        });

        // use a smaller QR (very small) for compact receipts; size driven by store.qrDisplaySize if present
        const qrDisplay = (selectedStore as any)?.qrDisplaySize || 48;
        const qrImageSize = Math.max(48, Math.min(300, Number(qrDisplay || 48)));
        const qrUrl = `https://chart.googleapis.com/chart?cht=qr&chs=${qrImageSize}x${qrImageSize}&chl=${encodeURIComponent(
            qrValue,
        )}&choe=UTF-8`;

        return `
            <!doctype html>
            <html>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; color:#111; padding:16px; }
                    table { width:100%; border-collapse: collapse; font-size:13px; }
                    th { border-bottom:1px solid #ddd; padding:6px 8px; text-align:left; }
                    td { border-bottom:1px dashed #eee; }
                    .totals { margin-top:12px; width:100%; }
                    .right { text-align:right; }
                </style>
            </head>
            <body>
                ${header}
                <div style="margin-bottom:8px; font-size:13px;">
                    <div>Receipt #: ${sale.externalId || sale.id}</div>
                    <div>Date: ${generatedAt.toLocaleDateString()} ${generatedAt.toLocaleTimeString()}</div>
                    <div>Cashier: ${capitalizeName(cashierName)}</div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th style="width:50%">Item</th>
                            <th style="width:15%">Price</th>
                            <th style="width:10%">Qty</th>
                            <th style="width:25%" class="right">Line</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHtml}
                    </tbody>
                </table>

                <table class="totals">
                    <tbody>
                        ${paymentsHtml}
                        <tr>
                            <td></td>
                            <td colspan="2" style="padding:6px 8px;">Subtotal</td>
                            <td style="padding:6px 8px;text-align:right">${currency} ${subtotal.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td colspan="2" style="padding:6px 8px;">Discount</td>
                            <td style="padding:6px 8px;text-align:right">${currency} ${totalDiscount.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td colspan="2" style="padding:6px 8px;font-weight:600">Total</td>
                            <td style="padding:6px 8px;text-align:right;font-weight:600">${currency} ${total.toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>

                <div style="margin-top:12px;text-align:center;">
                    <img src="${qrUrl}" alt="QR" style="width:48px;height:48px;margin-bottom:8px;" />
                    <div style="color:#666;font-size:12px">Thank you for shopping with us!</div>
                </div>
            </body>
            </html>
        `;
    };

    const [sharing, setSharing] = useState(false);

    const [showPrinterModal, setShowPrinterModal] = useState(false);
    const [bluetoothAvailable, setBluetoothAvailable] = useState<boolean>(true);
    const [connectingPrinter, setConnectingPrinter] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const enabled = await printerService.isBluetoothEnabled();
                setBluetoothAvailable(enabled);
            } catch {
                setBluetoothAvailable(false);
            }
        })();
    }, []);

    const promptEnableBluetooth = async () => {
        await requestEnableBluetooth();
        try {
            const enabled = await printerService.isBluetoothEnabled();
            setBluetoothAvailable(enabled);
        } catch {
            setBluetoothAvailable(false);
        }
    };
    const completeTransaction = async () => {
        router.push('/');
        Toast.show({
            type: 'success',
            text1: 'Success',
            text2: 'Transaction processed successfully!',
            position: 'top',
        });
    };

    if (loading) {
        return (
            <SafeAreaView className='flex-1 bg-white items-center justify-center'>
                <ActivityIndicator size='large' />
            </SafeAreaView>
        );
    }

    if (!saleData) {
        return (
            <SafeAreaView className='flex-1 bg-white items-center justify-center'>
                <Text>Receipt not found.</Text>
            </SafeAreaView>
        );
    }

    const { sale, items } = saleData;

    return (
        <SafeAreaView className='flex-1 bg-white'>
            <ScrollView contentContainerStyle={{ padding: 16 }}>
                <Header title={'Receipt'} showBackButton={true} />

                <View className='bg-white rounded-xl p-4 border border-gray-200'>
                    <ReceiptHeader
                        store={selectedStore!}
                        subtitle={'Shop POS System'}
                        contactLine={sale.contact || ''}
                    />

                    <View className='mt-2'>
                        <View className='flex-row justify-between'>
                            <Text className='text-xs text-gray-600'>Receipt #:</Text>
                            <Text className='text-sm font-semibold'>{sale.externalId}</Text>
                        </View>
                        <View className='flex-row justify-between mt-1'>
                            <Text className='text-xs text-gray-600'>Date:</Text>
                            <Text className='text-sm font-semibold'>
                                {generatedAt.toLocaleDateString()}
                            </Text>
                        </View>
                        <View className='flex-row justify-between mt-1'>
                            <Text className='text-xs text-gray-600'>Time:</Text>
                            <Text className='text-sm font-semibold'>
                                {generatedAt.toLocaleTimeString()}
                            </Text>
                        </View>
                        <View className='flex-row justify-between mt-1'>
                            <Text className='text-xs text-gray-600'>Cashier:</Text>
                            <Text className='text-sm font-semibold'>
                                {capitalizeName(cashierName)}
                            </Text>
                        </View>
                        {saleData.customer &&
                            saleData.customer.name &&
                            saleData.customer.name.trim() !== '' && (
                                <View className='flex-row justify-between mt-1'>
                                    <Text className='text-xs text-gray-600'>Customer:</Text>
                                    <Text className='text-sm font-semibold'>
                                        {capitalizeName(saleData.customer.name)}
                                    </Text>
                                    <Text className='text-sm font-semibold'>
                                        {saleData.customer.phone || ' '}
                                    </Text>
                                </View>
                            )}
                    </View>

                    <View className='border-t border-gray-200 my-3' />

                    <Text className='font-semibold mb-2'>Items Purchased</Text>

                    <ReceiptItems items={items} />

                    <ReceiptTotals
                        subtotal={subtotal}
                        totalDiscount={totalDiscount}
                        total={total}
                    />

                    <View className='border-t border-gray-200 my-3' />

                    <View className='flex-row justify-between items-center'>
                        <Text className='text-xs text-gray-600'>Payment Method:</Text>
                        <View className='px-2 py-1 bg-gray-100 rounded-full flex-row items-center'>
                            <Text className='text-xs ml-2'>{sale.paymentMethod || 'Unknown'}</Text>
                        </View>
                    </View>
                    {(sale.amountOnCredit > 0 || sale.onCredit) && (
                        <View className='flex-row justify-between items-center'>
                            <Text className='text-xs text-gray-600'>Credit:</Text>
                            <Text
                                className={`text-xs ml-2 ${sale.amountOnCredit >= 1 ? 'text-orange-300' : 'text-blue-500'} `}>
                                {selectedStore?.currency || '$'} {sale.amountOnCredit.toFixed(2)}
                            </Text>
                        </View>
                    )}

                    {/* Payments / splits breakdown */}
                    {saleData.payments && saleData.payments.length > 0 && (
                        <View className='mt-3'>
                            {/* <View className='flex-row justify-between items-center'>
                                <Text className='text-xs text-gray-600'>Credit:</Text>
                                <View className='px-2 py-1 bg-gray-100 rounded-full flex-row items-center'>
                                    <Text className='text-xs ml-2'>{sale.amountOnCredit}</Text>
                                </View>
                            </View> */}
                            {saleData.payments.map((p) => (
                                <View
                                    key={p.id}
                                    className='flex-row justify-between items-center mt-1'>
                                    <Text className='text-sm'>
                                        {capitalizeName(p.method || '') || 'Unknown'}
                                    </Text>
                                    <View className='flex-row justify-between items-center mt-1'>
                                        <Text className='text-xs/5 font-semibold'>
                                            {selectedStore?.currency || '$'}{' '}
                                            {(p.amount || 0).toFixed(2)}
                                        </Text>
                                        <View
                                            className={`px-2 py-1 ${p.status === 'completed' ? 'bg-green-500' : 'bg-orange-300'} rounded-lg flex-row items-center ml-2`}>
                                            <Text className='text-xs/5 '>{p.status}</Text>
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}

                    <View className='mt-4 items-center'>
                        <ReceiptQRCode
                            payload={{
                                id: sale.externalId || sale.id,
                                total,
                                date: generatedAt.toISOString(),
                                cashier: capitalizeName(cashierName),
                            }}
                            size={(selectedStore as any)?.qrDisplaySize || 48}
                        />

                        <Text className='text-xs text-gray-500 text-center'>
                            {'Thank you for shopping with us!\nCome again soon!'}
                        </Text>
                        <Text className='text-xs text-gray-400 mt-2'>
                            Receipt generated: {generatedAt.toLocaleString()}
                        </Text>
                    </View>

                    <View className='mt-3'>
                        {/* Print button: auto-print when preferred device + autoPrint enabled and connected */}
                        {bluetoothAvailable && (
                            <TouchableOpacity
                                onPress={async () => {
                                    try {
                                        const pref = await printerService.getPreferredPreference();
                                        const conn = printerService.getConnectedDeviceInfo();

                                        // if preferred and already connected and autoPrint => print
                                        if (
                                            pref &&
                                            pref.autoPrint &&
                                            conn &&
                                            conn.id === pref.deviceId
                                        ) {
                                            const customer = await sale?.customer;
                                            const genAt =
                                                generatedAt ||
                                                (sale && sale.createdAt
                                                    ? new Date(sale.createdAt)
                                                    : new Date());
                                            const esc = buildEscPosReceipt({
                                                sale: sale || {},
                                                items: items || [],
                                                store: selectedStore,
                                                cashierName: cashierName,
                                                generatedAt: genAt,
                                                currency: selectedStore?.currency || '$',
                                                customer: {
                                                    name: customer?.name || '',
                                                    phone: customer?.phone || '',
                                                    email: customer?.email || '',
                                                },
                                                payments: saleData.payments,
                                            });
                                            await printerService.printRaw(esc);
                                            Toast.show({
                                                type: 'success',
                                                text1: 'Printed',
                                                text2: 'Sent to printer',
                                                position: 'bottom',
                                            });
                                            return;
                                        }

                                        // if preferred exists and autoConnect is enabled, try to connect
                                        if (pref && pref.autoConnect && pref.deviceId) {
                                            setConnectingPrinter(true);
                                            try {
                                                await printerService.connect(pref.deviceId);
                                                // connected
                                                const customer = await sale?.customer;
                                                const genAt =
                                                    generatedAt ||
                                                    (sale && sale.createdAt
                                                        ? new Date(sale.createdAt)
                                                        : new Date());
                                                const esc = buildEscPosReceipt({
                                                    sale: sale || {},
                                                    items: items || [],
                                                    store: selectedStore,
                                                    cashierName: cashierName,
                                                    generatedAt: genAt,
                                                    currency: selectedStore?.currency || '$',
                                                    customer: {
                                                        name: customer?.name || '',
                                                        phone: customer?.phone || '',
                                                        email: customer?.email || '',
                                                    },
                                                    payments: saleData.payments,
                                                });
                                                if (pref.autoPrint) {
                                                    await printerService.printRaw(esc);
                                                    Toast.show({
                                                        type: 'success',
                                                        text1: 'Printed',
                                                        text2: 'Sent to printer',
                                                        position: 'bottom',
                                                    });
                                                    return;
                                                }
                                            } catch (e: any) {
                                                // connection failed; fall back to showing modal
                                                console.warn(
                                                    'Auto-connect failed',
                                                    e.message || String(e),
                                                );
                                                Toast.show({
                                                    type: 'error',
                                                    text1: 'Connect failed',
                                                    text2: e.message || String(e),
                                                    position: 'bottom',
                                                });
                                                setShowPrinterModal(true);
                                            } finally {
                                                setConnectingPrinter(false);
                                            }
                                        }

                                        setShowPrinterModal(true);
                                    } catch (e: any) {
                                        Toast.show({
                                            type: 'error',
                                            text1: 'Print failed',
                                            text2: e.message || String(e),
                                            position: 'bottom',
                                        });
                                    }
                                }}
                                className={`mt-2 px-4 py-2 rounded-lg items-center ${bluetoothAvailable ? 'bg-blue-600' : 'bg-gray-300'}`}
                                disabled={!bluetoothAvailable || connectingPrinter}>
                                {connectingPrinter ? (
                                    <ActivityIndicator color='#fff' />
                                ) : (
                                    <Text
                                        className={`font-semibold ${bluetoothAvailable ? 'text-white' : 'text-gray-600'}`}>
                                        Print Receipt
                                    </Text>
                                )}
                            </TouchableOpacity>
                        )}
                        {/* Share as PDF button */}
                        <TouchableOpacity
                            onPress={async () => {
                                try {
                                    setSharing(true);
                                    const html = await buildHtml();
                                    const { uri } = await Print.printToFileAsync({
                                        html: html as string,
                                    });

                                    // ensure sharing is available
                                    const available = await Sharing.isAvailableAsync();
                                    if (!available) {
                                        Toast.show({
                                            type: 'error',
                                            text1: 'Share unavailable',
                                            text2: 'Sharing is not available on this device',
                                            position: 'bottom',
                                        });
                                        setSharing(false);
                                        return;
                                    }

                                    await Sharing.shareAsync(uri, { mimeType: 'application/pdf' });
                                    setSharing(false);
                                } catch (e: any) {
                                    console.error('Share failed', e);
                                    Toast.show({
                                        type: 'error',
                                        text1: 'Share failed',
                                        text2: e.message || String(e),
                                        position: 'bottom',
                                    });
                                    setSharing(false);
                                }
                            }}
                            className='mt-2 px-4 py-2 rounded-lg items-center bg-gray-800'
                            disabled={sharing}>
                            {sharing ? (
                                <ActivityIndicator color='#fff' />
                            ) : (
                                <Text className='font-semibold text-white'>Share PDF</Text>
                            )}
                        </TouchableOpacity>
                        {!bluetoothAvailable && (
                            <View className='mt-2'>
                                <Text className='text-xs text-red-500'>
                                    Bluetooth is unavailable. Enable Bluetooth to print receipts.
                                </Text>
                                <TouchableOpacity
                                    className='mt-2 px-4 py-2 bg-blue-600 rounded-lg items-center'
                                    onPress={promptEnableBluetooth}>
                                    <Text style={{ color: '#fff' }}>Enable Bluetooth</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                        <TouchableOpacity
                            className='mt-2 px-4 py-2 bg-green-600 rounded-lg items-center'
                            onPress={completeTransaction}>
                            <Text style={{ color: '#fff' }}>Complete Transaction</Text>
                        </TouchableOpacity>
                    </View>

                    <PrinterModal
                        visible={showPrinterModal}
                        onClose={() => setShowPrinterModal(false)}
                        sale={sale}
                        items={items}
                        buildHtml={buildHtml}
                        store={selectedStore!}
                        cashierName={cashierName}
                        currency={selectedStore?.currency || '$'}
                        generatedAt={generatedAt}
                        payments={saleData.payments}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ReceiptPage;
