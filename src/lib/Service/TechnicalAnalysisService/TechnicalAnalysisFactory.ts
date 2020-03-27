/*
 * Copyright (C) 2020 Wellington Rocha
 * All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 *
 * Proprietary and confidential.
 */
import * as IQOption from "iqoption.client";
import * as Core from "../..";
import { TechnicalAnalysis } from "./";

/**
 * Indicator Factory.
 */
export class TechnicalAnalysisFactory {
    /**
     * Create indicator.
     *
     * @param technicalAnalysisConfig
     * @param market
     */
    public static createIndicator(
        technicalAnalysisConfig: Core.ITechnicalAnalysisConfig,
        market: IQOption.IQOptionMarket
    ): Promise<void> {
        Core.logger().silly(
            `${Core.timestampHelper()} TechnicalAnalysisFactory::createIndicator[${
                technicalAnalysisConfig.technicalAnalysis
            }]`
        );
        return Promise.resolve(
            this.indicators[technicalAnalysisConfig.technicalAnalysis](
                technicalAnalysisConfig,
                market
            )
        );
    }
    /**
     * TechnicalAnalysisServices
     */
    private static readonly indicators: any = {
        [TechnicalAnalysis.INVESTING]: (
            technicalAnalysisConfig: Core.ITechnicalAnalysisConfig,
            market: IQOption.IQOptionMarket
        ) => new Core.InvestingService(technicalAnalysisConfig, market),
        [TechnicalAnalysis.TRADINGVIEW]: (
            technicalAnalysisConfig: Core.ITechnicalAnalysisConfig,
            market: IQOption.IQOptionMarket
        ) => new Core.InvestingService(technicalAnalysisConfig, market)
    };
}
