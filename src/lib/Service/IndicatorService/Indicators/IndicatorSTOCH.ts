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
export class IndicatorSTOCH implements Core.IIndicator {

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
        const close = candles.close.slice(0, 16);
        const high = candles.high.slice(0, 16);
        const low = candles.low.slice(0, 16);
        const result = talib.execute({
            name: "STOCH",
            startIdx: 0,
            endIdx: close.length-1,
            close: close.reverse(),
            high: high.reverse(),
            low: low.reverse(),
            optInFastK_Period: 9,
            optInSlowK_Period: 6,
            optInSlowK_MAType: 0,
            optInSlowD_Period: 3,
            optInSlowD_MAType: 0
        });
        console.log(result)
        return Core.StrategySide.NEUTRAL;
    }
}
//
//
// {
//     name: 'ATR',
//         group: 'Volatility Indicators',
//     hint: 'Average True Range',
//     inputs: [ { name: 'inPriceHLC', type: 'price', flags: [Object] } ],
//     optInputs: [
//     {
//         name: 'optInTimePeriod',
//         displayName: 'Time Period',
//         defaultValue: 14,
//         hint: 'Number of period',
//         type: 'integer_range'
//     }
// ],
//     outputs: [ { '0': 'line', name: 'outReal', type: 'real', flags: {} } ]
// }
