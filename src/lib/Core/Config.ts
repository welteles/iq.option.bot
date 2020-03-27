/*
 * Copyright (C) 2020 Wellington Rocha
 * All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 *
 * Proprietary and confidential.
 */
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
        return this.copySampleFile()
            .then(() => this.streamConfigSample())
            .then(() => Promise.resolve())
            .catch((e) => Promise.reject(e));
    }

    /**
     * Stream Config Sample.
     */
    private static streamConfigSample(): Promise<void> {
        Core.logger().silly(
            `${Core.timestampHelper()} Config::streamConfigSample`
        );
        return Promise.resolve(
            FileSystem.watchFile("./config.sample.json", () =>
                Config.copySampleFile()
            )
        );
    }

    /**
     * Copy sample file.
     */
    private static copySampleFile(): Promise<void> {
        return new Promise((resolve, reject) => {
            FileSystem.copyFile(
                "config.sample.json",
                "config.json",
                (err: any) => {
                    if (err) {
                        reject(err);
                    }
                    resolve();
                }
            );
        })
            .then(() => Config.loadConfig())
            .then(() => Promise.resolve())
            .catch((e) => Promise.reject(e));
    }

    /**
     * Load config.
     */
    private static loadConfig(): Promise<Core.IConfig> {
        return new Promise((resolve, reject) => {
            FileSystem.readFile("./config.json", (errorMessage, fileRead) => {
                if (errorMessage) {
                    return reject(errorMessage);
                }
                const parseFile = JSON.parse(fileRead.toString());
                Core.logger().info(
                    `${Core.timestampHelper()} Config::loadConfig[${JSON.stringify(
                        parseFile
                    )}]`
                );
                Core.global.config = parseFile;
                return resolve(parseFile);
            });
        });
    }
}
