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
export class IndicatorSTOCH implements Core.IIndicator {
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
        const stoch = talib
            .execute({
                name: Core.Indicator.STOCH,
                startIdx: 0,
                endIdx: candles.close.length - 1,
                close: candles.close,
                high: candles.high,
                low: candles.low,
                optInFastK_Period: 9, // todo
                optInSlowK_Period: 6, // todo
                optInSlowK_MAType: 0, // todo
                optInSlowD_Period: 3, // todo
                optInSlowD_MAType: 0, // todo
            } as any)
            .result.outSlowK.reverse()[0];
        if (
            this.conditionConfig.overboughtEntry !== undefined &&
            stoch >= this.conditionConfig.overboughtEntry
        ) {
            return Core.StrategySide.OVERBOUGHT;
        }
        if (
            this.conditionConfig.oversoldEntry !== undefined &&
            stoch <= this.conditionConfig.oversoldEntry
        ) {
            return Core.StrategySide.OVERSOLD;
        }
        if (
            this.conditionConfig.buyEntry !== undefined &&
            stoch >= this.conditionConfig.buyEntry
        ) {
            return Core.StrategySide.BUY;
        }
        if (
            this.conditionConfig.sellEntry !== undefined &&
            stoch >= this.conditionConfig.sellEntry
        ) {
            return Core.StrategySide.SELL;
        }
        return Core.StrategySide.NEUTRAL;
    }
}
