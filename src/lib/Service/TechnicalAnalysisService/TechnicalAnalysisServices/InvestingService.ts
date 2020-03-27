/*
 * Copyright (C) 2020 Wellington Rocha
 * All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 *
 * Proprietary and confidential.
 */
import * as TechnicalAnalysisInvesting from "technical.analysis.investing";
import * as Core from "../../..";

/**
 * Indicator condition.
 */
export class InvestingService implements Core.ITechnicalAnalysis {
    /**
     * Indicator config.
     */
    private readonly technicalAnalysisInvesting: TechnicalAnalysisInvesting.TechnicalAnalysisInvesting = new TechnicalAnalysisInvesting.TechnicalAnalysisInvesting();

    /**
     * Technical Analysis Config
     */
    private readonly technicalAnalysisConfig: Core.ITechnicalAnalysisConfig;

    /**
     * Indicator RSI.
     *
     * @param technicalAnalysisConfig
     */
    public constructor(technicalAnalysisConfig: Core.ITechnicalAnalysisConfig) {
        this.technicalAnalysisConfig = technicalAnalysisConfig;
    }

    /**
     * Check condition.
     */
    public async checkCondition(): Promise<Core.StrategySide | boolean> {
        const analysis = await this.technicalAnalysisInvesting.getAnalysis(
            1,
            60 * 5
        );
        if (
            analysis ===
            TechnicalAnalysisInvesting.TechnicalAnalysisInvestingResponse
                .STRONG_BUY
        ) {
            return Core.StrategySide.BUY;
        }
        if (
            analysis ===
            TechnicalAnalysisInvesting.TechnicalAnalysisInvestingResponse
                .STRONG_SELL
        ) {
            return Core.StrategySide.SELL;
        }
        return false;
    }
}
