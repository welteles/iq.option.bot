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
    public checkCondition(candles: Core.ICandle): Core.StrategySide {
        const macd = talib.execute({
            name: Core.Indicator.MACD,
            startIdx: 0,
            endIdx: candles.close.length - 1,
            inReal: candles.close,
            optInFastPeriod: this.conditionConfig.periods[0],
            optInSlowPeriod: this.conditionConfig.periods[1],
            optInSignalPeriod: this.conditionConfig.periods[2],
        } as any).result;
        const macdLine = macd.outMACD.reverse();
        const macdSignal = macd.outMACDSignal.reverse();
        if (
            this.conditionConfig.sellEntry !== undefined &&
            macdLine[0] - macdSignal[0] < 0 &&
            macdLine[1] - macdSignal[1] > 0
        ) {
            return Core.StrategySide.SELL;
        }
        if (
            this.conditionConfig.buyEntry !== undefined &&
            macdLine[0] - macdSignal[0] > 0 &&
            macdLine[1] - macdSignal[1] < 0
        ) {
            return Core.StrategySide.BUY;
        }
        return Core.StrategySide.NEUTRAL;
    }
}
