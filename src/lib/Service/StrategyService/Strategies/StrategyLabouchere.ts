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
export class StrategyLabouchere extends StrategyAbstract
    implements Core.IStrategy {
    /**
     * Labouchere size.
     */
    private labouchereSize: number = 10;

    /**
     * Labouchere System.
     */
    private labouchereSystem: number[] = [];

    /**
     * Indicator observable.
     */
    public indicatorObservable(): Promise<void> {
        return this.asyncLock
            .acquire(Core.StrategyEvent.NEW_TARGET, async () => {
                if (!this.isTradeEnable()) {
                    return Promise.resolve();
                }
                if (this.isResetSystem()) {
                    this.makeSystem();
                }
                return this.createPosition(this.createNextTarget());
            })
            .catch(() => Promise.resolve());
    }

    /**
     * On order closed.
     *
     * @param orderClosed
     */
    public onOrderCloseObservable(
        orderClosed: IQOption.IQOptionOptionClosed
    ): Promise<void> {
        return super.onOrderCloseObservable(orderClosed, false).then(() => {
            if (!this.isThatMarket(orderClosed.active_id)) {
                return Promise.resolve();
            }
            const lastOrder = Core.data.ordersHistory[0];
            if (lastOrder.result === IQOption.IQOptionResult.WIN) {
                this.addWin();
            }
            if (lastOrder.result === IQOption.IQOptionResult.LOOSE) {
                this.addLoss();
            }
            this.unlockTrade();
        });
    }

    /**
     * Is max attempts?
     */
    private getLabouchereSize(): number {
        return this.strategyConfig.labouchereSize === undefined
            ? this.labouchereSize
            : this.strategyConfig.labouchereSize;
    }

    /**
     * Add win.
     */
    private addWin(): void {
        this.labouchereSystem = this.labouchereSystem.slice(
            1,
            this.labouchereSystem.length - 1
        );
    }

    /**
     * Add loss.
     */
    private addLoss(): void {
        const lastOrder = Core.data.ordersHistory[0];
        const lossAmount = new BigNumber(lastOrder.amount)
            .times(100)
            .div(this.getProfitPercent())
            .decimalPlaces(2)
            .toNumber();
        this.labouchereSystem.push(lossAmount);
    }

    /**
     * Make Labouchere.
     */
    private makeSystem() {
        Core.logger().info(
            `${Core.timestampHelper()} StrategyLabouchere:makeSystem`
        );
        let size = 0;
        const amount = this.getAmount();
        const systemSize = this.getLabouchereSize();
        while (size < systemSize) {
            this.labouchereSystem.push(amount);
            size++;
        }
    }

    /**
     * Is reset system?
     */
    private isResetSystem(): boolean {
        return this.labouchereSystem.length === 0;
    }

    /**
     * Get next value.
     */
    private createNextTarget(): number {
        const firstAmount = this.labouchereSystem[0];
        const lastAmount = this.labouchereSystem[
            this.labouchereSystem.length - 1
        ];
        return new BigNumber(firstAmount)
            .plus(lastAmount)
            .decimalPlaces(2)
            .toNumber();
    }
}
