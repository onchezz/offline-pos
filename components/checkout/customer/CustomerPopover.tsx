import Customer from '@/db/models/customers';
import { Feather } from '@expo/vector-icons';
import React, { useMemo, useRef, useState } from 'react';
import {
    Dimensions,
    findNodeHandle,
    LayoutRectangle,
    Modal,
    Pressable,
    ScrollView,
    Text,
    UIManager,
    View,
} from 'react-native';
import CustomerSearch from './CustomerSearch';

interface Props {
    customer?: Customer | null;
    query: string;
    results: Customer[];
    onQueryChange: (q: string) => void;
    onSelectCustomer: (c: Customer | null) => void;
    // onCreateCustomer: (data: { name?: string; phone?: string; email?: string }) => void;
    onOpenAddCustomerModal: () => void;
}

const POPOVER_WIDTH = 320;

const CustomerPopover: React.FC<Props> = ({
    customer,
    query,
    results,
    onQueryChange,
    onSelectCustomer,
    onOpenAddCustomerModal,
}) => {
    const [open, setOpen] = useState(false);

    const [buttonLayout, setButtonLayout] = useState<LayoutRectangle | null>(null);
    const [popoverPosition, setPopoverPosition] = useState<'above' | 'below'>('below');
    const buttonRef = useRef<View>(null);

    const screen = Dimensions.get('window');

    const visibleResults = useMemo(() => {
        return results.filter(
            (c) => c.name?.toLowerCase().includes(query.toLowerCase()) || c.phone?.includes(query),
        );
    }, [results, query]);

    const measureButton = () => {
        if (buttonRef.current) {
            const handle = findNodeHandle(buttonRef.current);
            if (handle)
                UIManager.measure(handle, (x, y, width, height, pageX, pageY) => {
                    const spaceBelow = screen.height - (pageY + height);
                    const spaceAbove = pageY;
                    setPopoverPosition(
                        spaceBelow < 320 && spaceAbove > spaceBelow ? 'above' : 'below',
                    );
                    setButtonLayout({ x: pageX, y: pageY, width, height });
                });
        }
    };

    const popoverY =
        buttonLayout &&
        (popoverPosition === 'below'
            ? buttonLayout.y + buttonLayout.height + 6
            : Math.max(10, buttonLayout.y - 320));

    const popoverX =
        buttonLayout && Math.min(Math.max(10, buttonLayout.x), screen.width - POPOVER_WIDTH - 15);

    return (
        <>
            {/* --- Trigger Button --- */}
            <Pressable
                ref={buttonRef}
                onLayout={measureButton}
                onPress={() => {
                    measureButton();
                    setOpen(true);
                }}
                className='flex-row items-center px-3 py-1 border border-gray-100 rounded-lg bg-white'>
                <Feather
                    name={customer?.name ? 'user' : 'user-plus'}
                    size={15}
                    color='#000'
                    style={{ marginRight: 6 }}
                />
                <Text
                    className='text-black text-sm font-medium'
                    numberOfLines={1}
                    ellipsizeMode='tail'>
                    {customer?.name ?? 'Customer'}
                </Text>
            </Pressable>

            {/* --- Popover Content --- */}
            {open && buttonLayout && (
                <Modal
                    visible
                    transparent
                    animationType='fade'
                    onRequestClose={() => setOpen(false)}>
                    <Pressable style={{ flex: 1 }} onPress={() => setOpen(false)}>
                        <View
                            style={{
                                position: 'absolute',
                                top: popoverY,
                                left: popoverX,
                                width: POPOVER_WIDTH - 20,
                                backgroundColor: '#fff',
                                borderRadius: 10,
                                padding: 12,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 3 },
                                shadowOpacity: 0.2,
                                shadowRadius: 6,
                                elevation: 6,
                            }}>
                            <CustomerSearch
                                customerSearchQuery={query}
                                setCustomerSearchQuery={onQueryChange}
                                searchResults={results}
                                selectCustomer={(c: Customer) => {
                                    onSelectCustomer(c);
                                    setOpen(false);
                                }}
                                setShowAddCustomerModal={onOpenAddCustomerModal}
                            />

                            {/* --- Selected Customer --- */}
                            {customer && (
                                <View className='border rounded-lg p-3 bg-white mb-3 border-gray-100'>
                                    <View className='flex-row justify-between items-center'>
                                        <View className='flex-row items-center gap-2'>
                                            <Feather name='user' size={16} color='#000' />
                                            <View>
                                                <Text className='font-medium text-sm text-black'>
                                                    {customer.name}
                                                </Text>
                                                <Text className='text-xs text-gray-500'>
                                                    {customer.phone}
                                                </Text>
                                            </View>
                                        </View>
                                        <Pressable
                                            onPress={() => onSelectCustomer(null)}
                                            className='px-2 py-1 rounded'>
                                            <Text className='text-red-400 text-xs font-medium'>
                                                Clear
                                            </Text>
                                        </Pressable>
                                    </View>
                                    {customer.currentBalance > 0 && (
                                        <Text className='text-xs text-orange-600 mt-2'>
                                            Current Balance: ${customer.currentBalance.toFixed(2)}
                                        </Text>
                                    )}
                                </View>
                            )}
                            {/* --- Search Results --- */}
                            {!customer && query.length > 0 && (
                                <>
                                    {visibleResults.length > 0 ? (
                                        <ScrollView className='max-h-48  '>
                                            {visibleResults.slice(0, 5).map((c) => (
                                                <Pressable
                                                    key={c.id}
                                                    onPress={() => {
                                                        onSelectCustomer(c);
                                                        setOpen(false);
                                                    }}
                                                    className='border rounded-lg p-3 bg-white mb-3 border-gray-200 active:bg-gray-100'>
                                                    <Text className='font-medium text-sm text-slate-800'>
                                                        {c.name}
                                                    </Text>
                                                    <Text className='text-xs text-gray-500'>
                                                        {c.phone}
                                                    </Text>
                                                    {c.currentBalance > 0 && (
                                                        <Text className='text-xs text-orange-600 mt-1'>
                                                            Balance: ${c.currentBalance.toFixed(2)}
                                                        </Text>
                                                    )}
                                                </Pressable>
                                            ))}
                                        </ScrollView>
                                    ) : (
                                        <Text className='text-sm text-gray-500 text-center py-2'>
                                            No customers found. Add new above.
                                        </Text>
                                    )}
                                </>
                            )}
                        </View>
                    </Pressable>
                </Modal>
            )}
        </>
    );
};

export default CustomerPopover;
