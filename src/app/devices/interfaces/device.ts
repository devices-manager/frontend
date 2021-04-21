import { Category } from '../../categories/interfaces/category';

export interface Device {
    id?: number;
    categoryId: number;
    color: string;
    partNumber: number;
    createdAt?: Date;
    updatedAt?: Date;
    Category?: Category;
}
