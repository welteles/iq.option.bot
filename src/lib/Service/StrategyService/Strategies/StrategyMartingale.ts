/*
 * Copyright (C) 2020 Wellington Rocha
 * All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 *
 * Proprietary and confidential.
 */
import BigNumber from "bignumber.js";
import * as IQOption from "iqoption.client";
import * as Core from "../../..";
import { StrategyAbstract } from "./StrategyAbstract";

/**
 * Strategy simple.
 */
export class StrategyMartingale extends StrategyAbstract
    implements Core.IStrategy {
    /**
     * Loses attempts.
     */
    private losses: number = 0;

    /**
     * Martingale max attempts.
     */
    private martingaleMaxAttempts: number = 4;

    /**
     * Indicator observable.
     */
    public indicatorObservable(): Promise<void> {
        return this.asyncLock
            .acquire(Core.StrategyEvent.NEW_TARGET, async () => {
                if (!this.isTradeEnable()) {
                    return Promise.resolve();
                }
                const signal = Core.StrategyEngine.getIndicatorSide();
                Core.logger().info(
                    `${Core.timestampHelper()} StrategyMartingale:indicatorObservable TARGET[${signal}]`
                );
                const iqOptionSide =
                    signal === Core.StrategySide.BUY
                        ? IQOption.IQOptionModel.BUY
                        : IQOption.IQOptionModel.SELL;
                const nextTarget = await this.createNextTarget(
                    this.getAmount(),
                    this.getProfitPercent()
                );
                return Core.IQOptionApi()
                    .sendOrderBinary(
                        this.strategyConfig.market,
                        iqOptionSide,
                        this.getExpirationTime(),
                        Core.data.balance.id,
                        this.getProfitPercent(),
                        nextTarget
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

    /**
     * Get next value.
     *
     * @param amountCalculated
     * @param percentGain
     */
    private async createNextTarget(
        amountCalculated: number,
        percentGain: number
    ): Promise<number> {
        if (this.noHasOrderHistory() || this.isMaxAttempts()) {
            this.resetLosses();
            return amountCalculated;
        }
        const lastOrder = Core.data.ordersHistory[0];
        if (lastOrder.result === IQOption.IQOptionResult.WIN) {
            this.resetLosses();
            return amountCalculated;
        }
        let lossSum = 0;
        let totalOrders = 0;
        for (const order of Core.data.ordersHistory) {
            lossSum = new BigNumber(lossSum).plus(order.amount).toNumber();
            if (totalOrders === this.losses) {
                break;
            }
            totalOrders++;
        }
        this.addLoss();
        const profit = new BigNumber(amountCalculated)
            .times(percentGain)
            .div(100)
            .toNumber();
        const result = new BigNumber(lossSum).plus(profit).toNumber();
        return new BigNumber(result)
            .times(100)
            .div(percentGain)
            .decimalPlaces(2)
            .toNumber();
    }

    /**
     * Is max attempts?
     */
    private isMaxAttempts(): boolean {
        const maxAttempts =
            this.strategyConfig.martingaleMaxAttempts === undefined
                ? this.martingaleMaxAttempts
                : this.strategyConfig.martingaleMaxAttempts;
        return this.losses === maxAttempts;
    }

    /**
     * Reset attempts.
     */
    private resetLosses(): void {
        this.losses = 0;
    }

    /**
     * Add loss.
     */
    private addLoss(): void {
        this.losses++;
    }

    /**
     * No has order history.
     */
    private noHasOrderHistory(): boolean {
        return (
            Core.data.ordersHistory === undefined ||
            Core.data.ordersHistory.length === 0
        );
    }
}
