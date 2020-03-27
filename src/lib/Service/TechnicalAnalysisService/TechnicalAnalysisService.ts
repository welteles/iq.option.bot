/*
 * Copyright (C) 2020 Wellington Rocha
 * All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 *
 * Proprietary and confidential.
 */
import * as Core from "../..";

/**
 * Stop loss service.
 */
export class TechnicalAnalysisService {
    /**
     * Get indicator side.
     */
    public static getIndicatorSide(): Core.StrategySide | boolean {
        return TechnicalAnalysisService.indicatorSide;
    }

    /**
     * Indicator side.
     */
    private static indicatorSide: Core.StrategySide | boolean = false;

    /**
     * TechnicalAnalysisServices.
     */
    private readonly indicators: Core.ITechnicalAnalysis[];

    /**
     * Indicator Service.
     *
     * @param indicators
     */
    public constructor(indicators: Core.ITechnicalAnalysis[]) {
        this.indicators = indicators;
    }

    /**
     * Check indicator.
     */
    public async checkIndicator(): Promise<void> {
        let indicatorResponse: Core.StrategySide | boolean = false;
        TechnicalAnalysisService.indicatorSide = false;
        for (const indicator of this.indicators) {
            const condition = await indicator.checkCondition();
            if (!condition) {
                indicatorResponse = false;
                break;
            }
            if (
                indicatorResponse !== false &&
                condition !== indicatorResponse
            ) {
                indicatorResponse = false;
                break;
            }
            indicatorResponse = condition;
        }
        if (
            indicatorResponse === Core.StrategySide.BUY ||
            indicatorResponse === Core.StrategySide.SELL
        ) {
            TechnicalAnalysisService.indicatorSide = indicatorResponse;
        }
    }
}
