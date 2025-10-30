import { CategoryData, CategoryItem } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Props {
    categories: CategoryItem[];
    formData: any;
    setFormData: (updater: any) => void;
    showCategoryDropdown: boolean;
    setShowCategoryDropdown: (v: boolean) => void;
    showCreateCategory: boolean;
    setShowCreateCategory: (v: boolean) => void;
    newCategoryData: { name: string; icon: string; color: string };
    setNewCategoryData: (updater: any) => void;
    addCategory: (newCategoryData: CategoryData) => Promise<any>;
    loadingCategories: boolean;
    refreshCategories: () => Promise<void>;
    handleCreateCategory: () => Promise<void>;
}

const CategorySelector: React.FC<Props> = ({
    categories,
    formData,
    setFormData,
    showCategoryDropdown,
    setShowCategoryDropdown,
    showCreateCategory,
    setShowCreateCategory,
    newCategoryData,
    setNewCategoryData,
    addCategory,
    loadingCategories,
    refreshCategories,
    handleCreateCategory,
}) => {
    const selectedCategory = categories.find((cat) => cat.id === formData.categoryId);

    const showCreateCategoryForm = () => {
        if (categories.length > 0 && !formData.categoryId) {
            setFormData((prev: any) => ({ ...prev, categoryId: categories[0].id }));
        }
        refreshCategories();
        setShowCategoryDropdown(!showCategoryDropdown);
    };

    return (
        <View className='mb-4'>
            <Text className='text-sm font-medium text-gray-700 mb-1'>
                Category <Text className='text-red-500'>*</Text>
            </Text>
            <TouchableOpacity
                className='bg-gray-100 rounded-lg  text-gray-700 text-baserounded-lg px-3 py-3 flex-row justify-between items-center'
                onPress={showCreateCategoryForm}>
                <Text className={selectedCategory ? 'text-gray-900' : 'text-gray-400'}>
                    {selectedCategory
                        ? `${selectedCategory.icon} ${selectedCategory.name}`
                        : 'Select category'}
                </Text>
                <Ionicons
                    name={showCategoryDropdown ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color='#666'
                />
            </TouchableOpacity>

            {showCategoryDropdown && (
                <View className='border border-gray-300 rounded-lg mt-2 overflow-hidden'>
                    <ScrollView style={{ maxHeight: 200 }}>
                        {categories.map((cat) => (
                            <TouchableOpacity
                                key={cat.id}
                                className={`px-3 py-3 border-b border-gray-200 ${
                                    formData.categoryId === cat.id ? 'bg-blue-50' : ''
                                }`}
                                onPress={() => {
                                    setFormData((prev: any) => ({ ...prev, categoryId: cat.id }));
                                    setShowCategoryDropdown(false);
                                }}>
                                <Text
                                    className={
                                        formData.categoryId === cat.id
                                            ? 'text-blue-600 font-medium'
                                            : 'text-gray-900'
                                    }>
                                    {cat.icon} {cat.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity
                            className='px-3 py-3 bg-gray-50 border-t border-gray-300'
                            onPress={() => {
                                setShowCreateCategory(true);
                                setShowCategoryDropdown(false);
                            }}>
                            <Text className='text-blue-600 font-medium'>
                                <Ionicons name='add-circle' size={16} color='#2563EB' /> Create New
                                Category
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            )}

            {showCreateCategory && (
                <View className='border border-gray-300 rounded-lg mt-2 p-3 bg-gray-50'>
                    <View className='flex-row justify-between items-center mb-3'>
                        <Text className='font-semibold text-gray-900'>Create New Category</Text>
                        <TouchableOpacity onPress={() => setShowCreateCategory(false)}>
                            <Ionicons name='close' size={20} color='#666' />
                        </TouchableOpacity>
                    </View>

                    <View className='mb-3'>
                        <Text className='text-sm font-medium text-gray-700 mb-1'>Name *</Text>
                        <TextInput
                            className='border border-gray-300 rounded-lg px-3 py-2 bg-white'
                            value={newCategoryData.name}
                            onChangeText={(text) =>
                                setNewCategoryData((prev: any) => ({ ...prev, name: text }))
                            }
                            placeholder='Enter category name'
                        />
                    </View>

                    <View className='flex-row gap-3 mb-3'>
                        <View className='flex-1'>
                            <Text className='text-sm font-medium text-gray-700 mb-1'>Icon</Text>
                            <TextInput
                                className='border border-gray-300 rounded-lg px-3 py-2 bg-white'
                                value={newCategoryData.icon}
                                onChangeText={(text) =>
                                    setNewCategoryData((prev: any) => ({ ...prev, icon: text }))
                                }
                                placeholder='📦'
                            />
                        </View>
                        <View className='flex-1'>
                            <Text className='text-sm font-medium text-gray-700 mb-1'>Color</Text>
                            <TextInput
                                className='border border-gray-300 rounded-lg px-3 py-2 bg-white'
                                value={newCategoryData.color}
                                onChangeText={(text) =>
                                    setNewCategoryData((prev: any) => ({ ...prev, color: text }))
                                }
                                placeholder='#6B7280'
                            />
                        </View>
                    </View>

                    <View className='flex-row gap-2'>
                        <TouchableOpacity
                            className='flex-1 bg-gray-200 rounded-lg py-2'
                            onPress={() => {
                                setShowCreateCategory(false);
                                setNewCategoryData({ name: '', icon: '📦', color: '#6B7280' });
                            }}>
                            <Text className='text-center font-medium text-gray-700'>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className={`flex-1 rounded-lg py-2 ${
                                newCategoryData.name.trim() ? 'bg-blue-600' : 'bg-gray-300'
                            }`}
                            onPress={handleCreateCategory}
                            disabled={!newCategoryData.name.trim()}>
                            <Text
                                className={`text-center font-medium ${
                                    newCategoryData.name.trim() ? 'text-white' : 'text-gray-500'
                                }`}>
                                Create
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
};

export default CategorySelector;
