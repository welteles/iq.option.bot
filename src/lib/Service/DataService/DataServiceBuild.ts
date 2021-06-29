/*
 * Copyright (C) 2020 Wellington Rocha
 * All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 *
 * Proprietary and confidential.
 */
import * as Core from "../..";

/**
 * Data service build.
 */
export abstract class DataServiceBuild {
    /**
     * Build.
     */
    public static build(): Promise<void> {
        const dataService = new Core.DataService();
        return Core.DataStorage.readData()
            .then(() =>
                Promise.all([
                    Core.EventManager.registerEvent(
                        Core.DataEvent.ADD_ORDER,
                        (order: any) => dataService.addOrder(order.shift())
                    ),
                    Core.EventManager.registerEvent(
                        Core.DataEvent.ADD_WIN_ORDER,
                        (order: any) => dataService.addWinOrder(order.shift())
                    ),
                    Core.EventManager.registerEvent(
                        Core.DataEvent.ADD_LOSE_ORDER,
                        (order: any) => dataService.addLoseOrder(order.shift())
                    ),
                    Core.EventManager.registerEvent(
                        Core.DataEvent.REMOVE_ORDER,
                        (order: any) => dataService.removeOrder(order.shift())
                    ),
                    Core.EventManager.registerEvent(
                        Core.DataEvent.UPDATE_BALANCE,
                        (balance: any) =>
                            dataService.updateBalance(balance.shift())
                    ),
                    Core.EventManager.registerEvent(
                        Core.DataEvent.UPDATE_PROFILE,
                        (profile: any) =>
                            dataService.updateProfile(profile.shift())
                    ),
                    Core.EventManager.registerEvent(
                        Core.DataEvent.UPDATE_INITIALIZATION_DATA,
                        (initializationData: any) =>
                            dataService.updateInitializationData(
                                initializationData.shift()
                            )
                    ),
                    Core.EventManager.registerEvent(
                        Core.DataEvent.UPDATE_CANDLE,
                        (candle: any) =>
                            dataService.updateCandle(candle.shift())
                    ),
                ])
            )
            .then(() => Promise.resolve())
            .catch((e) => Promise.reject());
    }
}
