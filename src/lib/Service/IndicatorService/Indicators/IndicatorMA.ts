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
export class IndicatorMA implements Core.IIndicator {

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
        const result = talib.execute({
            name: "MA",
            startIdx: 0,
            endIdx: close.length-1,
            inReal: close.reverse(),
            optInTimePeriod: this.conditionConfig.periods[0],
            optInMAType: 0
        });

        const data = result.result.outReal[1];
        const dataAnt = result.result.outReal[0];

        this.index = data;

        if ( data < dataAnt ) {
            return Core.StrategySide.SELL;
        }
        if ( data > dataAnt ) {
            return Core.StrategySide.BUY;
        }
        return Core.StrategySide.NEUTRAL;
    }
}
