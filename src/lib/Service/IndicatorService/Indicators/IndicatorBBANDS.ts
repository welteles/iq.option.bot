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
export class IndicatorBBANDS implements Core.IIndicator {
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
        const bbands = talib.BBANDS(
            candles.close.slice(0, this.conditionConfig.periods[0]),
            this.conditionConfig.periods[0],
            this.conditionConfig.deviation
        );
        if (candles.low[0] < bbands.lowband[0]) {
            return Core.StrategySide.BUY;
        }
        if (candles.high[0] > bbands.highband[0]) {
            return Core.StrategySide.SELL;
        }
        return false;
    }
}
