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
export class IndicatorADX implements Core.IIndicator {
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
        const data = talib
            .execute({
                name: Core.Indicator.ADX,
                startIdx: 0,
                endIdx: candles.close.length - 1,
                close: candles.close,
                high: candles.high,
                low: candles.low,
                optInTimePeriod: this.conditionConfig.periods[0],
            } as any)
            .result.outReal.reverse()[0];
        if (data <= 25) {
            return Core.StrategySide.WEAK;
        }
        if (data <= 50) {
            return Core.StrategySide.STRONG;
        }
        if (data <= 75) {
            return Core.StrategySide.VERY_STRONG;
        }
        return Core.StrategySide.EXTREME;
    }
}
