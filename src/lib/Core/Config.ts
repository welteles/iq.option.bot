/*
 * Copyright (C) 2020 Wellington Rocha
 * All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 *
 * Proprietary and confidential.
 */
require("dotenv").config();
import * as FileSystem from "fs";
import * as Core from "..";

/**
 * Config.
 */
export abstract class Config {
    /**
     * Build config.
     */
    public static build(): Promise<void> {
        Core.logger().silly(`${Core.timestampHelper()} Config::build`);
        return Config.loadConfig().then(() => Promise.resolve());
    }

    /**
     * Stream Config Sample.
     */
    // private static streamConfigSample(): Promise<void> {
    //     Core.logger().silly(
    //         `${Core.timestampHelper()} Config::streamConfigSample`
    //     );
    //     return Promise.resolve(
    //         FileSystem.watchFile("./config.sample.json", () =>
    //             Config.copySampleFile()
    //         )
    //     );
    // }

    /**
     * Get file name.
     */
    private static getConfigFileName(): Promise<string> {
        const configFile = process.env.CONFIG_FILE;
        if (!configFile) {
            return Promise.reject("Config file not set");
        }
        return Promise.resolve(configFile as string);
    }

    /**
     * Get account enviroment.
     */
    private static getAccountEnviroment(): Promise<{
        email: string;
        password: string;
    }> {
        if (!process.env.EMAIL || !process.env.PASSWORD) {
            return Promise.reject("Email or Password is not set");
        }
        return Promise.resolve({
            email: process.env.EMAIL,
            password: process.env.PASSWORD,
        });
    }

    /**
     * Load config.
     */
    private static loadConfig(): Promise<Core.IConfig> {
        return Promise.all([
            this.getAccountEnviroment(),
            this.getConfigFileName(),
        ]).then(
            (allResponse) =>
                new Promise((resolve, reject) => {
                    const account = allResponse[0];
                    const fileName = allResponse[1];
                    FileSystem.readFile(fileName, (errorMessage, fileRead) => {
                        if (errorMessage) {
                            return reject(errorMessage);
                        }
                        const parseFile = JSON.parse(fileRead.toString());
                        Core.logger().info(
                            `${Core.timestampHelper()} LOAD_CONFIG[${JSON.stringify(
                                parseFile
                            )}]`
                        );
                        Core.global.config = parseFile;
                        Core.global.config.account = account;
                        return resolve(parseFile);
                    });
                }) as any
        );
    }
}
