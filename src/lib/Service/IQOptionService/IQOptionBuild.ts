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
 * IQOption build.
 */
export abstract class IQOptionBuild {
    /**
     * Build.
     */
    public static build(): Promise<void> {
        Core.logger().silly(
            `${Core.timestampHelper()} IndicatorServiceBuild::build`
        );
        return Core.IQOptionFactory.createInstance(Core.global.config.account)
            .then(() => Promise.resolve())
            .catch((e) => Promise.reject(e));
    }
}
