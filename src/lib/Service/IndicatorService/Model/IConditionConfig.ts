/*
 * Copyright (C) 2020 Wellington Rocha
 * All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 *
 * Proprietary and confidential.
 */
import * as Core from "../../..";

/**
 * Indicator config.
 */
export interface IConditionConfig {
    /**
     * Indicator available.
     */
    indicator: Core.Indicator;

    /**
     * Periods.
     */
    periods: number[];

    /**
     * Buy entry.
     */
    buyEntry?: number;

    /**
     * Sell entry.
     */
    sellEntry?: number;

    /**
     * Deviation.
     */
    deviation: number;

    /**
     * Overbought Entry.
     */
    overboughtEntry: number;

    /**
     * Oversold Entry.
     */
    oversoldEntry: number;
}
