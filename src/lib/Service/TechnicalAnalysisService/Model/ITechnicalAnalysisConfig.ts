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
 * Indicator config.
 */
export interface ITechnicalAnalysisConfig {
    /**
     * Technical Analysis.
     */
    technicalAnalysis: Core.TechnicalAnalysis;

    /**
     * Technical Analysis.
     */
    period: Core.TechnicalAnalysisPeriod;

    /**
     * Strength.
     */
    strength: Core.TechnicalAnalysisStrength;
}
