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
export class IndicatorBBANDS implements Core.IIndicator {
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
        const bbands = talib.execute({
            name: Core.Indicator.BBANDS,
            startIdx: 0,
            endIdx: candles.close.length - 1,
            inReal: candles.close,
            optInTimePeriod: this.conditionConfig.periods[0],
            optInNbDevUp: this.conditionConfig.deviation,
            optInNbDevDn: this.conditionConfig.deviation,
            optInMAType: 0,
        } as any).result;
        if (candles.close[0] < bbands.outRealLowerBand.reverse()[0]) {
            return Core.StrategySide.BUY;
        }
        if (candles.close[0] > bbands.outRealUpperBand.reverse()[0]) {
            return Core.StrategySide.SELL;
        }
        return Core.StrategySide.NEUTRAL;
    }
}
