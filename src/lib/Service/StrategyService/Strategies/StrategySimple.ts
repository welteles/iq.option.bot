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
 * Strategy simple.
 */
export class StrategySimple extends StrategyAbstract implements Core.IStrategy {
    /**
     * Indicator observable.
     */
    public indicatorObservable(): Promise<void> {
        return this.asyncLock
            .acquire(Core.StrategyEvent.NEW_TARGET, () => {
                if (!this.isTradeEnable()) {
                    return Promise.resolve();
                }
                const signal = Core.StrategyEngine.getIndicatorSide();
                Core.logger().info(
                    `${Core.timestampHelper()} StrategySimple:indicatorObservable TARGET[${signal}]`
                );
                const iqOptionSide =
                    signal === Core.StrategySide.BUY
                        ? IQOption.IQOptionModel.BUY
                        : IQOption.IQOptionModel.SELL;
                return Core.IQOptionApi()
                    .sendOrderBinary(
                        this.strategyConfig.market,
                        iqOptionSide,
                        this.getExpirationTime(),
                        Core.data.balance.id,
                        this.getProfitPercent(),
                        this.getAmount()
                    )
                    .then((order: any) => {
                        this.lockTrade();
                        Core.EventManager.emit(Core.DataEvent.ADD_ORDER, order);
                    })
                    .then(() => Promise.resolve())
                    .catch((e: any) => {
                        Core.logger().error(JSON.stringify(e));
                        return Promise.resolve();
                    });
            })
            .catch(() => Promise.resolve());
    }
}
