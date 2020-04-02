/*
 * Copyright (C) 2020 Wellington Rocha
 * All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 *
 * Proprietary and confidential.
 */
const talib = require('talib')
import * as Core from "../../..";

/**
 * Indicator condition.
 */
export class IndicatorULTOSC implements Core.IIndicator {

    /**
     * Indicator config.
     */
    public index: boolean | number;

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
        this.index = false;
    }

    /**
     * Check condition.
     */
    public checkCondition(candles: Core.ICandle): Core.StrategySide {
        const close = candles.close.slice(0, this.conditionConfig.periods[0]*2.1);
        const high = candles.high.slice(0, this.conditionConfig.periods[0]*2.1);
        const low = candles.low.slice(0, this.conditionConfig.periods[0]*2.1);
        const result = talib.execute({
            name: "ULTOSC",
            startIdx: 0,
            endIdx: close.length-1,
            close: close.reverse(),
            high: high.reverse(),
            low: low.reverse(),
            optInTimePeriod1: 7,
            optInTimePeriod2: 14,
            optInTimePeriod3: 28
        });
        const rsi = result.result.outReal[0];
        this.index = rsi;

        if (
            this.conditionConfig.sellEntry !== undefined &&
            rsi <= this.conditionConfig.sellEntry
        ) {
            return Core.StrategySide.SELL;
        }
        if (
            this.conditionConfig.buyEntry !== undefined &&
            rsi >= this.conditionConfig.buyEntry
        ) {
            return Core.StrategySide.BUY;
        }
        return Core.StrategySide.NEUTRAL;
    }
}