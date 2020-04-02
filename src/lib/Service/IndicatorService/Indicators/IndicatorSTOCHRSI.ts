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
export class IndicatorSTOCHRSI implements Core.IIndicator {

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
        // Retreive Average Directional Movement Index indicator specifications
        // var function_desc = talib.explain("STOCHRSI");
        // console.dir(function_desc);
        // // Retreive Average Directional Movement Index indicator specifications
        // var function_desc = talib.explain("STOCH");
        // console.dir(function_desc);
        const close = candles.close.slice(0, this.conditionConfig.periods[0]+7);
        const result = talib.execute({
            name: "STOCHRSI",
            startIdx: 0,
            endIdx: close.length-1,
            inReal: close.reverse(),
            optInFastK_Period: 5,
            optInFastD_Period: 3,
            optInFastD_MAType: 0,
            optInTimePeriod: this.conditionConfig.periods[0],
        });
        const rsi = result.result.outFastK[0];
        if( this.conditionConfig.overboughtEntry !== undefined && rsi >= this.conditionConfig.overboughtEntry) {
            return Core.StrategySide.OVERBOUGHT;
        }
        if( this.conditionConfig.oversoldEntry !== undefined && rsi <= this.conditionConfig.oversoldEntry) {
            return Core.StrategySide.OVERSOLD;
        }
        if( this.conditionConfig.buyEntry !== undefined && rsi >= this.conditionConfig.buyEntry) {
            return Core.StrategySide.BUY;
        }
        if( this.conditionConfig.sellEntry !== undefined && rsi >= this.conditionConfig.sellEntry) {
            return Core.StrategySide.SELL;
        }
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
