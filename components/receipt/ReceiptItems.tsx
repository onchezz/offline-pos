import React from 'react';
import { Text, View } from 'react-native';

interface Item {
    item: any;
    product: any;
}

interface Props {
    items: Item[];
}

const ReceiptItems: React.FC<Props> = ({ items }) => {
    const formatCurrency = (n: number) => {
        try {
            return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(
                n,
            );
        } catch {
            return `$${n.toFixed(2)}`;
        }
    };

    return (
        <View>
            {items.map(({ item, product }: any) => {
                const name = product?.name || 'Unknown Product';
                const qty = item.quantity || 1;
                const unit = item.unitPrice || 0;
                const discount = item.discount || 0;
                const lineTotal = (item.totalPrice || qty * unit) - discount;

                return (
                    <View key={item.id} className='mb-3'>
                        <View className='flex-row justify-between'>
                            <View className='flex-1 pr-2'>
                                <Text
                                    className='text-sm font-medium text-gray-900'
                                    numberOfLines={1}>
                                    {name}
                                </Text>
                                <Text className='text-xs text-gray-500 mt-0'>
                                    {qty} × {formatCurrency(unit)}
                                </Text>
                                {discount > 0 && (
                                    <Text className='text-xs text-green-600 mt-1'>
                                        {formatCurrency(discount)} off (-{formatCurrency(discount)})
                                    </Text>
                                )}
                            </View>

                            <View className='items-end'>
                                {discount > 0 && (
                                    <Text className='text-xs text-gray-400 line-through'>
                                        {formatCurrency(unit)}
                                    </Text>
                                )}
                                <Text className='text-sm font-bold text-gray-900'>
                                    {formatCurrency(lineTotal)}
                                </Text>
                            </View>
                        </View>
                        <View className='border-t border-gray-100 mt-3' />
                    </View>
                );
            })}
        </View>
    );
};

export default ReceiptItems;
