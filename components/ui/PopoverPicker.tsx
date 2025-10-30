import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    Dimensions,
    findNodeHandle,
    KeyboardAvoidingView,
    LayoutRectangle,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    UIManager,
    View,
} from 'react-native';

interface PopoverPickerProps {
    items: string[];
    selected?: string | null;
    placeholder?: string;
    triggerClassName?: string;
    textClassName?: string;
    searchPlaceholder?: string;
    onSelect: (item: string) => void;
    autoFocusSearch?: boolean;
    width?: number;
}

const DEFAULT_WIDTH = 320;

const PopoverPicker: React.FC<PopoverPickerProps> = ({
    items,
    selected,
    placeholder = 'Select',
    triggerClassName = 'bg-gray-50 rounded-lg px-4 py-3',
    textClassName = 'text-gray-900',
    searchPlaceholder = 'Search',
    onSelect,
    autoFocusSearch = true,
    width = DEFAULT_WIDTH,
}) => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [buttonLayout, setButtonLayout] = useState<LayoutRectangle | null>(null);
    const [popoverPosition, setPopoverPosition] = useState<'above' | 'below'>('below');
    const buttonRef = useRef<View>(null);
    const screen = Dimensions.get('window');
    const inputRef = useRef<TextInput>(null);

    const filtered = useMemo(() => {
        if (!query) return items;
        return items.filter((i) => i.toLowerCase().includes(query.toLowerCase()));
    }, [items, query]);

    const measureButton = () => {
        if (buttonRef.current) {
            const handle = findNodeHandle(buttonRef.current);
            if (handle)
                UIManager.measure(handle, (x, y, width_, height, pageX, pageY) => {
                    const spaceBelow = screen.height - (pageY + height);
                    const spaceAbove = pageY;
                    setPopoverPosition(
                        spaceBelow < 320 && spaceAbove > spaceBelow ? 'above' : 'below',
                    );
                    setButtonLayout({ x: pageX, y: pageY, width: width_, height });
                });
        }
    };

    const popoverY =
        buttonLayout &&
        (popoverPosition === 'below'
            ? buttonLayout.y + buttonLayout.height + 6
            : Math.max(10, buttonLayout.y - 320));

    const popoverX =
        buttonLayout && Math.min(Math.max(10, buttonLayout.x), screen.width - width - 15);

    useEffect(() => {
        if (open && autoFocusSearch && inputRef.current) {
            // small delay so modal mounts first
            setTimeout(() => inputRef.current && inputRef.current.focus(), 50);
        }
    }, [open, autoFocusSearch]);

    return (
        <>
            <Pressable
                ref={buttonRef}
                onLayout={measureButton}
                onPress={() => {
                    measureButton();
                    setOpen(true);
                }}
                className={triggerClassName}>
                <Text className={textClassName}>{selected || placeholder}</Text>
            </Pressable>

            {open && buttonLayout && (
                <Modal
                    visible
                    transparent
                    animationType='fade'
                    onRequestClose={() => setOpen(false)}>
                    <Pressable style={{ flex: 1 }} onPress={() => setOpen(false)} />

                    <View
                        style={{
                            position: 'absolute',
                            top: popoverY,
                            left: popoverX,
                            width,
                            backgroundColor: '#fff',
                            borderRadius: 10,
                            padding: 12,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 3 },
                            shadowOpacity: 0.2,
                            shadowRadius: 6,
                            elevation: 6,
                        }}>
                        <KeyboardAvoidingView
                            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                            keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}>
                            <Text className='text-lg font-semibold mb-2'>{placeholder}</Text>

                            <View className='mb-2'>
                                <TextInput
                                    ref={inputRef}
                                    value={query}
                                    onChangeText={setQuery}
                                    placeholder={searchPlaceholder}
                                    placeholderTextColor='#9CA3AF'
                                    className='bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900'
                                />
                            </View>

                            <ScrollView className='max-h-48 mb-2'>
                                {filtered.length > 0 ? (
                                    filtered.map((it) => (
                                        <TouchableOpacity
                                            key={it}
                                            onPress={() => {
                                                onSelect(it);
                                                setOpen(false);
                                                setQuery('');
                                            }}
                                            className='py-3 border-b border-gray-100'>
                                            <Text className='text-gray-900'>{it}</Text>
                                        </TouchableOpacity>
                                    ))
                                ) : (
                                    <Text className='text-sm text-gray-500 py-2'>
                                        {'No results'}
                                    </Text>
                                )}
                            </ScrollView>

                            <View className='flex-row space-x-2'>
                                <TouchableOpacity
                                    onPress={() => {
                                        setOpen(false);
                                        setQuery('');
                                    }}
                                    className='flex-1 px-3 py-2 bg-gray-100 rounded-lg items-center'>
                                    <Text>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </KeyboardAvoidingView>
                    </View>
                </Modal>
            )}
        </>
    );
};

export default PopoverPicker;
