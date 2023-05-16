import React, { useEffect, useState } from 'react';
import { readContract } from '@wagmi/core'
import { prepareWriteContract, writeContract, fetchBalance } from '@wagmi/core'

import Contract from './abi/contract.json';

/* TODO
   1. Create order
   2. Edit order
   3. Delete order
   4. Add funds
   5. Withdraw funds
*/

export const UrulokiAPI = () => {
    const chainId = 5;     // Goerli network

    const addFunds = async (tokenAddress: string, amount: number) => {
        try {
            const config = await prepareWriteContract({
                address: `0x${Contract.address}`,
                abi: Contract.abi,
                functionName: 'addFunds',
                args: [tokenAddress, amount],
                chainId: chainId
            })

            const { hash } = await writeContract(config);
            console.log(hash);

            return hash;
        } catch (err) {
            console.error(err);
        }
    }

    const withdrawFunds = async (tokenAddress: string, amount: number) => {
        try {
            const config = await prepareWriteContract({
                address: `0x${Contract.address}`,
                abi: Contract.abi,
                functionName: 'withdrawFunds',
                args: [tokenAddress, amount],
                chainId: chainId
            })

            const { hash } = await writeContract(config);

            return hash;
        } catch (err) {
            console.error(err);
        }
    }

    const createNonContinuousPriceRangeOrder = async (
        pairedTokenAddress: string,
        tokenAddress: string,
        isBuy: boolean,
        minPrice: number,
        maxPrice: number,
        amount: number,
    ) => {
        const config = await prepareWriteContract({
            address: `0x${Contract.address}`,
            abi: Contract.abi,
            functionName: 'createNonContinuousPriceRangeOrder',
            args: [pairedTokenAddress, tokenAddress, isBuy, minPrice, maxPrice, amount],
        })

        const { hash } = await writeContract(config);
        console.log(hash);

        return hash;
    }

    const createNonContinuousTargetPriceOrder = async (
        pairedTokenAddress: string,
        tokenAddress: string,
        isBuy: boolean,
        targetPrice: number,
        amount: number,
    ) => {
        const config = await prepareWriteContract({
            address: `0x${Contract.address}`,
            abi: Contract.abi,
            functionName: 'createNonContinuousTargetPriceOrder',
            args: [pairedTokenAddress, tokenAddress, isBuy, targetPrice, amount],
        })

        const { hash } = await writeContract(config);
        console.log(hash);

        return hash;
    }

    const createContinuousPriceRangeOrder = async (
        pairedTokenAddress: string,
        tokenAddress: string,
        isBuy: boolean,
        minPrice: number,
        maxPrice: number,
        amount: number,
        resetPercentage: number
    ) => {
        const config = await prepareWriteContract({
            address: `0x${Contract.address}`,
            abi: Contract.abi,
            functionName: 'createContinuousPriceRangeOrder',
            args: [pairedTokenAddress, tokenAddress, isBuy, minPrice, maxPrice, amount, resetPercentage],
        })

        const { hash } = await writeContract(config);
        console.log(hash);

        return hash;
    }

    const createContinuousTargetPriceOrder = async (
        pairedTokenAddress: string,
        tokenAddress: string,
        isBuy: boolean,
        targetPrice: number,
        amount: number,
        resetPercentage: number
    ) => {
        const config = await prepareWriteContract({
            address: `0x${Contract.address}`,
            abi: Contract.abi,
            functionName: 'createContinuousTargetPriceOrder',
            args: [pairedTokenAddress, tokenAddress, isBuy, targetPrice, amount, resetPercentage],
        })

        const { hash } = await writeContract(config);
        console.log(hash);

        return hash;
    }

    const editNonContinuousPriceRangeOrder = async (
        orderId: number,
        pairedTokenAddress: string,
        tokenAddress: string,
        isBuy: boolean,
        minPrice: number,
        maxPrice: number,
        amount: number,
    ) => {
        const config = await prepareWriteContract({
            address: `0x${Contract.address}`,
            abi: Contract.abi,
            functionName: 'editNonContinuousPriceRangeOrder',
            args: [orderId, pairedTokenAddress, tokenAddress, isBuy, minPrice, maxPrice, amount],
        })

        const { hash } = await writeContract(config);
        console.log(hash);

        return hash;
    }

    const editNonContinuousTargetPriceOrder = async (
        orderId: number,
        pairedTokenAddress: string,
        tokenAddress: string,
        isBuy: boolean,
        targetPrice: number,
        amount: number,
    ) => {
        const config = await prepareWriteContract({
            address: `0x${Contract.address}`,
            abi: Contract.abi,
            functionName: 'editNonContinuousTargetPriceOrder',
            args: [orderId, pairedTokenAddress, tokenAddress, isBuy, targetPrice, amount],
        })

        const { hash } = await writeContract(config);
        console.log(hash);

        return hash;
    }

    const editContinuousPriceRangeOrder = async (
        orderId: number,
        pairedTokenAddress: string,
        tokenAddress: string,
        isBuy: boolean,
        minPrice: number,
        maxPrice: number,
        amount: number,
        resetPercentage: number
    ) => {
        const config = await prepareWriteContract({
            address: `0x${Contract.address}`,
            abi: Contract.abi,
            functionName: 'editContinuousPriceRangeOrder',
            args: [orderId, pairedTokenAddress, tokenAddress, isBuy, minPrice, maxPrice, amount, resetPercentage],
        })

        const { hash } = await writeContract(config);
        console.log(hash);

        return hash;
    }

    const editContinuousTargetPriceOrder = async (
        orderId: number,
        pairedTokenAddress: string,
        tokenAddress: string,
        isBuy: boolean,
        targetPrice: number,
        amount: number,
        resetPercentage: number
    ) => {
        const config = await prepareWriteContract({
            address: `0x${Contract.address}`,
            abi: Contract.abi,
            functionName: 'editContinuousTargetPriceOrder',
            args: [orderId, pairedTokenAddress, tokenAddress, isBuy, targetPrice, amount, resetPercentage],
        })

        const { hash } = await writeContract(config);
        console.log(hash);

        return hash;
    }

    const cancelOrder = async (orderId: number) => {
        const config = await prepareWriteContract({
            address: `0x${Contract.address}`,
            abi: Contract.abi,
            functionName: 'cancelOrder',
            args: [orderId],
        })

        const { hash } = await writeContract(config);
        console.log(hash);

        return hash;
    }

    return {
        addFunds,
        withdrawFunds,
        createContinuousPriceRangeOrder,
        createContinuousTargetPriceOrder,
        createNonContinuousPriceRangeOrder,
        createNonContinuousTargetPriceOrder,
        editContinuousPriceRangeOrder,
        editContinuousTargetPriceOrder,
        editNonContinuousPriceRangeOrder,
        editNonContinuousTargetPriceOrder,
        cancelOrder,
    };
}