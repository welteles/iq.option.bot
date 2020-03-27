/*
 * Copyright (C) 2020 Wellington Rocha
 * All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 *
 * Proprietary and confidential.
 */
export enum DataEvent {
    UPDATE_BALANCE = "UPDATE_BALANCE",
    UPDATE_PROFILE = "UPDATE_PROFILE",
    UPDATE_INITIALIZATION_DATA = "UPDATE_INITIALIZATION_DATA",
    UPDATE_CANDLE = "UPDATE_CANDLE",
    UPDATE_CANDLE_DISPATCHER = "UPDATE_CANDLE_DISPATCHER",
    ADD_ORDER = "ADD_ORDER",
    ADD_WIN_ORDER = "ADD_WIN_ORDER",
    ADD_LOSE_ORDER = "ADD_LOSE_ORDER",
    REMOVE_ORDER = "REMOVE_ORDER",
    REMOVE_ORDER_DISPATCHER = "REMOVE_ORDER_DISPATCHER"
}
