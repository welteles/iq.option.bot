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
export class IndicatorWILLR implements Core.IIndicator {
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
        const willr = talib
            .execute({
                name: Core.Indicator.WILLR,
                startIdx: 0,
                endIdx: close.length - 1,
                close: candles.close,
                high: candles.high,
                low: candles.low,
                optInTimePeriod: this.conditionConfig.periods[0],
            } as any)
            .result.outReal.reverse()[0];
        if (willr >= -20) {
            return Core.StrategySide.OVERBOUGHT;
        }
        if (willr <= -80) {
            return Core.StrategySide.OVERSOLD;
        }
        return Core.StrategySide.NEUTRAL;
    }
}
