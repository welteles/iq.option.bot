/*
 * Copyright (C) 2020 Wellington Rocha
 * All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 *
 * Proprietary and confidential.
 */
import * as IQOption from "iqoption.client";
import * as Core from "../../..";

/**
 * Strategy config.
 */
export interface IStrategyConfig {
    /**
     * Strategy name..
     */
    strategy: Core.StrategyType;

    /**
     * Balance available.
     */
    balanceAvailable: number;

    /**
     * Balance in currency.
     */
    balanceInCurrency: IQOption.IQOptionCurrency;

    /**
     * Value type.
     */
    valueType: Core.StrategyValueType;

    /**
     * Value.
     */
    value: number;

    /**
     * Market.
     */
    market: IQOption.IQOptionMarket;

    /**
     * Time.
     */
    time: IQOption.IQOptionTime;

    /**
     * Test???
     */
    test: boolean;

    /**
     * Martingale max attempts.
     */
    martingaleMaxAttempts?: number;

    /**
     * Labouchere Size.
     */
    labouchereSize?: number;

    /**
     * IQoption mode.
     */
    mode?: IQOption.IQOptionMode;
}
