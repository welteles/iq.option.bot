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
 * Data.
 */
export interface IData {
    /**
     * Profile.
     */
    profile: IQOption.IQOptionProfile;

    /**
     * Balance.
     */
    balance: IQOption.IQOptionBalance;

    /**
     * Open orders.
     */
    ordersOpen: IQOption.IQOptionOptionOpened[];

    /**
     * Candles.
     */
    candles: Core.ICandle;

    /**
     * Orders history.
     */
    ordersHistory: IQOption.IQOptionOptionClosed[];

    /**
     * Win options.
     */
    win: IQOption.IQOptionOptionClosed[];

    /**
     * Lose options.
     */
    lose: IQOption.IQOptionOptionClosed[];

    /**
     * Lose options.
     */
    initializationData: IQOption.IQOptionInitializationData;

    /**
     * Lose options.
     */
    timestamp: string;
}
