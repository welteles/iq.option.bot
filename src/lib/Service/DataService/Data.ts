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
 * Data.
 */
export const data: Core.IData = {
    balance: 0,
    ordersOpen: [],
    ordersHistory: [],
    profile: {},
    candles: {
        high: [],
        low: [],
        open: [],
        close: []
    },
    win: [],
    lose: [],
    initializationData: {},
    date: ""
} as any;
