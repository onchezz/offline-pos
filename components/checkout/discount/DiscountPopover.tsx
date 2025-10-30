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
    label?: string;
    currentDiscount?: number;
    currentMode?: 'percent' | 'amount';
    lineTotal: number;
    onApply: (discountAmount: number, mode: 'percent' | 'amount') => void;
    onRemove: () => void;
}

const POPOVER_WIDTH = 180;

const DiscountPopover: React.FC<Props> = ({
    label = 'Discount',
    currentDiscount = 0,
    currentMode = 'amount',
    lineTotal,
    onApply,
    onRemove,
}) => {
    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState<'percent' | 'amount'>(currentMode);
    const [input, setInput] = useState<string>(currentDiscount ? currentDiscount.toString() : '');

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
        buttonLayout && Math.min(Math.max(10, buttonLayout.x), screen.width - POPOVER_WIDTH - 30);

    const applyDiscount = () => {
        const parsed = parseFloat(input);
        if (isNaN(parsed) || parsed < 0) return;

        let final = 0;
        if (mode === 'percent') {
            final = (parsed / 100) * lineTotal;
        } else {
            final = parsed;
        }

        final = Math.min(final, lineTotal);
        onApply(final, mode);
        setOpen(false);
    };

    const remove = () => {
        onRemove();
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
                className='flex-row items-center  border p-1.5  border-gray-300 rounded-md bg-black'>
                <Feather name={currentDiscount > 0 ? 'tag' : 'tag'} size={10} color='#FFF' />
                {/* <Text
                    className='text-black text-xs/6 font-thin ml-2'
                    numberOfLines={1}
                    ellipsizeMode='tail'>
                    {label}
                </Text> */}
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
                                padding: 10,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 3 },
                                shadowOpacity: 0.2,
                                shadowRadius: 6,
                                elevation: 6,
                            }}>
                            <Text className='text-gray-900 font-semibold mb-2'>{label}</Text>

                            <View className='flex-row space-x-2 mb-2'>
                                <TouchableOpacity
                                    onPress={() => setMode('amount')}
                                    className={`flex-1  px-3 py-2 mr-2 rounded-lg border ${
                                        mode === 'amount' ? 'bg-black' : 'bg-white border-gray-200'
                                    }`}>
                                    <Text
                                        className={`text-center ${mode === 'amount' ? 'text-white' : 'text-gray-500'}`}>
                                        $
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => setMode('percent')}
                                    className={`flex-1 px-3 py-2 rounded-lg border ${
                                        mode === 'percent'
                                            ? 'bg-black border-transparent'
                                            : 'bg-white border-gray-200'
                                    }`}>
                                    <Text
                                        className={`text-center ${mode === 'percent' ? 'text-white' : 'text-gray-500'}`}>
                                        %
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            {/* 
                            <View className='flex flex-row justify-center w-full px-2  bg-gray-50 rounded-lg border border-gray-200'>
                                <TextInput
                                    className=' mb-2 text-sm'
                                    placeholder={mode === 'percent' ? 'Percent e.g. 10' : 'Amount '}
                                    keyboardType='decimal-pad'
                                    value={input}
                                    onChangeText={setInput}
                                />
                                <Feather name='percent' size={12} color='black' className='' />
                            </View> */}
                            <View className='flex-row items-center  bg-gray-50 rounded-lg px-1  mb-1 border border-gray-200 '>
                                <TextInput
                                    className='flex-1 ml-1 text-sm'
                                    placeholderTextColor='#555555'
                                    keyboardType='decimal-pad'
                                    placeholder={mode === 'percent' ? 'Percent e.g. 10' : 'Amount '}
                                    value={input}
                                    onChangeText={setInput}
                                />
                                {mode === 'percent' ? (
                                    <Feather name='percent' size={15} color='#555555' />
                                ) : (
                                    <Feather name='dollar-sign' size={15} color='#555555' />
                                )}
                            </View>

                            <View className='flex-row space-x-2'>
                                <TouchableOpacity
                                    onPress={applyDiscount}
                                    className='flex-1 px-3 py-2 mr-2 bg-black rounded-lg items-center'>
                                    <Text className='text-white text-sm font-medium'>Apply</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={remove}
                                    className='flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg items-center'>
                                    <Text className='text-gray-700 text-sm font-medium'>
                                        Remove
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Pressable>
                </Modal>
            )}
        </>
    );
};

export default DiscountPopover;
