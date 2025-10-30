import { Feather } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import {
    Dimensions,
    findNodeHandle,
    LayoutRectangle,
    Modal,
    Pressable,
    Text,
    TextInput,
    TouchableOpacity,
    UIManager,
    View,
} from 'react-native';

interface Props {
    currentMethod?: string;
    currentDetails?: any;
    onApply: (method: string, details?: any) => void;
    onRemove?: () => void;
}

const POPOVER_WIDTH = 300;

const PaymentPopover: React.FC<Props> = ({ currentMethod, currentDetails, onApply, onRemove }) => {
    const [open, setOpen] = useState(false);
    const [method, setMethod] = useState<string>(currentMethod || 'mpesa');
    const [input, setInput] = useState<string>(
        currentDetails && typeof currentDetails === 'object' && currentDetails.value
            ? String(currentDetails.value)
            : currentDetails || '',
    );

    const [buttonLayout, setButtonLayout] = useState<LayoutRectangle | null>(null);
    const [popoverPosition, setPopoverPosition] = useState<'above' | 'below'>('below');
    const buttonRef = useRef<View>(null);
    const screen = Dimensions.get('window');

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

    const apply = () => {
        const details = input ? { value: input } : undefined;
        onApply(method, details);
        setOpen(false);
    };

    const remove = () => {
        onRemove && onRemove();
        setInput('');
        setOpen(false);
    };

    return (
        <>
            <Pressable
                ref={buttonRef}
                onLayout={measureButton}
                onPress={() => {
                    measureButton();
                    setOpen(true);
                }}
                className='ml-2 p-2 bg-gray-100 rounded-md'>
                <Feather name='credit-card' size={18} color='#444' />
            </Pressable>

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
                                width: POPOVER_WIDTH,
                                backgroundColor: '#fff',
                                borderRadius: 10,
                                padding: 12,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 3 },
                                shadowOpacity: 0.2,
                                shadowRadius: 6,
                                elevation: 6,
                            }}>
                            <Text className='text-gray-900 font-semibold mb-2'>
                                Payment Details
                            </Text>

                            <View className='flex-row mb-3 space-x-2'>
                                <TouchableOpacity
                                    onPress={() => setMethod('mpesa')}
                                    className={`flex-1 px-3 py-2 rounded-lg border ${
                                        method === 'mpesa' ? 'bg-black' : 'bg-white border-gray-200'
                                    }`}>
                                    <Text
                                        className={`text-center ${method === 'mpesa' ? 'text-white' : 'text-gray-500'}`}>
                                        M-Pesa
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => setMethod('card')}
                                    className={`flex-1 px-3 py-2 rounded-lg border ${
                                        method === 'card' ? 'bg-black' : 'bg-white border-gray-200'
                                    }`}>
                                    <Text
                                        className={`text-center ${method === 'card' ? 'text-white' : 'text-gray-500'}`}>
                                        Card
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => setMethod('cash')}
                                    className={`flex-1 px-3 py-2 rounded-lg border ${
                                        method === 'cash' ? 'bg-black' : 'bg-white border-gray-200'
                                    }`}>
                                    <Text
                                        className={`text-center ${method === 'cash' ? 'text-white' : 'text-gray-500'}`}>
                                        Cash
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <View className='mb-2'>
                                <Text className='text-sm text-gray-600 mb-1'>Method Details</Text>
                                <View className='bg-gray-50 rounded-lg border border-gray-200 px-2 py-1'>
                                    <TextInput
                                        className='text-base'
                                        placeholder={
                                            method === 'mpesa'
                                                ? 'M-Pesa number'
                                                : method === 'card'
                                                  ? 'Card last4'
                                                  : 'Note'
                                        }
                                        value={input}
                                        onChangeText={setInput}
                                        keyboardType={method === 'mpesa' ? 'phone-pad' : 'default'}
                                    />
                                </View>
                            </View>

                            <View className='flex-row space-x-2'>
                                <TouchableOpacity
                                    onPress={apply}
                                    className='flex-1 bg-black py-2 rounded-lg items-center'>
                                    <Text className='text-white font-medium'>Apply</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={remove}
                                    className='flex-1 bg-white border border-gray-200 py-2 rounded-lg items-center'>
                                    <Text className='text-gray-700 font-medium'>Remove</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Pressable>
                </Modal>
            )}
        </>
    );
};

export default PaymentPopover;
