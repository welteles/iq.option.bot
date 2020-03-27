/*
 * Copyright (C) 2020 Wellington Rocha
 * All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 *
 * Proprietary and confidential.
 */
import * as FileSystem from "fs";
import moment = require("moment");
import * as Core from "../..";

/**
 * Data storage.
 */
export class DataStorage {
    /**
     * Store data.
     */
    public static storeData(data: any): Promise<void> {
        return new Promise((resolve, reject) =>
            FileSystem.writeFile(
                this.file,
                JSON.stringify(data),
                (err: any) => {
                    if (err) {
                        reject(err);
                    }
                    return resolve();
                }
            )
        );
    }

    /**
     * Read data.
     */
    public static readData(): Promise<Core.IData | void> {
        Core.logger().silly(`${Core.timestampHelper()} DataStorage::readData`);
        return new Promise((resolve, reject) => {
            FileSystem.readFile(this.file, (error, fileRead) => {
                if (error) {
                    return reject(error);
                }
                if (!fileRead.toString()) {
                    return Promise.resolve();
                }
                const parseFile: Core.IData = JSON.parse(fileRead.toString());
                if (Object.keys(parseFile).length > 0) {
                    return Promise.resolve();
                }
                if (
                    moment(parseFile.timestamp).format("YYYY-mm-dd") !==
                    moment().format("YYYY-mm-dd")
                ) {
                    return Promise.resolve(DataStorage.clearData());
                }
                Core.data.lose = parseFile.lose;
                Core.data.win = parseFile.win;
                Core.data.ordersOpen = parseFile.ordersOpen;
                Core.data.timestamp = parseFile.timestamp;
                return resolve(parseFile);
            });
        });
    }

    /**
     * Clear data.
     */
    public static clearData(): Promise<void> {
        return this.storeData({});
    }
    /**
     * File.
     */
    private static readonly file: string = "./data.json";
}
