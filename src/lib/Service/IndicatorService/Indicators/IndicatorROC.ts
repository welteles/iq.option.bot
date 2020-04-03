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
export class IndicatorROC implements Core.IIndicator {
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
        const dataRoc = talib
            .execute({
                name: Core.Indicator.ROC,
                startIdx: 0,
                endIdx: candles.close.length - 1,
                inReal: candles.close,
                optInTimePeriod: this.conditionConfig.periods[0],
            } as any)
            .result.outReal.reverse()[0];
        if (dataRoc < 0) {
            return Core.StrategySide.SELL;
        }
        if (dataRoc > 0) {
            return Core.StrategySide.BUY;
        }
        return Core.StrategySide.NEUTRAL;
    }
}
