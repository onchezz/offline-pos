import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { CustomButton } from './BasicUIComponents';
import { ModalBase } from './ModalBase';

export const TimePickerModal: React.FC<{
    visible: boolean;
    onClose: () => void;
    value: string;
    onConfirm: (value: string) => void;
}> = ({ visible, onClose, value, onConfirm }) => {
    const parseTime = (timeStr: string) => {
        const [h, m] = timeStr.split(':').map(Number);
        const isPM = h >= 12;
        const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
        return {
            hour: displayHour.toString().padStart(2, '0'),
            minute: m.toString().padStart(2, '0'),
            period: isPM ? 'PM' : 'AM',
        };
    };

    const initialTime = parseTime(value);
    const [hour, setHour] = useState(initialTime.hour);
    const [minute, setMinute] = useState(initialTime.minute);
    const [period, setPeriod] = useState<'AM' | 'PM'>(initialTime.period as 'AM' | 'PM');

    const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
    const minutes = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0'));

    const handleConfirm = () => {
        let h = parseInt(hour);
        if (period === 'PM' && h !== 12) h += 12;
        if (period === 'AM' && h === 12) h = 0;
        const time24 = `${h.toString().padStart(2, '0')}:${minute}`;
        onConfirm(time24);
        onClose();
    };

    return (
        <ModalBase visible={visible} onClose={onClose} title='Select Time'>
            <View className='py-4 items-center'>
                <Text className='text-3xl font-normal text-gray-900'>
                    {hour}:{minute} {period}
                </Text>
            </View>

            <View className='flex-row gap-2 mb-4 px-4'>
                <View className='flex-1'>
                    <Text className='text-xs text-gray-500 text-center mb-1'>Hour</Text>
                    <ScrollView className='h-36 border border-gray-200 rounded-md p-1'>
                        <View className='flex-row flex-wrap gap-1'>
                            {hours.map((h) => (
                                <TouchableOpacity
                                    key={h}
                                    className={`flex-1 min-w-[30%] aspect-square rounded justify-center items-center ${
                                        hour === h ? 'bg-gray-900' : 'bg-gray-50'
                                    }`}
                                    onPress={() => setHour(h)}>
                                    <Text
                                        className={`text-sm ${
                                            hour === h ? 'text-white' : 'text-gray-900'
                                        }`}>
                                        {h}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                </View>

                <View className='flex-1'>
                    <Text className='text-xs text-gray-500 text-center mb-1'>Minute</Text>
                    <ScrollView className='h-36 border border-gray-200 rounded-md p-1'>
                        <View className='flex-row flex-wrap gap-1'>
                            {minutes.map((m) => (
                                <TouchableOpacity
                                    key={m}
                                    className={`flex-1 min-w-[30%] aspect-square rounded justify-center items-center ${
                                        minute === m ? 'bg-gray-900' : 'bg-gray-50'
                                    }`}
                                    onPress={() => setMinute(m)}>
                                    <Text
                                        className={`text-sm ${
                                            minute === m ? 'text-white' : 'text-gray-900'
                                        }`}>
                                        {m}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                </View>

                <View style={{ flex: 0.8 }}>
                    <Text className='text-xs text-gray-500 text-center mb-1'>Period</Text>
                    <View className='gap-1'>
                        {(['AM', 'PM'] as const).map((p) => (
                            <TouchableOpacity
                                key={p}
                                className={`h-[70px] rounded justify-center items-center ${
                                    period === p ? 'bg-gray-900' : 'bg-gray-50'
                                }`}
                                onPress={() => setPeriod(p)}>
                                <Text
                                    className={`text-sm ${
                                        period === p ? 'text-white' : 'text-gray-900'
                                    }`}>
                                    {p}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </View>

            <View className='px-4 pb-4'>
                <CustomButton onPress={handleConfirm} title='Confirm' />
            </View>
        </ModalBase>
    );
};
