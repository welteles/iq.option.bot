/*
 * Copyright (C) 2020 Wellington Rocha LLC
 * All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 *
 * Proprietary and confidential.
 */
import * as Core from "../";

/**
 * Schedule Manager.
 */
export abstract class ScheduleManager {
    /**
     * Register Schedule
     *
     * @param eventName
     * @param updateTime
     */
    public static registerSchedule(
        eventName:
            | Core.StopLossEvent
            | Core.IQOptionEvent
            | Core.TechnicalAnalysisEvent
            | Core.StrategyEvent
            | Core.DataEvent,
        updateTime?: number
    ) {
        if (updateTime) {
            Core.logger().silly(
                `${Core.timestampHelper()} ScheduleManager::registerSchedule[${eventName}]`
            );
            ScheduleManager.schedules[eventName] = {
                updateTime,
            };
        }
    }

    /**
     * Listener Schedule.
     */
    public static listenerSchedule() {
        Core.logger().silly(
            `${Core.timestampHelper()} ScheduleManager::listenerSchedule`
        );
        Object.keys(ScheduleManager.schedules).forEach((eventName) => {
            const event = eventName as any;
            ScheduleManager.schedules[event].action = setInterval(
                () => Core.EventManager.emit(event),
                ScheduleManager.schedules[eventName].updateTime
            );
        });
    }

    /**
     * Schedules.
     */
    private static schedules: {
        [index: string]: {
            /**
             * Update time.
             */
            updateTime: number;

            /**
             * Action.
             */
            action?: any;
        };
    } = {};
}
