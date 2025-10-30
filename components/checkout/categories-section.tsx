// import { Category } from "@/types";
// import React from "react";
// import { Text, View } from "react-native";
// import CategoryCard from "./category-card";

// interface CategoryProps {
//     categories: Category[];
//     navigateToCategory: (category: Category) => void;
// }

// const CategoriesSection: React.FC<CategoryProps> = ({ categories, navigateToCategory }) => {
//     return (
//        <View className="px-4">
//           <Text className="text-lg font-semibold text-gray-900 mb-3">
//             Categories
//           </Text>
//           <View className="flex-row flex-wrap justify-between">
//             {categories.map((category: Category, index: number) => (
//               <CategoryCard key={index} category={category} onPress={navigateToCategory} />
//             ))}
//           </View>
//         </View>
//     );
// }

// export default CategoriesSection;
