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
export abstract class IndicatorServiceBuild {
    /**
     * Build.
     */
    public static build(): Promise<void> {
        Core.logger().silly(
            `${Core.timestampHelper()} IndicatorServiceBuild::build`
        );
        if (!this.haveIndicator()) {
            Core.logger().silly(
                `${Core.timestampHelper()} IndicatorServiceBuild::build Indicator is not set.`
            );
            return Promise.resolve();
        }
        const conditions: any = [];
        const indicator = Core.global.config.indicator;
        indicator.conditions.forEach(conditionConfig =>
            conditions.push(
                Core.IndicatorFactory.createIndicator(conditionConfig)
            )
        );
        return Promise.all(conditions)
            .then(
                (condition: any) =>
                    new Core.IndicatorService(condition, indicator.minCandles)
            )
            .then(indicatorService =>
                Core.EventManager.registerEvent(
                    Core.DataEvent.UPDATE_CANDLE_DISPATCHER,
                    (candles: any) =>
                        indicatorService.checkIndicator(candles.shift())
                )
            )
            .then(() => Promise.resolve())
            .catch(e => Promise.reject(e));
    }

    /**
     * Have indicator,
     */
    public static haveIndicator(): boolean {
        return (
            Core.global.config.indicator !== undefined &&
            Object.keys(Core.global.config.indicator).length > 0
        );
    }
}
