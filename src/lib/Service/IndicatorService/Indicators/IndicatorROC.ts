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
export class IndicatorROC implements Core.IIndicator {

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
        const close = candles.close.slice(0, this.conditionConfig.periods[0]+1);
        // var function_desc = talib.explain("ROC");
        // console.dir(function_desc);
        const result = talib.execute({
            name: "ROC",
            startIdx: 0,
            endIdx: close.length-1,
            inReal: close.reverse(),
            optInTimePeriod: this.conditionConfig.periods[0]
        });
        const rsi = result.result.outReal[0];
        if ( rsi < 0 ) {
            return Core.StrategySide.SELL;
        }
        if ( rsi > 0 ) {
            return Core.StrategySide.BUY;
        }
        return Core.StrategySide.NEUTRAL;
    }
}
