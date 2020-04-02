/*
 * Copyright (C) 2020 Wellington Rocha
 * All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 *
 * Proprietary and confidential.
 */
import * as Core from "../..";

/**
 * Stop loss service.
 */
export class IndicatorService {
    /**
     * Get indicator side.
     */
    public static getIndicatorSide(): Core.StrategySide | boolean {
        return IndicatorService.indicatorSide;
    }

    /**
     * Is candles minimum?
     */
    public static isCandlesMinimum(): boolean {
        return (
            IndicatorService.candles !== undefined &&
            IndicatorService.candles.open.length >= IndicatorService.minCandles
        );
    }

    /**
     * Indicator side.
     */
    private static indicatorSide: Core.StrategySide | boolean = false;

    /**
     * Min candles.
     */
    private static minCandles: number = 40;

    /**
     * Candles.
     */
    private static candles: Core.ICandle;

    /**
     * IndicatorServices.
     */
    private readonly indicators: Core.IIndicator[];

    /**
     * Message load candles.
     */
    private messageLoadCandlesEnable: boolean = true;

    /**
     * Strategy.
     */
    private technicalIndicators: any[];

    /**
     * movingAverage.
     */
    private movingAverage: any[];

    /**
     * Indicator Service.
     *
     * @param indicators
     * @param minCandles
     */
    public constructor(indicators: Core.IIndicator[], minCandles: number) {
        this.indicators = indicators;
        this.technicalIndicators = [];
        this.movingAverage = [];
        IndicatorService.minCandles = minCandles;
    }

    /**
     * Check indicator.
     *
     * @param candles
     */
    public checkIndicator(candles: Core.ICandle): void {
        let indicatorResponse: Core.StrategySide | boolean = false;
        IndicatorService.candles = candles;
        if (!IndicatorService.isCandlesMinimum()) {
            this.messageLoadCandles();
            return;
        }
        IndicatorService.indicatorSide = false;
        this.technicalIndicators = [];
        this.movingAverage = [];
        Core.logger().info(
            `${Core.timestampHelper()} datetime`
        );
        for (const indicator of this.indicators) {
            const condition = indicator.checkCondition(candles);
            indicatorResponse = condition;
            console.log(indicator.constructor.name+' - '+ indicator.index);
            if( indicator.constructor.name === 'IndicatorEMA' || indicator.constructor.name === 'IndicatorMA'){
                this.movingAverage.push( condition );
            } else {
                this.technicalIndicators.push( condition );
            }
        }
        console.log(this.technicalIndicators);
        console.log(this.movingAverage);

        if (
            indicatorResponse === Core.StrategySide.BUY ||
            indicatorResponse === Core.StrategySide.SELL
        ) {
            IndicatorService.indicatorSide = indicatorResponse;
        }
    }

    /**
     * Message load candles.
     */
    private messageLoadCandles(): void {
        if (this.messageLoadCandlesEnable) {
            Core.logger().info(
                `${Core.timestampHelper()} Wait for the minimum loading of candles.`
            );
            this.messageLoadCandlesEnable = false;
        }
    }
}
