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
        const rsi = talib
            .execute({
                name: Core.Indicator.RSI,
                startIdx: 0,
                endIdx: candles.close.length - 1,
                inReal: candles.close,
                optInTimePeriod: this.conditionConfig.periods[0],
            })
            .result.outReal.reverse()[0];
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
