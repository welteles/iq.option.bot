/*
 * Copyright (C) 2020 Wellington Rocha
 * All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 *
 * Proprietary and confidential.
 */

/**
 * Candle.
 */
export interface ICandle {
    /**
     * Open.
     */
    open: number[];

    /**
     * High.
     */
    high: number[];

    /**
     * Low.
     */
    low: number[];

    /**
     * Volume.
     */
    volume: number[]

    /**
     * Close.
     */
    close: number[];
}
