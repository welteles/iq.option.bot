/*
 * Copyright (C) 2020 Wellington Rocha
 * All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 *
 * Proprietary and confidential.
 */
import * as IQOption from "iqoption.client";

/**
 * Find profit percent.
 *
 * @param initializationData
 * @param market
 */
export const iQOptionFindProfitPercent = (
    initializationData: IQOption.IQOptionInitializationData,
    market: number,
    mode: IQOption.IQOptionMode
): number => {
    const comission =
        initializationData[mode].actives[market].option.profit.commission;
    return 100 - comission;
};
