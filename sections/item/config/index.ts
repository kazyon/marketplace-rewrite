// if you change a category in here, make sure to also change it in the firebase function as well
import { possibleCategories } from '@/sections/marketplace/config';

export const ahCategoriesOptions = possibleCategories.map((category, index) => {
    return {
        id: index.toString(),
        label: String(category),
    };
});
