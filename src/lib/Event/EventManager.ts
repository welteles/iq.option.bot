/*
 * Copyright (C) 2020 Wellington Rocha
 * All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 *
 * Proprietary and confidential.
 */
import * as EventEmitter from "events";
import * as Core from "../";

/**
 * Event Manager.
 */
export abstract class EventManager {
    /**
     * Load event emitter.
     */
    public static build(): EventEmitter {
        Core.logger().silly(
            `${Core.timestampHelper()} EventManager::loadEventEmitter`
        );
        if (!EventManager.eventEmitter) {
            EventManager.eventEmitter = new EventEmitter();
        }
        return EventManager.eventEmitter;
    }

    /**
     * Register event.
     *
     * @param eventName
     * @param event
     */
    public static registerEvent(
        eventName:
            | Core.StopLossEvent
            | Core.IQOptionEvent
            | Core.TechnicalAnalysisEvent
            | Core.IndicatorEvent
            | Core.StrategyEvent
            | Core.DataEvent,
        event: any
    ): string {
        Core.logger().silly(
            `${Core.timestampHelper()} EventManager::registerEvent[${eventName}]`
        );
        this.eventEmitter.on(eventName, args => event(args));
        return eventName;
    }

    /**
     * Register event.
     *
     * @param eventName
     * @param event
     */
    public static removeEvent(
        eventName:
            | Core.StopLossEvent
            | Core.IQOptionEvent
            | Core.TechnicalAnalysisEvent
            | Core.IndicatorEvent
            | Core.StrategyEvent
            | Core.DataEvent,
        event: any
    ): string {
        Core.logger().silly(
            `${Core.timestampHelper()} EventManager::removeEvent[${eventName}]`
        );
        this.eventEmitter.removeListener(eventName, args => event(args));
        return eventName;
    }

    /**
     * Emit event.
     *
     * @param eventName
     * @param args
     */
    public static emit(
        eventName:
            | Core.StopLossEvent
            | Core.IQOptionEvent
            | Core.TechnicalAnalysisEvent
            | Core.IndicatorEvent
            | Core.StrategyEvent
            | Core.DataEvent,
        ...args: any
    ): void {
        Core.logger().silly(
            `${Core.timestampHelper()} EventManager::emit[${eventName}]`
        );
        this.eventEmitter.emit(eventName, args);
    }

    /**
     * Event emitter.
     */
    private static eventEmitter: EventEmitter;
}
