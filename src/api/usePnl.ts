import { useCallback } from 'react';
import { useApiMutation, useApiQuery } from '../services';

export interface CostItem {
    _id: string;
    title: string;
    amount: number;
}

export interface AmountCount {
    count: number;
    amount: number;
}

export interface PnL {
    month: string;
    salary: AmountCount;
    fixedCost: CostItem[];
    variableCost: CostItem[];
    sales: AmountCount;
    totalFixedCost: number;
    totalVariableCost: number;
    totalCost: number;
    profit: number;
}

export interface GetPnLParams {
    month?: string;
}

// ---------- GET /pnl ----------

export const usePnL = (params?: GetPnLParams) => {
    return useApiQuery<PnL>(
        ['pnl', params],
        {
            method: 'GET',
            endPoint: 'pnl',
            requestConfig: { params },
        },
    );
};