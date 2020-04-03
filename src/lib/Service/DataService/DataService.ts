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
 * Data service.
 */
export class DataService {
    /**
     * Max candles.
     */
    private readonly maxCandles = 200;

    /**
     * Max orders history.
     */
    private readonly maxOrderHistory = 100;

    /**
     * Last from.
     */
    private lastCandleFrom: number = 0;

    /**
     * Update balance.
     */
    public updateBalance(balance: IQOption.IQOptionBalance): void {
        Core.data.balance = balance;
    }

    /**
     * Update profile.
     */
    public updateProfile(profile: IQOption.IQOptionProfile): void {
        Core.data.profile = profile;
    }

    /**
     * Update initialization data.
     */
    public updateInitializationData(
        initializationData: IQOption.IQOptionInitializationData
    ): void {
        Core.data.initializationData = initializationData;
    }

    /**
     * Add new order.
     */
    public async addOrder(order: IQOption.IQOptionOptionOpened) {
        Core.data.ordersOpen.push(order);
        await this.dataUpdateObsevable();
    }

    /**
     * Add win order.
     *
     * @param order
     */
    public async addWinOrder(order: IQOption.IQOptionOptionClosed) {
        Core.data.win.push(order);
        await this.dataUpdateObsevable();
    }

    /**
     * Add lose order.
     *
     * @param order
     */
    public async addLoseOrder(order: IQOption.IQOptionOptionClosed) {
        Core.data.lose.push(order);
        await this.dataUpdateObsevable();
    }

    /**
     * Remover order.
     */
    public async removeOrder(order: IQOption.IQOptionOptionClosed) {
        Core.data.ordersHistory.unshift(order);
        Core.data.ordersHistory = Core.data.ordersHistory.slice(
            0,
            this.maxOrderHistory
        );
        const index = Core.data.ordersOpen.findIndex(
            (f) => f.option_id === order.option_id
        );
        if (index === -1) {
            return;
        }
        delete Core.data.ordersOpen[index];
        Core.data.ordersOpen = Core.data.ordersOpen.filter(
            (item) => item !== undefined
        );
        Core.EventManager.emit(Core.DataEvent.REMOVE_ORDER_DISPATCHER, order);
        await this.dataUpdateObsevable();
    }

    /**
     * Update candle.
     *
     * @param candle
     */
    public updateCandle(candle: IQOption.IQOptionCandle) {
        if (!this.isNewCandle(candle)) {
            Core.data.candles.open.pop();
            Core.data.candles.high.pop();
            Core.data.candles.low.pop();
            Core.data.candles.volume.pop();
            Core.data.candles.close.pop();
        }
        this.lastCandleFrom = candle.from;
        Core.data.candles.open.push(candle.open);
        Core.data.candles.high.push(candle.max);
        Core.data.candles.low.push(candle.min);
        Core.data.candles.volume.push(candle.volume);
        Core.data.candles.close.push(candle.close);
        Core.data.candles.open = Core.data.candles.open
            .reverse()
            .slice(0, this.maxCandles)
            .reverse();
        Core.data.candles.high = Core.data.candles.high
            .reverse()
            .slice(0, this.maxCandles)
            .reverse();
        Core.data.candles.low = Core.data.candles.low
            .reverse()
            .slice(0, this.maxCandles)
            .reverse();
        Core.data.candles.volume = Core.data.candles.volume
            .reverse()
            .slice(0, this.maxCandles)
            .reverse();
        Core.data.candles.close = Core.data.candles.close
            .reverse()
            .slice(0, this.maxCandles)
            .reverse();
        Core.EventManager.emit(
            Core.DataEvent.UPDATE_CANDLE_DISPATCHER,
            Core.data.candles
        );
    }

    /**
     * Data update observable.
     */
    private async dataUpdateObsevable() {
        return Core.DataStorage.storeData({
            ordersOpen: Core.data.ordersOpen,
            win: Core.data.win,
            lose: Core.data.lose,
            timestamp: new Date().toISOString(),
        });
    }

    /**
     * Is new candle?
     *
     * @param candle
     */
    private isNewCandle(candle: IQOption.IQOptionCandle): boolean {
        return this.lastCandleFrom !== candle.from;
    }
}
