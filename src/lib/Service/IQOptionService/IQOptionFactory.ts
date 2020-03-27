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
 * IQOption Factory.
 */
export class IQOptionFactory {
    /**
     * Create instance.
     * @param account
     */
    public static createInstance(
        account: Core.IAccount
    ): Promise<IQOption.IQOptionApi> {
        Core.logger().silly(
            `${Core.timestampHelper()} IQOptionFactory::createInstance`
        );
        IQOptionFactory.instance = new IQOption.IQOptionApi(
            account.email,
            account.password
        );
        return Promise.resolve(IQOptionFactory.instance);
    }

    /**
     * Get instance.
     */
    public static getInstance(): IQOption.IQOptionApi {
        return IQOptionFactory.instance;
    }

    /**
     * Instance.
     */
    private static instance: IQOption.IQOptionApi;
}

/**
 * IQOption Alias.
 */
export const IQOptionApi = () => IQOptionFactory.getInstance();
