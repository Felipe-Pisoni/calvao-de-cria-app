// export interface IResponse<T> {
//     "status": "success",
//     "message": "Produtos retornados com sucesso.",
//     "details": {
//         "totalItems": 8,
//         "totalPages": 1,
//         "currentPage": 1,
//         "limit": 10
//     },
//     "data": 

import type { Product } from ".";

// }
export interface IListProductResponse{
    status: string;
    message: string;
    details: {
        totalItems: number;
        totalPages: number;
        currentPage: number;
        limit: number;
    };
    data: Product[];
}