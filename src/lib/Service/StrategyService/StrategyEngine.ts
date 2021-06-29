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
 * Strategy Engine.
 */
export class StrategyEngine {
    /**
     * Get indicator side.
     */
    public static getIndicatorSide(): Core.StrategySide | boolean {
        return this.indicatorSide;
    }
    /**
     * Indicator side.
     */
    private static indicatorSide: Core.StrategySide | boolean;

    /**
     * Check condition.
     */
    public checkNewTarget() {
        if (Core.IndicatorServiceBuild.haveIndicator()) {
            if (!Core.IndicatorService.isCandlesMinimum()) {
                return;
            }
            Core.enableStrategyInformation();
            StrategyEngine.indicatorSide =
                Core.IndicatorService.getIndicatorSide();
            if (
                StrategyEngine.indicatorSide === Core.StrategySide.BUY ||
                StrategyEngine.indicatorSide === Core.StrategySide.SELL
            ) {
                Core.EventManager.emit(Core.StrategyEvent.NEW_TARGET);
            }
        }
        if (Core.TechnicalAnalysisBuild.haveTechnicalAnalysis()) {
            Core.enableStrategyInformation();
            StrategyEngine.indicatorSide =
                Core.TechnicalAnalysisService.getIndicatorSide();
            if (
                StrategyEngine.indicatorSide === Core.StrategySide.BUY ||
                StrategyEngine.indicatorSide === Core.StrategySide.SELL
            ) {
                Core.EventManager.emit(Core.StrategyEvent.NEW_TARGET);
            }
        }
    }
}
