/*
 * Copyright (C) 2020 Wellington Rocha
 * All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 *
 * Proprietary and confidential.
 */
import * as Core from "../../..";

/**
 * Indicator condition.
 */
export class InvestingService implements Core.ITechnicalAnalysis {
    /**
     * Indicator config.
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
        return true;
    }
}
