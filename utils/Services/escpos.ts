// Small ESC/POS generator for receipts.
// Produces a Uint8Array containing ESC/POS commands and UTF-8 text.

import Payment from '@/db/models/payments';
import Store from '@/db/models/stores';
import { ItemWithProduct, SaleWithExtras } from '@/types';
import { Buffer } from 'buffer';

const ESC = 0x1b;
const GS = 0x1d;

function align(n: number) {
    return Uint8Array.from([ESC, 0x61, n]); // ESC a n
}

function font(n = 0) {
    return Uint8Array.from([ESC, 0x4d, n]);
}

function charSize(width = 1, height = 1) {
    // GS ! n  : Select character size
    // n = (height-1)<<4 | (width-1), width/height in 1..8
    const w = Math.max(1, Math.min(8, Math.floor(width)));
    const h = Math.max(1, Math.min(8, Math.floor(height)));
    const n = ((h - 1) << 4) | (w - 1);
    return Uint8Array.from([GS, 0x21, n]);
}

function lineSpacing(dots = 24) {
    // ESC 3 n : set line spacing to n dots (default often 30)
    return Uint8Array.from([ESC, 0x33, dots]);
}

function bold(on = true) {
    return Uint8Array.from([ESC, 0x45, on ? 1 : 0]); // ESC E n
}

function init() {
    return Uint8Array.from([ESC, 0x40]); // ESC @
}

function cut() {
    // GS V 0
    return Uint8Array.from([GS, 0x56, 0x00]);
}

function newline(count = 1) {
    return Uint8Array.from(new Array(count).fill(0x0a));
}

function textBytes(s: string) {
    return new Uint8Array(Buffer.from(s, 'utf8'));
}

function padColumns(left: string, right: string, width = 32) {
    const leftClean = left.replace(/\n/g, ' ');
    const rightClean = right.replace(/\n/g, ' ');
    const space = Math.max(width - leftClean.length - rightClean.length, 1);
    return leftClean + ' '.repeat(space) + rightClean;
}

/**
 * Build native ESC/POS QR commands for a text payload.
 * Uses GS ( k sequences to store data and print.
 */
function qrCommands(text: string, moduleSize = 2): Uint8Array[] {
    const cmds: Uint8Array[] = [];
    // Select model 2
    cmds.push(Uint8Array.from([GS, 0x28, 0x6b, 0x04, 0x00, 0x31, 0x41, 0x32, 0x00]));
    // Set module size (6)
    // clamp moduleSize to the valid 1..8 range
    const mSize = Math.min(8, Math.max(1, Math.floor(moduleSize)));
    cmds.push(Uint8Array.from([GS, 0x28, 0x6b, 0x03, 0x00, 0x31, 0x43, mSize]));
    // Set error correction level to M
    cmds.push(Uint8Array.from([GS, 0x28, 0x6b, 0x03, 0x00, 0x31, 0x45, 0x31]));

    const data = Buffer.from(text, 'utf8');
    const pL = (data.length + 3) & 0xff;
    const pH = ((data.length + 3) >> 8) & 0xff;
    // Store data
    cmds.push(Uint8Array.from([GS, 0x28, 0x6b, pL, pH, 0x31, 0x50, 0x30]));
    cmds.push(new Uint8Array(data));
    // Print
    cmds.push(Uint8Array.from([GS, 0x28, 0x6b, 0x03, 0x00, 0x31, 0x51, 0x30]));
    return cmds;
}

export default function buildEscPosReceipt({
    sale,
    items,
    store,
    cashierName,
    generatedAt,
    currency = '$',
    width = 42,
    customer,
    payments,
}: {
    sale: SaleWithExtras;
    items: ItemWithProduct[];
    store: Store | null;
    cashierName?: string;
    generatedAt?: Date;
    currency?: string;
    customer?: {
        name?: string;
        phone?: string;
        email?: string;
    };
    payments: Payment[];
    width?: number;
}): Uint8Array {
    const parts: Uint8Array[] = [];
    parts.push(init());

    // Font B typically prints narrower characters; charSize(1,1) is the base (smallest) size
    parts.push(font(1));
    parts.push(charSize(1, 1));
    parts.push(lineSpacing(24));

    // Header
    parts.push(align(1)); // center
    parts.push(bold(true));
    const headerName = store && store.name ? String(store.name) : ' STORE';
    parts.push(textBytes(headerName.toUpperCase() + '\n'));
    parts.push(bold(false));

    // print store contact info (email and location) if present
    if (store) {
        const emailLine = store.email ? String(store.email).trim() : '';
        let locationLine = '';
        if (store.address) {
            locationLine = String(store.address).trim();
        } else if (store.phone) {
            locationLine = String(store.phone).trim();
        }
        if (emailLine) parts.push(textBytes(emailLine + '\n'));
        if (locationLine) parts.push(textBytes(locationLine + '\n'));
        if (emailLine || locationLine) parts.push(newline());
    }
    parts.push(newline());
    // Meta
    parts.push(align(0)); // left
    parts.push(textBytes(`Receipt #: ${sale.externalId || sale.id || ''}\n`));
    parts.push(
        textBytes(
            `Date: ${generatedAt ? generatedAt.toLocaleDateString() : ''} ${generatedAt ? generatedAt.toLocaleTimeString() : ''}\n`,
        ),
    );
    parts.push(textBytes(`Cashier: ${cashierName || 'N/A'}\n`));
    // show customer only when a customer name is provided (hide placeholder ids)
    if (customer && customer.name && String(customer.name).trim() !== '') {
        parts.push(textBytes(`Customer: ${customer.name}\n`));
    }

    parts.push(newline());
    parts.push(textBytes('Items\n'));
    parts.push(textBytes('-'.repeat(width) + '\n'));

    // Items: normalize possible field names (unitPrice, unit_price, price, totalPrice, total_price)
    items.forEach((it: any) => {
        const pname =
            (it.product && (it.product as any).name) ||
            (it.item && (it.item as any).name) ||
            it.name ||
            '';
        const name = String(pname).slice(0, width);
        const qty = (it.item && (it.item as any).quantity) || it.quantity || 1;
        const unitPrice =
            (it.item &&
                ((it.item as any).unitPrice ||
                    (it.item as any).unit_price ||
                    (it.item as any).price)) ||
            it.unitPrice ||
            it.price ||
            0;
        const totalLine =
            (it.item && ((it.item as any).totalPrice || (it.item as any).total_price)) ||
            it.totalPrice ||
            unitPrice * qty ||
            0;

        // print main line: use Font A + bold so main price stands out
        parts.push(font(1));
        parts.push(bold(true));
        const line = padColumns(name, `${currency} ${Number(totalLine || 0).toFixed(2)}`, width);
        parts.push(textBytes(line + '\n'));
        parts.push(bold(false));

        // switch to narrower font for qty/discount sublines so they appear smaller
        parts.push(font(1));
        // per-item discount (if present) or original price
        const discount = (it.item && (it.item as any).discount) || it.discount || 0;
        const origPrice =
            (it.item && ((it.item as any).origPrice || (it.item as any).originalPrice)) ||
            it.origPrice ||
            0;

        // print qty/unit price on its own smaller indented line
        const unitLine = `${qty} x ${currency}${Number(unitPrice || 0).toFixed(2)}`;

        const lineDiscount = `discount (-${currency}${Number(discount).toFixed(2)})\n`;
        // print qty/unit price on its own smaller indented line
        const unitColumns = padColumns(
            unitLine,
            discount && discount > 0 ? lineDiscount : '',
            width,
        );

        parts.push(textBytes(unitColumns + '\n'));

        if (discount && discount > 0) {
            // smaller-looking discount line (narrow font, non-bold, indented)
            parts.push(
                textBytes(
                    `  ${currency}${Number(discount).toFixed(2)} off (-${currency}${Number(discount).toFixed(2)})\n`,
                ),
            );
        } else if (origPrice && origPrice > totalLine) {
            parts.push(textBytes(`  was ${currency}${Number(origPrice).toFixed(2)}\n`));
        }

        // keep font(1) for next item by default
    });

    parts.push(textBytes('-'.repeat(width) + '\n'));

    parts.push(
        textBytes(
            padColumns('Subtotal', `${currency} ${Number(sale.subtotal || 0).toFixed(2)}`, width) +
                '\n',
        ),
    );
    if (sale.discountAmount && sale.discountAmount > 0) {
        parts.push(
            textBytes(
                padColumns(
                    'Total Discount',
                    `${currency} ${Number(sale.discountAmount || 0).toFixed(2)}`,
                    width,
                ) + '\n',
            ),
        );
    }
    // Use the narrow font (Font B) for the totals line so columns line up correctly
    // and emphasize using bold rather than switching to a wider font which can cause wrapping.
    parts.push(font(1));
    parts.push(bold(true));
    parts.push(
        textBytes(
            padColumns('TOTAL', `${currency} ${Number(sale.totalAmount || 0).toFixed(2)}`, width) +
                '\n',
        ),
    );
    parts.push(bold(false));

    if (payments) {
        // display a compact Payment Method header; if multiple methods, show 'split'

        parts.push(newline());

        parts.push(newline());
        parts.push(textBytes('Payments\n'));
        payments.forEach((p) => {
            const method = p.method || 'Payment';
            const amt = Number(p.amount || 0);
            parts.push(
                textBytes(padColumns(method, `${currency} ${amt.toFixed(2)}`, width) + '\n'),
            );
            if (p.status) {
                parts.push(textBytes(`status: ${p.status}` + '\n'));
            }
        });
    }

    // indicate if transaction is on credit (heuristic checks)
    try {
        const creditAmt = Number(sale.amountOnCredit || 0);
        const isCreditFlag = !!(sale.onCredit || creditAmt > 0 || sale.amountOnCredit > 0);
        if (isCreditFlag) {
            parts.push(newline());
            parts.push(
                textBytes(
                    padColumns('Credit', `${currency} ${creditAmt.toFixed(2)}`, width) + '\n',
                ),
            );
        }
    } catch {
        // ignore
    }

    parts.push(newline(1));
    parts.push(align(1));
    // Append QR (native ESC/POS) with main payload
    try {
        const qrPayload = JSON.stringify({
            id: sale.externalId || sale.id,
            total: sale.totalAmount || 0,
            date: generatedAt ? generatedAt.toISOString() : '',
            cashier: cashierName || '',
        });
        const moduleSize =
            store && (store as any).qrModuleSize ? Number((store as any).qrModuleSize) : 2;
        const qrCmds = qrCommands(qrPayload, moduleSize);
        qrCmds.forEach((c) => parts.push(c));
        // parts.push(newline(2));
    } catch {
        // ignore QR errors
    }

    parts.push(textBytes('Thank you for shopping with us\n Come again soon!\n'));
    parts.push(newline(3));
    parts.push(cut());

    // concat
    const totalLen = parts.reduce((s, p) => s + p.length, 0);
    const out = new Uint8Array(totalLen);
    let offset = 0;
    parts.forEach((p) => {
        out.set(p, offset);
        offset += p.length;
    });
    return out;
}
