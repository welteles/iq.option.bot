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

/**
 * Strategy build.
 */
export abstract class StrategyServiceBuild {
    /**
     * Build.
     */
    public static build(): Promise<void> {
        if (!this.haveAStrategy()) {
            return Promise.reject("Strategy not configured.");
        }
        const strategyEngine = new Core.StrategyEngine();
        const strategyConfig = Core.global.config.strategy;
        strategyConfig.mode = IQOption.IQOptionMode.TURBO;
        if (process.env.MARKET !== undefined) {
            Core.global.config.strategy.market = strategyConfig.market = parseInt(
                process.env.MARKET,
                0
            );
        }
        if (process.env.MODE !== undefined) {
            Core.global.config.strategy.mode = strategyConfig.mode = process.env
                .MODE as IQOption.IQOptionMode;
        }
        return Core.StrategyFactory.createInstance(strategyConfig)
            .then(() =>
                Promise.all([
                    Core.DataServiceBuild.build(),
                    Core.IndicatorServiceBuild.build(),
                    Core.TechnicalAnalysisBuild.build(),
                    Core.StopLossServiceBuild.build(),
                    Core.TakeProfitServiceBuild.build(),
                    Core.IQOptionBuild.build(),
                    Core.EventManager.registerEvent(
                        Core.StrategyEvent.SHOW_INFORMATION,
                        () => Core.strategyInformation()
                    ),
                    Core.EventManager.registerEvent(
                        Core.StrategyEvent.NEW_TARGET,
                        () => Core.Strategy().indicatorObservable()
                    ),
                    Core.EventManager.registerEvent(
                        Core.DataEvent.REMOVE_ORDER_DISPATCHER,
                        (order: any) =>
                            Core.Strategy().onOrderCloseObservable(
                                order.shift()
                            )
                    ),
                    Core.EventManager.registerEvent(
                        Core.StrategyEvent.CHECK_NEW_TARGET,
                        () => strategyEngine.checkNewTarget()
                    ),
                    Core.EventManager.registerEvent(
                        Core.StrategyEvent.LOAD_INITIALIZATION_DATA,
                        () => Core.Strategy().loadInitializationData()
                    ),
                    Core.ScheduleManager.registerSchedule(
                        Core.StrategyEvent.SHOW_INFORMATION,
                        StrategyServiceBuild.showInformationTime
                    ),
                    Core.ScheduleManager.registerSchedule(
                        Core.StrategyEvent.CHECK_NEW_TARGET,
                        StrategyServiceBuild.checkNewTargetTime
                    ),
                    Core.ScheduleManager.registerSchedule(
                        Core.StrategyEvent.LOAD_INITIALIZATION_DATA,
                        StrategyServiceBuild.loadInitializationDataTime
                    ),
                ])
            )
            .then(() => Promise.resolve())
            .catch((e) => Promise.reject(e));
    }

    /**
     * Have a strategy?
     */
    public static haveAStrategy(): boolean {
        return Object.keys(Core.global.config.strategy).length > 8;
    }

    /**
     * Show information time.
     */
    private static readonly showInformationTime: number = 1000;

    /**
     * Show information time.
     */
    private static readonly checkNewTargetTime: number = 100;

    /**
     * Show information time.
     */
    private static readonly loadInitializationDataTime: number = 60000;
}
