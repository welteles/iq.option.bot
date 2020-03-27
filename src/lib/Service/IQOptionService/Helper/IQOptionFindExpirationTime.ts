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
 * @param time
 */
export const iQOptionFindExpirationTime = (
    initializationData: IQOption.IQOptionInitializationData,
    market: number,
    time: IQOption.IQOptionTime,
    mode: IQOption.IQOptionMode
): number => {
    const bet_close_time = Object.keys(
        initializationData[mode].actives[market].option.bet_close_time
    );
    return parseInt(bet_close_time[time], undefined);
};
