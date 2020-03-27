/*
 * Copyright (C) 2020 Wellington Rocha
 * All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 *
 * Proprietary and confidential.
 */
import * as IQOption from "iqoption.client";

/**
 * Balance.
 */
export const iqOptionFindBalance = (
    balances: IQOption.IQOptionBalance[],
    currency: string,
    test: boolean = false
): IQOption.IQOptionBalance => {
    if (test) {
        return balances.filter(
            (f) => f.type === IQOption.IQOptionCurrencyType.TEST
        )[0];
    }
    return balances.filter(
        (f) =>
            f.currency === currency &&
            f.type === IQOption.IQOptionCurrencyType.FIAT
    )[0];
};
