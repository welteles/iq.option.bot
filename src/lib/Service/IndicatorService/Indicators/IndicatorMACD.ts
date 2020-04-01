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
export class IndicatorMACD implements Core.IIndicator {
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
        const macd = talib
            .execute({
                name: Core.Indicator.MACD,
                startIdx: 0,
                endIdx: candles.close.length - 1,
                inReal: candles.close,
                optInFastPeriod: this.conditionConfig.periods[0],
                optInSlowPeriod: this.conditionConfig.periods[1],
                optInSignalPeriod: this.conditionConfig.periods[2]
            })
            .result;
            const line = macd.outMACD.reverse()[0];
            const signal = macd.outMACDSignal.reverse()[0];
        if (
            this.conditionConfig.sellEntry !== undefined &&
            line < signal
        ) {
            return Core.StrategySide.SELL;
        }
        if (
            this.conditionConfig.buyEntry !== undefined &&
            line > signal
        ) {
            return Core.StrategySide.BUY;
        }
        return false;
    }
}
