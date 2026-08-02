export type Product = {
    // Object ID //
    _id: string,

    // Required //
    name: string,
    price: number,
    imgFolder: string,
    rating: number,

    // Not Required //
    description?: string,
    sale?: boolean,
    salePrice?: number,
    stock?: number,
    category?: string,
    tags?: Array<string>,
};