/*
 * Copyright (C) 2020 Wellington Rocha
 * All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 *
 * Proprietary and confidential.
 */
import * as talib from "ta-lib";
import * as Core from "../../..";

/**
 * Indicator condition.
 */
export class IndicatorRSI implements Core.IIndicator {
    /**
     * Indicator config.
     */
    private readonly conditionConfig: Core.IConditionConfig;

    /**
     * Indicator RSI.
     *
     * @param conditionConfig
     */
    public constructor(conditionConfig: Core.IConditionConfig) {
        this.conditionConfig = conditionConfig;
    }

    /**
     * Check condition.
     */
    public checkCondition(candles: Core.ICandle): Core.StrategySide | boolean {
        const rsi = talib.RSI(
            candles.close.slice(0, this.conditionConfig.periods[0] * 2),
            this.conditionConfig.periods[0]
        )[0];
        if (
            this.conditionConfig.sellEntry !== undefined &&
            rsi >= this.conditionConfig.sellEntry
        ) {
            return Core.StrategySide.SELL;
        }
        if (
            this.conditionConfig.buyEntry !== undefined &&
            rsi <= this.conditionConfig.buyEntry
        ) {
            return Core.StrategySide.BUY;
        }
        return false;
    }
}
