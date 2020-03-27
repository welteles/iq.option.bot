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
 * Strategy interface.
 */
export interface IStrategy {
    /**
     * Indicator observable.
     *
     * @param signal
     */
    indicatorObservable(): Promise<void>;

    /**
     * Order closed.
     *
     * @param orderClosed
     */
    onOrderCloseObservable(
        orderClosed: IQOption.IQOptionOptionClosed
    ): Promise<void>;

    /**
     * Get initialization data.
     */
    loadInitializationData(): Promise<void>;

    /**
     * Run strategy.
     */
    runStrategy(): Promise<void>;
}
