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
export class IndicatorBBANDS implements Core.IIndicator {

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
// // Retreive Average Directional Movement Index indicator specifications
//         var function_desc = talib.explain("BBANDS");
//         console.dir(function_desc);
        const close = candles.close.slice(0, this.conditionConfig.periods[0]);
        const result = talib.execute({
            name: "BBANDS",
            startIdx: 0,
            endIdx: close.length-1,
            inReal: close.reverse(),
            optInTimePeriod: this.conditionConfig.periods[0],
            optInNbDevUp: this.conditionConfig.deviation,
            optInNbDevDn: this.conditionConfig.deviation,
            optInMAType: 0,
        });
        const upper = result.result.outRealUpperBand[0];
        const lower = result.result.outRealLowerBand[0];
        this.index = upper;
        if (close[close.length-1] < lower) {
            return Core.StrategySide.BUY;
        }
        if (close[close.length-1] > upper) {
            return Core.StrategySide.SELL;
        }
        return Core.StrategySide.NEUTRAL;
    }
}
