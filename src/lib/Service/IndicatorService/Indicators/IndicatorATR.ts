/*
 * Copyright (C) 2020 Wellington Rocha
 * All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 *
 * Proprietary and confidential.
 */
const talib = require("talib");
import BigNumber from "bignumber.js";
import * as Core from "../../..";

/**
 * Indicator condition.
 */
export class IndicatorATR implements Core.IIndicator {
    /**
     * Indicator config.
     */
    private readonly conditionConfig: Core.IConditionConfig;

    /**
     * Percentage.
     */
    private readonly percentage: number = 0.003;

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
        const atr = talib
            .execute({
                name: Core.Indicator.ATR,
                startIdx: 0,
                endIdx: candles.close.length - 1,
                close: candles.close,
                high: candles.high,
                low: candles.low,
                optInTimePeriod: this.conditionConfig.periods[0],
            } as any)
            .result.outReal.reverse()[0];
        const ma = talib
            .execute({
                name: Core.Indicator.MA,
                startIdx: 0,
                endIdx: candles.close.length - 1,
                inReal: candles.close,
                optInTimePeriod: this.conditionConfig.periods[0],
                optInMAType: 0,
            } as any)
            .result.outReal.reverse()[0];
        const percentage = new BigNumber(atr).div(ma).times(100).toNumber();
        if (percentage > this.percentage) {
            return Core.StrategySide.HIGH;
        }
        return Core.StrategySide.LOW;
    }
}
