/*
 * Copyright (C) 2020 Wellington Rocha
 * All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 *
 * Proprietary and confidential.
 */
import BigNumber from "bignumber.js";
import { StrategyValueType } from "../Service";

/**
 * Order value helper.
 *
 * @param value
 * @param balanceAvailable
 * @param valueType
 */
export const orderAmountHelper = (
    value: number,
    balanceAvailable: number,
    valueType: StrategyValueType
) => {
    if (valueType === StrategyValueType.FIXED) {
        return value;
    }
    return new BigNumber(balanceAvailable)
        .times(value)
        .div(100)
        .decimalPlaces(2)
        .toNumber();
};
