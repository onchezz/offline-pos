import { useBusiness } from '@/contexts/BusinessContext';
import Category from '@/db/models/categories';
import { CategoryData, CategoryItem, InventoryItemData, ProductData } from '@/types';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import BarcodeUnitInputs from './common/BarcodeUnitInputs';
import CategorySelector from './common/CategorySelector';
import DetailsInputs from './common/DetailsInputs';
import PriceInputs from './common/PriceInputs';
import ProductDetails from './common/ProductDetailsInput';
import ProductModalFooter from './common/ProductModalFooter';
import ProductModalHeader from './common/ProductModalHeader';
import QuantityStockInputs from './common/QuantityStockInputs';

interface AddProductModalProps {
    visible: boolean;
    onClose: () => void;
    onProductAdded?: () => void;
    categories: CategoryItem[];
    addCategory: (newCategoryData: CategoryData) => Promise<Category | undefined>;
    loadingCategories: boolean;
    refreshCategories: () => Promise<void>;
    addProduct: (
        newPoduct: ProductData,
        newInventoryProductData: InventoryItemData,
    ) => Promise<void>;
}

export const ProductModal: React.FC<AddProductModalProps> = ({
    visible,
    onClose,
    addCategory,
    loadingCategories,
    refreshCategories,
    onProductAdded,
    addProduct,
    categories,
}) => {
    const { selectedStore } = useBusiness();
    const [loading, setLoading] = useState(false);

    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [showCreateCategory, setShowCreateCategory] = useState(false);
    const [newCategoryData, setNewCategoryData] = useState({
        name: '',
        icon: '📦',
        color: '#6B7280',
    });

    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        categoryId: '',
        cost: '',
        price: '',
        wholeSalePrice: '',
        barcode: '',
        description: '',
        unit: '',
        quantity: '',
        quantityPerUnit: '',
        minStock: '',
        maxStock: '',
        location: '',
    });

    const handleCreateCategory = async () => {
        try {
            const newCategory = await addCategory(newCategoryData);
            await refreshCategories();
            if (!newCategory) {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'no category created',
                    position: 'top',
                });
                return;
            }

            setFormData((prev) => ({ ...prev, categoryId: newCategory.id }));
            setShowCreateCategory(false);
            setShowCategoryDropdown(false);
            setNewCategoryData({ name: '', icon: '📦', color: '#6B7280' });
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Category created successfully!',
                position: 'top',
            });
        } catch (error) {
            console.error('Error creating category:', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to create category',
                position: 'top',
            });
        }
    };

    // Category dropdown toggling is handled inside the CategorySelector component now.

    const handleSubmit = async () => {
        if (!selectedStore) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'No store selected',
                position: 'top',
            });
            return;
        }
        if (!formData.name.trim()) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Product name is required',
                position: 'top',
            });
            return;
        }

        if (!formData.categoryId) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Please select a category',
                position: 'top',
            });
            return;
        }

        if (!formData.price || parseFloat(formData.price) <= 0) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Please enter a valid price',
                position: 'top',
            });
            return;
        }

        setLoading(true);

        try {
            const newPoduct: ProductData = {
                name: formData.name,
                categoryId: formData.categoryId,
                brand: formData.brand, // Brand field can be added to the form if needed
                barcode: formData.barcode,
                description: formData.description,
                unit: formData.unit || 'pcs',
                quantityPerUnit: formData.quantityPerUnit || '1 pc',
                storeId: selectedStore.id,
                status: 'active',
            };

            const newInventoryProductData: InventoryItemData = {
                quantity: parseFloat(formData.quantity) || 0,
                price: parseFloat(formData.price),
                minStock: parseFloat(formData.minStock) || 0,
                maxStock: parseFloat(formData.maxStock) || 100,
                wholeSalePrice: formData.wholeSalePrice
                    ? parseFloat(formData.wholeSalePrice)
                    : parseFloat(formData.price),
                weightedAvgCost: parseFloat(formData.cost) || 0,
                lastPurchasePrice: parseFloat(formData.cost) || 0,
                location: formData.location,
                productId: '',
                storeId: selectedStore.id,
            };
            await addProduct(newPoduct, newInventoryProductData);

            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Product added successfully!',
                position: 'bottom',
            });
            resetForm();
            onProductAdded?.();
            onClose();
        } catch (error) {
            console.error('Error creating product:', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to create product',
                position: 'bottom',
            });
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            brand: '',
            categoryId: categories.length > 0 ? categories[0].id : '',
            cost: '',
            price: '',
            wholeSalePrice: '',
            barcode: '',
            description: '',
            unit: 'pcs',
            quantity: '',
            quantityPerUnit: '',
            minStock: '',
            maxStock: '',
            location: '',
        });
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    // selectedCategory kept here previously for inline rendering; not needed after refactor

    return (
        <Modal
            visible={visible}
            animationType='slide'
            presentationStyle='pageSheet'
            onRequestClose={handleClose}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}
                style={{ flex: 1 }}>
                <SafeAreaView className='flex-1 bg-white'>
                    <ScrollView
                        className='flex-1 px-3'
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps='handled'
                        keyboardDismissMode='interactive'>
                        <ProductModalHeader
                            title='Add New Product'
                            description='Create a new product in your inventory with all necessary details.'
                            onClose={handleClose}
                        />

                        <ProductDetails
                            formData={formData}
                            onChangeName={(text) =>
                                setFormData((prev) => ({ ...prev, name: text }))
                            }
                            required
                            onChangeBrand={(text) =>
                                setFormData((prev) => ({ ...prev, brand: text }))
                            }
                        />

                        <CategorySelector
                            categories={categories}
                            formData={formData}
                            setFormData={setFormData}
                            showCategoryDropdown={showCategoryDropdown}
                            setShowCategoryDropdown={setShowCategoryDropdown}
                            showCreateCategory={showCreateCategory}
                            setShowCreateCategory={setShowCreateCategory}
                            newCategoryData={newCategoryData}
                            setNewCategoryData={setNewCategoryData}
                            addCategory={addCategory}
                            loadingCategories={loadingCategories}
                            refreshCategories={refreshCategories}
                            handleCreateCategory={handleCreateCategory}
                        />

                        <PriceInputs
                            cost={formData.cost}
                            wholeSalePrice={formData.wholeSalePrice}
                            price={formData.price}
                            onChangeCost={(text) =>
                                setFormData((prev) => ({ ...prev, cost: text }))
                            }
                            onChangeWholeSale={(text) =>
                                setFormData((prev) => ({ ...prev, wholeSalePrice: text }))
                            }
                            onChangePrice={(text) =>
                                setFormData((prev) => ({ ...prev, price: text }))
                            }
                        />

                        <BarcodeUnitInputs
                            barcode={formData.barcode}
                            unit={formData.unit}
                            onChangeBarcode={(text) =>
                                setFormData((prev) => ({ ...prev, barcode: text }))
                            }
                            onChangeUnit={(text) =>
                                setFormData((prev) => ({ ...prev, unit: text }))
                            }
                        />

                        <QuantityStockInputs
                            quantityPerUnit={formData.quantityPerUnit}
                            quantity={formData.quantity}
                            minStock={formData.minStock}
                            maxStock={formData.maxStock}
                            onChangeQuantityPerUnit={(text) =>
                                setFormData((prev) => ({ ...prev, quantityPerUnit: text }))
                            }
                            onChangeQuantity={(text) =>
                                setFormData((prev) => ({ ...prev, quantity: text }))
                            }
                            onChangeMinStock={(text) =>
                                setFormData((prev) => ({ ...prev, minStock: text }))
                            }
                            onChangeMaxStock={(text) =>
                                setFormData((prev) => ({ ...prev, maxStock: text }))
                            }
                        />

                        <DetailsInputs
                            location={formData.location}
                            description={formData.description}
                            onChangeLocation={(text) =>
                                setFormData((prev) => ({ ...prev, location: text }))
                            }
                            onChangeDescription={(text) =>
                                setFormData((prev) => ({ ...prev, description: text }))
                            }
                        />

                        <ProductModalFooter
                            loading={loading}
                            onCancel={handleClose}
                            onSubmit={handleSubmit}
                            disabled={!formData.name || !formData.categoryId || !formData.price}
                        />
                    </ScrollView>
                </SafeAreaView>
            </KeyboardAvoidingView>
        </Modal>
    );
};
