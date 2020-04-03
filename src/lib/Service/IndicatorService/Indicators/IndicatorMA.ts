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
export class IndicatorMA implements Core.IIndicator {
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
        const ma = talib
            .execute({
                name: Core.Indicator.MA,
                startIdx: 0,
                endIdx: candles.close.length - 1,
                inReal: candles.close,
                optInTimePeriod: this.conditionConfig.periods[0],
                optInMAType: 0,
            } as any)
            .result.outReal.reverse();
        const data = ma[0];
        const previousData = ma[1];
        if (data < previousData) {
            return Core.StrategySide.SELL;
        }
        if (data > previousData) {
            return Core.StrategySide.BUY;
        }
        return Core.StrategySide.NEUTRAL;
    }
}
