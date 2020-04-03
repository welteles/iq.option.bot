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
export class IndicatorADX implements Core.IIndicator {

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
        const close = candles.close.slice(0, this.conditionConfig.periods[0]*2);
        const high = candles.high.slice(0, this.conditionConfig.periods[0]*2);
        const low = candles.low.slice(0, this.conditionConfig.periods[0]*2);
        const result = talib.execute({
            name: "ADX",
            startIdx: 0,
            endIdx: close.length-1,
            close: close.reverse(),
            high: high.reverse(),
            low: low.reverse(),
            optInTimePeriod: this.conditionConfig.periods[0]
        });
        const data = result.result.outReal[0];
        this.index = data;

        if ( data <= 25 ) {
            return Core.StrategySide.WEAK;
        }

        if ( data <= 50 ) {
            return Core.StrategySide.STRONG;
        }

        if ( data <= 75 ) {
            return Core.StrategySide.VERY_STRONG;
        }

        return Core.StrategySide.EXTREME;
    }
}
