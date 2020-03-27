/*
 * Copyright (C) 2020 Wellington Rocha
 * All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 *
 * Proprietary and confidential.
 */
import * as Core from "../..";
import { StrategyType } from "./Model";

/**
 * Strategy Factory.
 */
export class StrategyFactory {
    /**
     * Create indicator.
     *
     * @param strategyConfig
     */
    public static createInstance(
        strategyConfig: Core.IStrategyConfig
    ): Promise<any> {
        Core.logger().silly(
            `${Core.timestampHelper()} StrategyFactory::createInstance[${
                strategyConfig.strategy
            }]`
        );
        StrategyFactory.instance = this.strategies[strategyConfig.strategy](
            strategyConfig
        );
        return Promise.resolve(StrategyFactory.instance);
    }

    /**
     * Get instance.
     */
    public static getInstance(): Core.IStrategy {
        return StrategyFactory.instance;
    }

    /**
     * Instance.
     */
    private static instance: Core.IStrategy;

    /**
     * Strategies.
     */
    private static readonly strategies: any = {
        [StrategyType.SIMPLE]: (strategyConfig: Core.IStrategyConfig) =>
            new Core.StrategySimple(strategyConfig),
        [StrategyType.MARTINGALE]: (strategyConfig: Core.IStrategyConfig) =>
            new Core.StrategyMartingale(strategyConfig),
        [StrategyType.SOROS]: (strategyConfig: Core.IStrategyConfig) =>
            new Core.StrategySoros(strategyConfig),
        [StrategyType.REVERSE_MARTINGALE]: (
            strategyConfig: Core.IStrategyConfig
        ) => new Core.StrategyReverseMartingale(strategyConfig)
    };
}

/**
 * Alias Strategy.
 */
export const Strategy = (): Core.IStrategy => StrategyFactory.getInstance();
