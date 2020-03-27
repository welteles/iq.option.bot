/*
 * Copyright (C) 2020 Wellington Rocha
 * All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 *
 * Proprietary and confidential.
 */
import * as Core from "..";

/**
 * Config.
 */
export interface IConfig {
    /**
     * Account name.
     */
    account: Core.IAccount;

    /**
     * Strategy.
     */
    strategy: Core.IStrategyConfig;

    /**
     * Indicator.
     */
    indicator: Core.IIndicatorConfig;

    /**
     * Technical Analysis.
     */
    technicalAnalysis: Core.ITechnicalAnalysisConfig[];

    /**
     * Stop loss default configuration.
     */
    stopLoss?: Core.IStopLossConfig;

    /**
     * Take profit default configuration.
     */
    takeProfit?: Core.ITakeProfitConfig;
}
