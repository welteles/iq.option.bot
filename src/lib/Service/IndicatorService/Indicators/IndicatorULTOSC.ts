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
export class IndicatorULTOSC implements Core.IIndicator {
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
        const ultosc = talib
            .execute({
                name: Core.Indicator.ULTOSC,
                startIdx: 0,
                endIdx: candles.close.length - 1,
                close: candles.close,
                high: candles.high,
                low: candles.low,
                optInTimePeriod1: 7, // todo
                optInTimePeriod2: 14, //  todo
                optInTimePeriod3: 28, // todo
            } as any)
            .result.outReal.reverse()[0];
        if (
            this.conditionConfig.sellEntry !== undefined &&
            ultosc <= this.conditionConfig.sellEntry
        ) {
            return Core.StrategySide.SELL;
        }
        if (
            this.conditionConfig.buyEntry !== undefined &&
            ultosc >= this.conditionConfig.buyEntry
        ) {
            return Core.StrategySide.BUY;
        }
        return Core.StrategySide.NEUTRAL;
    }
}
