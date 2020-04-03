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
export class IndicatorCCI implements Core.IIndicator {
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
        const dataCCI = talib
            .execute({
                name: Core.Indicator.CCI,
                startIdx: 0,
                endIdx: close.length - 1,
                close: candles.close,
                high: candles.high,
                low: candles.low,
                optInTimePeriod: this.conditionConfig.periods[0],
            } as any)
            .result.outReal.reverse()[0];
        if (
            this.conditionConfig.sellEntry !== undefined &&
            dataCCI <= this.conditionConfig.sellEntry
        ) {
            return Core.StrategySide.SELL;
        }
        if (
            this.conditionConfig.buyEntry !== undefined &&
            dataCCI >= this.conditionConfig.buyEntry
        ) {
            return Core.StrategySide.BUY;
        }
        return Core.StrategySide.NEUTRAL;
    }
}
