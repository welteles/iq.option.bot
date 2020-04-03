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
export interface IIndicatorConfig {
    /**
     * Min candles.
     */
    minCandles: number;

    /**
     * Time.
     */
    time: number;

    /**
     * Conditions.
     */
    conditions: Core.IConditionConfig[];

    /**
     * Deviation.
     */
    strong_required: boolean;
}
