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
export class IndicatorSTOCHRSI implements Core.IIndicator {
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
        const stochRSI = talib
            .execute({
                name: Core.Indicator.STOCHRSI,
                startIdx: 0,
                endIdx: candles.close.length - 1,
                inReal: candles.close,
                optInFastK_Period: 5, // todo
                optInFastD_Period: 3, // todo
                optInFastD_MAType: 0, // todo
                optInTimePeriod: this.conditionConfig.periods[0],
            } as any)
            .result.outFastK.reverse()[0];
        if (
            this.conditionConfig.overboughtEntry !== undefined &&
            stochRSI >= this.conditionConfig.overboughtEntry
        ) {
            return Core.StrategySide.OVERBOUGHT;
        }
        if (
            this.conditionConfig.oversoldEntry !== undefined &&
            stochRSI <= this.conditionConfig.oversoldEntry
        ) {
            return Core.StrategySide.OVERSOLD;
        }
        if (
            this.conditionConfig.buyEntry !== undefined &&
            stochRSI >= this.conditionConfig.buyEntry
        ) {
            return Core.StrategySide.BUY;
        }
        if (
            this.conditionConfig.sellEntry !== undefined &&
            stochRSI >= this.conditionConfig.sellEntry
        ) {
            return Core.StrategySide.SELL;
        }
        return Core.StrategySide.NEUTRAL;
    }
}
