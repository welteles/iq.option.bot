/*
 * Copyright (C) 2020 Wellington Rocha
 * All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 *
 * Proprietary and confidential.
 */
import BigNumber from "bignumber.js";
import * as Core from "../..";

/**
 * Strategy information local variable.
 */
let strategyInformationEnable: boolean = false;

/**
 *
 */
let lastMessageInformation: string = "";

/**
 * Enable Strategy information.
 */
export const enableStrategyInformation = (): void => {
    strategyInformationEnable = true;
};

/**
 * Disable Strategy information.
 */
export const disableStrategyInformation = (): void => {
    strategyInformationEnable = false;
};

/**
 * Strategy information.
 */
export const strategyInformation = () => {
    if (!strategyInformationEnable) {
        return;
    }
    const openOrder = Core.data.ordersOpen[0];
    const amount = openOrder === undefined ? 0 : openOrder.amount;
    const market = openOrder === undefined ? "" : openOrder.active;
    const winSum =
        Core.data.win.length > 0
            ? Core.data.win.reduce(
                  (a, b) =>
                      new BigNumber(a)
                          .plus(new BigNumber(b.profit_amount).minus(b.amount))
                          .decimalPlaces(2)
                          .toNumber(),
                  0
              )
            : 0;
    const loseSum =
        Core.data.lose.length > 0
            ? Core.data.lose.reduce(
                  (a, b) => new BigNumber(a).plus(b.amount).toNumber(),
                  0
              )
            : 0;
    const result = new BigNumber(winSum)
        .minus(loseSum)
        .decimalPlaces(2)
        .toNumber();
    const messageInformation = `POSITION_AMOUNT[${amount}] MARKET[${market}] WINS[${Core.data.win.length}] LOSES[${Core.data.lose.length}] RESULT[${result}]`;
    if (lastMessageInformation !== messageInformation && amount) {
        lastMessageInformation = messageInformation;
        Core.logger().info(`${Core.timestampHelper()} ${messageInformation}`);
    }
};
