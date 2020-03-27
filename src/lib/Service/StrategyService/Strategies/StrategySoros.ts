/*
 * Copyright (C) 2020 Wellington Rocha
 * All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 *
 * Proprietary and confidential.
 */
import * as IQOption from "iqoption.client";
import * as Core from "../../..";
import { StrategyAbstract } from "./StrategyAbstract";

/**
 * Strategy Soros.
 */
export class StrategySoros extends StrategyAbstract implements Core.IStrategy {
    /**
     * Indicator oberservable.
     */
    public indicatorObservable(): Promise<void> {
        return Promise.resolve();
    }
}
