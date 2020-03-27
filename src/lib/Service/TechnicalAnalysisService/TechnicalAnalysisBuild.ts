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
 * Indicator build.
 */
export abstract class TechnicalAnalysisBuild {
    /**
     * Build.
     */
    public static build(): Promise<void> {
        Core.logger().silly(
            `${Core.timestampHelper()} TechnicalAnalysisServiceBuild::build`
        );
        if (!this.haveTechnicalAnalysis()) {
            Core.logger().silly(
                `${Core.timestampHelper()} TechnicalAnalysisServiceBuild::build Indicator is not set.`
            );
            return Promise.resolve();
        }
        const technicalAnalysis: any = [];
        Core.global.config.technicalAnalysis.forEach(
            (technicalAnalysisConfig) =>
                technicalAnalysis.push(
                    Core.TechnicalAnalysisFactory.createIndicator(
                        technicalAnalysisConfig,
                        Core.global.config.strategy.market
                    )
                )
        );
        return Promise.all(technicalAnalysis)
            .then(
                (technicalAnalysisConfig: any) =>
                    new Core.TechnicalAnalysisService(technicalAnalysisConfig)
            )
            .then((indicator) =>
                Core.EventManager.registerEvent(
                    Core.TechnicalAnalysisEvent.TECHNICAL_ANALYSIS_CHECK,
                    () => indicator.checkIndicator()
                )
            )
            .then(() =>
                Core.ScheduleManager.registerSchedule(
                    Core.TechnicalAnalysisEvent.TECHNICAL_ANALYSIS_CHECK,
                    TechnicalAnalysisBuild.indicatorUpdateTime
                )
            )
            .then(() => Promise.resolve())
            .catch((e) => Promise.reject(e));
    }

    /**
     * Have indicator,
     */
    public static haveTechnicalAnalysis(): boolean {
        return Core.global.config.technicalAnalysis !== undefined;
    }

    /**
     * Update every 10 seconds.
     */
    private static readonly indicatorUpdateTime: number = 10000;
}
