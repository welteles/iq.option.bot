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
     * On order closed.
     *
     * @param orderClosed
     */
    public onOrderCloseObservable(
        orderClosed: IQOption.IQOptionOptionClosed
    ): Promise<void> {
        return super.onOrderCloseObservable(orderClosed, false).then(() => {
            const lastOrder = Core.data.ordersHistory[0];
            if (lastOrder.result === IQOption.IQOptionResult.WIN) {
                this.resetLosses();
            }
            if (lastOrder.result === IQOption.IQOptionResult.LOOSE) {
                this.addLoss();
            }
            this.unlockTrade();
        });
    }

    /**
     * Indicator observable.
     */
    public indicatorObservable(): Promise<void> {
        return this.asyncLock
            .acquire(Core.StrategyEvent.NEW_TARGET, async () => {
                if (!this.isTradeEnable()) {
                    return Promise.resolve();
                }
                return this.createPosition(
                    this.createNextTarget(
                        this.getAmount(),
                        this.getProfitPercent()
                    )
                );
            })
            .catch(() => Promise.resolve());
    }

    /**
     * Get next value.
     *
     * @param amountCalculated
     * @param percentGain
     */
    private createNextTarget(
        amountCalculated: number,
        percentGain: number
    ): number {
        if (this.noHasOrderHistory() || this.isMaxAttempts()) {
            this.resetLosses();
            return amountCalculated;
        }
        const lastOrder = Core.data.ordersHistory[0];
        if (lastOrder.result === IQOption.IQOptionResult.WIN) {
            return amountCalculated;
        }
        let lossSum = 0;
        let totalOrders = 0;
        for (const order of Core.data.ordersHistory) {
            if (totalOrders === this.losses) {
                break;
            }
            lossSum = new BigNumber(lossSum).plus(order.amount).toNumber();
            totalOrders++;
        }
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
}
