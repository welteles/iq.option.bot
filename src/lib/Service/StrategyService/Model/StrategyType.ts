/*
 * Copyright (C) 2020 Wellington Rocha
 * All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 *
 * Proprietary and confidential.
 */

/**
 * Strategy types.
 */
export enum StrategyType {
    /**
     * Simple continuos trade.
     */
    SIMPLE = "SIMPLE",

    /**
     * Strategy George Soros.
     */
    SOROS = "SOROS",

    /**
     * Strategy Martingale.
     */
    MARTINGALE = "MARTINGALE",
    /**
     * Strategy Anti Martingale.
     */
    REVERSE_MARTINGALE = "REVERSE_MARTINGALE"
}
