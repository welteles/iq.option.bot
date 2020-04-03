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
     * Get indicator side.
     */
    public static getVolatility(): Core.StrategySide | boolean {
        return IndicatorService.volatility;
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
     * Indicator side.
     */
    private static volatility: Core.StrategySide | boolean = false;

    /**
     * Indicator side.
     */
    private static force: Core.StrategySide | boolean = false;

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
            if( indicator.constructor.name === 'IndicatorEMA' || indicator.constructor.name === 'IndicatorMA'){
                this.movingAverage.push( condition );
            } else {
                this.technicalIndicators.push( condition );
            }
            if(indicator.constructor.name === 'IndicatorATR'){
                IndicatorService.volatility = condition;
            }

            if(indicator.constructor.name === 'IndicatorADX'){
                IndicatorService.force = condition;
            }
        }

        if (Core.global.config.indicator.strong_required  && IndicatorService.force === Core.StrategySide.WEAK) {
            IndicatorService.indicatorSide = Core.StrategySide.NEUTRAL;
            return;
        }

        console.log(this.technicalIndicators);
        console.log(this.movingAverage);

        // count ma and ema
        let ind_sell = 0;
        let ind_buy = 0;
        let ind_neutral = 0;
        for ( const ind of this.movingAverage ){
            if(ind === Core.StrategySide.SELL){
                ind_sell++;
            }else if(ind === Core.StrategySide.BUY){
                ind_buy++
            }else{
                ind_neutral++;
            }
        }

        let ma_sell = 0;
        let ma_buy = 0;
        let ma_neutral = 0;
        for ( const ma of this.technicalIndicators ){
            if(ma === Core.StrategySide.SELL){
                ma_sell++;
            }else if(ma === Core.StrategySide.BUY){
                ma_buy++
            }else{
                ma_neutral++;
            }
        }

        let maIndication = Core.StrategySide.NEUTRAL;
        let indIndication = Core.StrategySide.NEUTRAL;
        if (ma_sell > ma_buy){
            maIndication = (ma_sell-ma_buy > 4) ? Core.StrategySide.STRONG_SELL : Core.StrategySide.SELL;
        } else if (ma_sell < ma_buy) {
            maIndication = (ma_buy-ma_sell > 2) ? Core.StrategySide.STRONG_BUY : Core.StrategySide.BUY;
        }

        if (ind_sell < ind_buy){
            indIndication = (ind_buy-ind_sell > 2) ? Core.StrategySide.STRONG_BUY : Core.StrategySide.BUY;
        } else if (ind_sell > ind_buy) {
            indIndication = (ind_buy-ind_sell > 2) ? Core.StrategySide.STRONG_SELL : Core.StrategySide.SELL;
        }

        if( ( indIndication === Core.StrategySide.STRONG_BUY && maIndication === Core.StrategySide.BUY ) ||
            ( maIndication === Core.StrategySide.STRONG_BUY && indIndication === Core.StrategySide.BUY ) ||
            ( maIndication === Core.StrategySide.STRONG_BUY && indIndication === Core.StrategySide.STRONG_BUY )
        ) {
            indicatorResponse = Core.StrategySide.STRONG_BUY;
        }

        if( ( indIndication === Core.StrategySide.STRONG_SELL && maIndication === Core.StrategySide.SELL ) ||
            ( maIndication === Core.StrategySide.STRONG_SELL && indIndication === Core.StrategySide.SELL ) ||
            ( maIndication === Core.StrategySide.STRONG_SELL && indIndication === Core.StrategySide.STRONG_SELL )
        ) {
            indicatorResponse = Core.StrategySide.STRONG_SELL;
        }

        if( indIndication === Core.StrategySide.BUY && maIndication === Core.StrategySide.BUY ) {
            indicatorResponse = Core.StrategySide.BUY;
        }

        if( indIndication === Core.StrategySide.SELL && maIndication === Core.StrategySide.SELL ) {
            indicatorResponse = Core.StrategySide.SELL;
        }

        console.log('buy: '+ind_buy);
        console.log('sell: '+ind_sell);
        console.log('neutral: '+ind_neutral);

        if (
            indicatorResponse === Core.StrategySide.BUY ||
            indicatorResponse === Core.StrategySide.SELL ||
            indicatorResponse === Core.StrategySide.STRONG_BUY ||
            indicatorResponse === Core.StrategySide.STRONG_SELL
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
