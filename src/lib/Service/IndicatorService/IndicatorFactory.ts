/*
 * Copyright (C) 2020 Wellington Rocha
 * All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 *
 * Proprietary and confidential.
 */
import * as Core from "../..";
import { Indicator } from "./";

/**
 * Indicator Factory.
 */
export class IndicatorFactory {
    /**
     * Create indicator.
     *
     * @param conditionConfig
     */
    public static createIndicator(
        conditionConfig: Core.IConditionConfig
    ): Promise<void> {
        Core.logger().silly(
            `${Core.timestampHelper()} IndicatorFactory::createIndicator[${
                conditionConfig.indicator
            }]`
        );
        return Promise.resolve(
            this.indicators[conditionConfig.indicator](conditionConfig)
        );
    }
    /**
     * Indicators
     */
    private static readonly indicators: any = {
        [Indicator.GRAPHICAL_ANALYSIS]: (
            conditionConfig: Core.IConditionConfig
        ) => new Core.IndicatorGraphicalAnalysis(conditionConfig),
        [Indicator.RSI]: (conditionConfig: Core.IConditionConfig) =>
            new Core.IndicatorRSI(conditionConfig),
        [Indicator.MACD]: (conditionConfig: Core.IConditionConfig) =>
            new Core.IndicatorMACD(conditionConfig),
        [Indicator.BBANDS]: (conditionConfig: Core.IConditionConfig) =>
            new Core.IndicatorBBANDS(conditionConfig),
        [Indicator.ATR]: (conditionConfig: Core.IConditionConfig) =>
            new Core.IndicatorATR(conditionConfig),
        [Indicator.ADX]: (conditionConfig: Core.IConditionConfig) =>
            new Core.IndicatorADX(conditionConfig),
        [Indicator.STOCH]: (conditionConfig: Core.IConditionConfig) =>
            new Core.IndicatorSTOCH(conditionConfig),
    };
}
