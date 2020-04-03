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
            StrategyEngine.indicatorSide = Core.IndicatorService.getIndicatorSide();
            console.log('IQOPTION indicator: '+ StrategyEngine.indicatorSide);
            if (
                ( !Core.global.config.strategy.high_volatility  && Core.IndicatorService.getVolatility() === Core.StrategySide.HIGH ) ||
                ( Core.global.config.strategy.strong_required  && ( StrategyEngine.indicatorSide !== Core.StrategySide.STRONG_SELL && StrategyEngine.indicatorSide !== Core.StrategySide.STRONG_BUY) )
            ){
                return false;
            }

            if (StrategyEngine.indicatorSide === Core.StrategySide.STRONG_BUY) {
                StrategyEngine.indicatorSide = Core.StrategySide.BUY;
            }

            if (StrategyEngine.indicatorSide === Core.StrategySide.STRONG_SELL) {
                StrategyEngine.indicatorSide = Core.StrategySide.SELL;
            }

            if (
                StrategyEngine.indicatorSide === Core.StrategySide.BUY ||
                StrategyEngine.indicatorSide === Core.StrategySide.SELL

            ) {
                Core.EventManager.emit(Core.StrategyEvent.NEW_TARGET);
            }
        }
        // if (Core.TechnicalAnalysisBuild.haveTechnicalAnalysis()) {
        //     Core.enableStrategyInformation();
        //     StrategyEngine.indicatorSide = Core.TechnicalAnalysisService.getIndicatorSide();
        //     if (
        //         StrategyEngine.indicatorSide === Core.StrategySide.BUY ||
        //         StrategyEngine.indicatorSide === Core.StrategySide.SELL
        //     ) {
        //         Core.EventManager.emit(Core.StrategyEvent.NEW_TARGET);
        //     }
        // }
    }
}
