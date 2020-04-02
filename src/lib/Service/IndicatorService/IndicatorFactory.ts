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
        [Indicator.STOCHRSI]: (conditionConfig: Core.IConditionConfig) =>
            new Core.IndicatorSTOCHRSI(conditionConfig),
        [Indicator.WILLR]: (conditionConfig: Core.IConditionConfig) =>
            new Core.IndicatorWILLR(conditionConfig),
        [Indicator.CCI]: (conditionConfig: Core.IConditionConfig) =>
            new Core.IndicatorCCI(conditionConfig),
        [Indicator.ULTOSC]: (conditionConfig: Core.IConditionConfig) =>
            new Core.IndicatorULTOSC(conditionConfig),
        [Indicator.ROC]: (conditionConfig: Core.IConditionConfig) =>
            new Core.IndicatorROC(conditionConfig),
        [Indicator.MA]: (conditionConfig: Core.IConditionConfig) =>
            new Core.IndicatorMA(conditionConfig),
        [Indicator.EMA]: (conditionConfig: Core.IConditionConfig) =>
            new Core.IndicatorEMA(conditionConfig),
    };
}
