import Category from '@/db/models/categories';
import {
    CategoryData,
    CategoryItem,
    InventoryUpdate,
    InventoryViewItem,
    ProductUpdate,
} from '@/types';
import React, { useEffect, useState } from 'react';
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

interface EditProductModalProps {
    visible: boolean;
    onClose: () => void;
    onProductUpdated?: () => void;
    item: InventoryViewItem | null;
    categories: CategoryItem[];
    addCategory: (newCategoryData: CategoryData) => Promise<Category | undefined>;
    loadingCategories: boolean;
    refreshCategories: () => Promise<void>;
    updateProduct: (productId: string, updates: ProductUpdate) => Promise<void>;
    updateInventory: (inventoryId: string, updates: InventoryUpdate) => Promise<void>;
}

interface FormData {
    name: string;
    brand: string;
    categoryId: string;
    cost: string;
    price: string;
    wholeSalePrice: string;
    barcode: string;
    description: string;
    unit: string;
    quantity: string;
    quantityPerUnit: string;
    minStock: string;
    maxStock: string;
    location: string;
}

export const EditProductModal: React.FC<EditProductModalProps> = ({
    visible,
    onClose,
    addCategory,
    loadingCategories,
    refreshCategories,
    onProductUpdated,
    updateProduct,
    updateInventory,
    categories,
    item,
}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [showCategoryDropdown, setShowCategoryDropdown] = useState<boolean>(false);
    const [showCreateCategory, setShowCreateCategory] = useState<boolean>(false);
    const [newCategoryData, setNewCategoryData] = useState<CategoryData>({
        name: '',
        icon: '📦',
        color: '#6B7280',
    });

    const [formData, setFormData] = useState<FormData>({
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

    useEffect(() => {
        if (item && visible) {
            console.log('Editing item:', item);
            setFormData({
                name: item.name || '',
                brand: item.brand || '',
                categoryId: item.categoryId || '',
                cost: item.averageCost?.toString() || '',
                price: item.price?.toString() || '',
                wholeSalePrice: item.wholeSalePrice?.toString() || '',
                barcode: item.barcode || '',
                description: item.description || '',
                unit: item.unit || 'pcs',
                quantity: item.quantity?.toString() || '',
                quantityPerUnit: item.quantityPerUnit,
                minStock: item.minStock?.toString() || '',
                maxStock: item.maxStock?.toString() || '',
                location: item.location || '',
            });
        }
    }, [item, visible]);

    const handleCreateCategory = async (): Promise<void> => {
        try {
            const newCategory = await addCategory(newCategoryData);
            await refreshCategories();
            if (!newCategory) {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'No category created',
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

    // const showCreateCategoryForm = (): void => {
    //     if (categories.length > 0 && !formData.categoryId) {
    //         setFormData((prev) => ({ ...prev, categoryId: categories[0].id }));
    //     }
    //     refreshCategories();
    //     setShowCategoryDropdown(!showCategoryDropdown);
    // };

    const handleSubmit = async (): Promise<void> => {
        if (!item) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'No item selected',
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
            const productUpdates: ProductUpdate = {
                name: formData.name,
                brand: formData.brand,
                categoryId: formData.categoryId,
                barcode: formData.barcode,
                description: formData.description,
                unit: formData.unit || 'pcs',
                quantityPerUnit: formData.quantityPerUnit || '1 pc',
                status: 'active',
            };

            await updateProduct(item.productId, productUpdates);

            const parsedMinStock = parseFloat(formData.minStock);
            const parsedMaxStock = parseFloat(formData.maxStock);
            const parsedWholeSalePrice = parseFloat(formData.wholeSalePrice);
            const parsedQuantity = parseFloat(formData.quantity);

            const inventoryUpdates: InventoryUpdate = {
                price: parseFloat(formData.price),
                lastPurchasePrice: parseFloat(formData.cost) || 0,
                weightedAvgCost: parseFloat(formData.cost) || 0,
                quantity: Number.isFinite(parsedQuantity) ? parsedQuantity : 0,
                minStock: Number.isFinite(parsedMinStock) ? parsedMinStock : 0,
                maxStock: Number.isFinite(parsedMaxStock) ? parsedMaxStock : 100,
                location: formData.location,
            };

            if (formData.wholeSalePrice !== '' && Number.isFinite(parsedWholeSalePrice)) {
                inventoryUpdates.wholeSalePrice = parsedWholeSalePrice;
            }

            await updateInventory(item.id, inventoryUpdates);

            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Product updated successfully!',
                position: 'bottom',
            });
            onProductUpdated?.();
            onClose();
        } catch (error) {
            console.error('Error updating product:', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to update product',
                position: 'bottom',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleClose = (): void => {
        onClose();
    };

    // const selectedCategory = categories.find((cat) => cat.id === formData.categoryId);

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
                            title='Edit Product'
                            description='Update product details and inventory information.'
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
                            onChangeCost={(text: string) =>
                                setFormData((prev) => ({ ...prev, cost: text }))
                            }
                            onChangeWholeSale={(text: string) =>
                                setFormData((prev) => ({ ...prev, wholeSalePrice: text }))
                            }
                            onChangePrice={(text: string) =>
                                setFormData((prev) => ({ ...prev, price: text }))
                            }
                        />

                        <BarcodeUnitInputs
                            barcode={formData.barcode}
                            unit={formData.unit}
                            onChangeBarcode={(text: string) =>
                                setFormData((prev) => ({ ...prev, barcode: text }))
                            }
                            onChangeUnit={(text: string) =>
                                setFormData((prev) => ({ ...prev, unit: text }))
                            }
                        />
                        <QuantityStockInputs
                            quantityPerUnit={formData.quantityPerUnit}
                            quantity={formData.quantity}
                            minStock={formData.minStock}
                            maxStock={formData.maxStock}
                            onChangeQuantityPerUnit={(text: string) =>
                                setFormData((prev) => ({ ...prev, quantityPerUnit: text }))
                            }
                            onChangeQuantity={(text: string) =>
                                setFormData((prev) => ({ ...prev, quantity: text }))
                            }
                            onChangeMinStock={(text: string) =>
                                setFormData((prev) => ({ ...prev, minStock: text }))
                            }
                            onChangeMaxStock={(text: string) =>
                                setFormData((prev) => ({ ...prev, maxStock: text }))
                            }
                        />

                        <DetailsInputs
                            location={formData.location}
                            description={formData.description}
                            onChangeLocation={(text: string) =>
                                setFormData((prev) => ({ ...prev, location: text }))
                            }
                            onChangeDescription={(text: string) =>
                                setFormData((prev) => ({ ...prev, description: text }))
                            }
                        />
                        <ProductModalFooter
                            loading={loading}
                            onCancel={handleClose}
                            onSubmit={handleSubmit}
                            disabled={
                                loading || !formData.name || !formData.categoryId || !formData.price
                            }
                        />
                    </ScrollView>
                </SafeAreaView>
            </KeyboardAvoidingView>
        </Modal>
    );
};
