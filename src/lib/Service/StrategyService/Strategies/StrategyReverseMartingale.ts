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
export class StrategyReverseMartingale extends StrategyAbstract
    implements Core.IStrategy {
    /**
     * Loses attempts.
     */
    private losses: number = 0;

    /**
     * Loses attempts.
     */
    private wins: number = 0;

    /**
     * Martingale max attempts.
     */
    private martingaleMaxWins: number = 4;

    /**
     * Indicator observable.
     */
    public indicatorObservable(): Promise<void> {
        return this.asyncLock
            .acquire(Core.StrategyEvent.NEW_TARGET, () => {
                if (!this.isTradeEnable()) {
                    Core.logger().info(
                        `${Core.timestampHelper()} SIGNAL RECEIVE, BUT TRADE IS LOCKED.`
                    );
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
                        this.createNextTarget(
                            this.getAmount(),
                            this.getProfitPercent()
                        )
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
    private createNextTarget(
        amountCalculated: number,
        percentGain: number
    ): number {
        if (
            Core.data.ordersHistory === undefined ||
            Core.data.ordersHistory.length === 0 ||
            this.isMaxWins()
        ) {
            this.resetWins();
            this.resetLosses();
            return amountCalculated;
        }
        const lastOrder = Core.data.ordersHistory[0];
        if (lastOrder.result === "win") {
            return this.createNextTargetWin(amountCalculated, lastOrder);
        }
        return this.createNextTargetLoss(lastOrder);
    }

    /**
     * Create next target win.
     *
     * @param lastOrder
     */
    private createNextTargetWin(
        amountCalculated: number,
        lastOrder: IQOption.IQOptionOptionClosed
    ): number {
        this.addWin();
        if (lastOrder.amount < amountCalculated) {
            return amountCalculated;
        }
        return new BigNumber(lastOrder.amount)
            .times(2)
            .decimalPlaces(2)
            .toNumber();
    }

    /**
     * Create next target loss.
     */
    private createNextTargetLoss(
        lastOrder: IQOption.IQOptionOptionClosed
    ): number {
        this.addLoss();
        return new BigNumber(lastOrder.amount)
            .div(2)
            .decimalPlaces(2)
            .toNumber();
    }

    /**
     * Is max attempts?
     */
    private isMaxWins(): boolean {
        const maxWins = this.martingaleMaxWins;
        return this.wins >= maxWins;
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
     * Reset attempts.
     */
    private resetWins(): void {
        this.wins = 0;
    }

    /**
     * Add win.
     */
    private addWin(): void {
        this.wins++;
    }
}
