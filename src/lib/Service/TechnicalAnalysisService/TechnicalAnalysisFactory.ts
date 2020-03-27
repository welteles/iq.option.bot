/*
 * Copyright (C) 2020 Wellington Rocha
 * All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 *
 * Proprietary and confidential.
 */
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
     */
    public static createIndicator(
        technicalAnalysisConfig: Core.ITechnicalAnalysisConfig
    ): Promise<void> {
        Core.logger().silly(
            `${Core.timestampHelper()} TechnicalAnalysisFactory::createIndicator[${
                technicalAnalysisConfig.technicalAnalysis
            }]`
        );
        return Promise.resolve(
            this.indicators[technicalAnalysisConfig.technicalAnalysis](
                technicalAnalysisConfig
            )
        );
    }
    /**
     * TechnicalAnalysisServices
     */
    private static readonly indicators: any = {
        [TechnicalAnalysis.INVESTING]: (
            technicalAnalysisConfig: Core.ITechnicalAnalysisConfig
        ) => new Core.InvestingService(technicalAnalysisConfig),
        [TechnicalAnalysis.TRADINGVIEW]: (
            technicalAnalysisConfig: Core.ITechnicalAnalysisConfig
        ) => new Core.InvestingService(technicalAnalysisConfig),
    };
}
