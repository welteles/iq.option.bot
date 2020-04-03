/*
 * Copyright (C) 2020 Wellington Rocha
 * All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 *
 * Proprietary and confidential.
 */
const talib = require("talib");
import * as Core from "../../..";

/**
 * Indicator condition.
 */
export class IndicatorEMA implements Core.IIndicator {
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
    public checkCondition(candles: Core.ICandle): Core.StrategySide {
        const ema = talib
            .execute({
                name: Core.Indicator.EMA,
                startIdx: 0,
                endIdx: close.length - 1,
                inReal: candles.close,
                optInTimePeriod: this.conditionConfig.periods[0],
            } as any)
            .result.outReal.reverse();
        const data = ema[0];
        const previousData = ema[1];
        if (data < previousData) {
            return Core.StrategySide.SELL;
        }
        if (data > previousData) {
            return Core.StrategySide.BUY;
        }
        return Core.StrategySide.NEUTRAL;
    }
}
