/*
 * Copyright (C) 2020 Wellington Rocha
 * All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 *
 * Proprietary and confidential.
 */
import * as AsyncLock from "async-lock";
import * as IQOption from "iqoption.client";
import * as Core from "../../..";

/**
 * Strategy abstract.
 */
export abstract class StrategyAbstract {
    /**
     * Strategy config.
     */
    protected readonly strategyConfig: Core.IStrategyConfig;

    /**
     * Async lock.
     */
    protected readonly asyncLock: AsyncLock = new AsyncLock({
        maxPending: 1,
    });

    /**
     * Trade is blocked.
     */
    private tradeEnable: boolean = true;

    /**
     * Strategy config.
     *
     * @param strategyConfig
     */
    public constructor(strategyConfig: Core.IStrategyConfig) {
        this.strategyConfig = strategyConfig;
    }

    /**
     * Run strategy.
     */
    public runStrategy(): Promise<void> {
        Core.logger().silly(
            `${Core.timestampHelper()} StrategyAbstract::runStrategy`
        );
        return Core.IQOptionApi()
            .connectAsync()
            .then((profile: any) => this.updateProfile(profile))
            .then(() => this.loadStreamCandles())
            .then(() => this.loadStreamClosedOrders())
            .then(() => this.loadInitializationData())
            .then(() => Core.ScheduleManager.listenerSchedule())
            .catch((e: any) => Promise.reject(e));
    }

    /**
     * Load initialization data.
     */
    public loadInitializationData(): Promise<void> {
        Core.logger().silly(
            `${Core.timestampHelper()} StrategyAbstract::loadInitializationData`
        );
        return Core.IQOptionApi()
            .getInitializationData()
            .then((data: any) =>
                Core.EventManager.emit(
                    Core.DataEvent.UPDATE_INITIALIZATION_DATA,
                    data
                )
            )
            .catch((e: any) => Promise.reject(e));
    }

    /**
     * On order closed.
     *
     * @param orderClosed
     * @param unlockTrade
     */
    public onOrderCloseObservable(
        orderClosed: IQOption.IQOptionOptionClosed,
        unlockTrade: boolean = true
    ): Promise<void> {
        return this.asyncLock
            .acquire(Core.DataEvent.REMOVE_ORDER_DISPATCHER, () => {
                if (!this.isThatMarket(orderClosed.active_id)) {
                    return Promise.resolve();
                }
                Core.logger().info(
                    `${Core.timestampHelper()} StrategyAbstract:onOrderCloseObservable RESULT[${
                        orderClosed.result
                    }]`
                );
                if (orderClosed.result === IQOption.IQOptionResult.WIN) {
                    Core.EventManager.emit(
                        Core.DataEvent.ADD_WIN_ORDER,
                        orderClosed
                    );
                    return;
                }
                if (orderClosed.result === IQOption.IQOptionResult.LOOSE) {
                    Core.EventManager.emit(
                        Core.DataEvent.ADD_LOSE_ORDER,
                        orderClosed
                    );
                }
                if (unlockTrade) {
                    this.unlockTrade();
                }
            })
            .catch(() => Promise.resolve());
    }

    /**
     * Is trade enable?
     */
    protected isTradeEnable(): boolean {
        return (
            this.tradeEnable && Core.StrategyEngine.getIndicatorSide() !== false
        );
    }

    /**
     * Unlock trades.
     */
    protected unlockTrade(): void {
        this.tradeEnable = true;
    }

    /**
     * Lock trades.
     */
    protected lockTrade(): void {
        this.tradeEnable = false;
    }

    /**
     * Get amount.
     */
    protected getAmount(): number {
        return Core.orderAmountHelper(
            this.strategyConfig.value,
            this.strategyConfig.balanceAvailable,
            this.strategyConfig.valueType
        );
    }

    /**
     * Get expiration time.
     */
    protected getExpirationTime(): number {
        return IQOption.iqOptionExpired(this.strategyConfig.time);
    }

    /**
     * Get percent gain.
     */
    protected getProfitPercent(): number {
        return Core.iQOptionFindProfitPercent(
            Core.data.initializationData,
            this.strategyConfig.market,
            this.strategyConfig.mode!
        );
    }

    /**
     * No has order history.
     */
    protected noHasOrderHistory(): boolean {
        return (
            Core.data.ordersHistory === undefined ||
            Core.data.ordersHistory.length === 0
        );
    }

    /**
     * Create position.
     *
     * @param amount
     */
    protected createPosition(amount: number): Promise<void> {
        const signal = Core.StrategyEngine.getIndicatorSide();
        Core.logger().info(
            `${Core.timestampHelper()} CREATE_POSITION TARGET[${signal}]`
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
                amount
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
    }

    /**
     * Is that market.
     *
     * @param market
     */
    protected isThatMarket(market: IQOption.IQOptionMarket): boolean {
        return this.strategyConfig.market === market;
    }

    /**
     * Update profile.
     *
     * @param profile
     */
    private updateProfile(profile: IQOption.IQOptionProfile): Promise<void> {
        Core.EventManager.emit(Core.DataEvent.UPDATE_PROFILE, profile);
        Core.EventManager.emit(
            Core.DataEvent.UPDATE_BALANCE,
            Core.iqOptionFindBalance(
                profile.balances,
                this.strategyConfig.balanceInCurrency,
                this.strategyConfig.test
            )
        );
        return Promise.resolve();
    }

    /**
     * Load Candles.
     */
    private loadStreamCandles(): Promise<void> {
        if (!Core.IndicatorServiceBuild.haveIndicator()) {
            return Promise.resolve();
        }
        Core.logger().silly(
            `${Core.timestampHelper()} StrategyAbstract::loadStreamCandles`
        );
        const candleStream = new IQOption.IQOptionStreamCandleGenerated(
            Core.IQOptionApi().getIQOptionWs(),
            this.strategyConfig.market,
            Core.global.config.indicator.time
        );
        return candleStream
            .startStream()
            .then(() =>
                candleStream.on("data", (data) =>
                    Core.EventManager.emit(Core.DataEvent.UPDATE_CANDLE, data)
                )
            )
            .then(() => Promise.resolve())
            .catch((e) => Promise.reject(e));
    }

    /**
     * Load close orders.
     */
    private loadStreamClosedOrders(): Promise<void> {
        Core.logger().silly(
            `${Core.timestampHelper()} StrategyAbstract::loadStreamClosedOrders`
        );
        const closeOrdersStream = new IQOption.IQOptionStreamOptionClose(
            Core.IQOptionApi().getIQOptionWs(),
            this.strategyConfig.market
        );
        return closeOrdersStream
            .startStream()
            .then(() =>
                closeOrdersStream.on("data", (data) =>
                    Core.EventManager.emit(Core.DataEvent.REMOVE_ORDER, data)
                )
            )
            .then(() => Promise.resolve())
            .catch((e) => Promise.reject(e));
    }
}
