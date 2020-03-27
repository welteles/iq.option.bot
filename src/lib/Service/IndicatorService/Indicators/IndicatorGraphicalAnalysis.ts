/*
 * Copyright (C) 2020 Wellington Rocha
 * All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 *
 * Proprietary and confidential.
 */
import * as talib from "ta-lib";
import * as Core from "../../..";

/**
 * Indicator condition.
 */
export class IndicatorGraphicalAnalysis implements Core.IIndicator {
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
    public checkCondition(candles: Core.ICandle): Core.StrategySide | boolean {
        if (this.conditionConfig.sellEntry !== undefined) {
            return Core.StrategySide.SELL;
        }
        if (this.conditionConfig.buyEntry !== undefined) {
            return Core.StrategySide.BUY;
        }
        return false;
    }
}
