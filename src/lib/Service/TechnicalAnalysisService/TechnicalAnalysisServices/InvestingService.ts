/*
 * Copyright (C) 2020 Wellington Rocha
 * All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 *
 * Proprietary and confidential.
 */
import * as IQOption from "iqoption.client";
import * as TechnicalAnalysisInvesting from "technical.analysis.investing";
import * as Core from "../../..";

/**
 * Indicator condition.
 */
export class InvestingService implements Core.ITechnicalAnalysis {
    /**
     * Indicator config.
     */
    private readonly technicalAnalysisInvesting: TechnicalAnalysisInvesting.TechnicalAnalysisInvesting = new TechnicalAnalysisInvesting.TechnicalAnalysisInvesting();

    /**
     * Technical Analysis Config
     */
    private readonly technicalAnalysisConfig: Core.ITechnicalAnalysisConfig;

    /**
     * Market.
     */
    private readonly market: IQOption.IQOptionMarket;

    /**
     * Technical analysis market maker map.
     */
    private readonly technicalAnalysisMarketMap: any = {
        [IQOption.IQOptionMarket.EURUSD]:
            TechnicalAnalysisInvesting.TechnicalAnalysisInvestingMarket.EURUSD,
        [IQOption.IQOptionMarket.NZDUSD]:
            TechnicalAnalysisInvesting.TechnicalAnalysisInvestingMarket.NZDUSD,
        [IQOption.IQOptionMarket.AUDUSD]:
            TechnicalAnalysisInvesting.TechnicalAnalysisInvestingMarket.AUDUSD,
        [IQOption.IQOptionMarket.EURGBP]:
            TechnicalAnalysisInvesting.TechnicalAnalysisInvestingMarket.EURGBP,
        [IQOption.IQOptionMarket.GBPUSD]:
            TechnicalAnalysisInvesting.TechnicalAnalysisInvestingMarket.GBPUSD,
        [IQOption.IQOptionMarket.USDCAD]:
            TechnicalAnalysisInvesting.TechnicalAnalysisInvestingMarket.USDCAD,
        [IQOption.IQOptionMarket.USDCHF]:
            TechnicalAnalysisInvesting.TechnicalAnalysisInvestingMarket.USDCHF,
        [IQOption.IQOptionMarket.USDJPY]:
            TechnicalAnalysisInvesting.TechnicalAnalysisInvestingMarket.USDJPY,
    };

    /**
     * Technical Analysis Time Map.
     */
    private readonly technicalAnalysisTimeMap: any = {
        [Core.TechnicalAnalysisPeriod.PERIOD_1M]:
            TechnicalAnalysisInvesting.TechnicalAnalysisInvestingPeriod
                .ONE_MINUTE,
        [Core.TechnicalAnalysisPeriod.PERIOD_5M]:
            TechnicalAnalysisInvesting.TechnicalAnalysisInvestingPeriod
                .FIVE_MINUTES,
        [Core.TechnicalAnalysisPeriod.PERIOD_15M]:
            TechnicalAnalysisInvesting.TechnicalAnalysisInvestingPeriod
                .FIFTEEN_MINUTES,
        [Core.TechnicalAnalysisPeriod.PERIOD_30M]:
            TechnicalAnalysisInvesting.TechnicalAnalysisInvestingPeriod
                .THIRTY_MINUTES,
        [Core.TechnicalAnalysisPeriod.PERIOD_1H]:
            TechnicalAnalysisInvesting.TechnicalAnalysisInvestingPeriod
                .ONE_HOUR,
        [Core.TechnicalAnalysisPeriod.PERIOD_5H]:
            TechnicalAnalysisInvesting.TechnicalAnalysisInvestingPeriod
                .FIVE_HOURS,
        [Core.TechnicalAnalysisPeriod.PERIOD_DAY]:
            TechnicalAnalysisInvesting.TechnicalAnalysisInvestingPeriod.DAY,
        [Core.TechnicalAnalysisPeriod.PERIOD_WEEK]:
            TechnicalAnalysisInvesting.TechnicalAnalysisInvestingPeriod.WEEK,
        [Core.TechnicalAnalysisPeriod.PERIOD_MONTH]:
            TechnicalAnalysisInvesting.TechnicalAnalysisInvestingPeriod.MONTH,
    };

    /**
     * Investing Service.
     *
     * @param technicalAnalysisConfig
     * @param market
     */
    public constructor(
        technicalAnalysisConfig: Core.ITechnicalAnalysisConfig,
        market: IQOption.IQOptionMarket
    ) {
        this.technicalAnalysisConfig = technicalAnalysisConfig;
        this.market = market;
    }

    /**
     * Check condition.
     */
    public async checkCondition(): Promise<Core.StrategySide | boolean> {
        const analysis = await this.technicalAnalysisInvesting.getAnalysis(
            this.technicalAnalysisMarketMap[this.market],
            this.technicalAnalysisTimeMap[this.technicalAnalysisConfig.period]
        );
        if (
            this.technicalAnalysisConfig.strength ===
            Core.TechnicalAnalysisStrength.LOW
        ) {
            if (
                analysis ===
                    TechnicalAnalysisInvesting
                        .TechnicalAnalysisInvestingResponse.BUY ||
                analysis ===
                    TechnicalAnalysisInvesting
                        .TechnicalAnalysisInvestingResponse.STRONG_BUY
            ) {
                return Core.StrategySide.BUY;
            }
            if (
                analysis ===
                    TechnicalAnalysisInvesting
                        .TechnicalAnalysisInvestingResponse.SELL ||
                analysis ===
                    TechnicalAnalysisInvesting
                        .TechnicalAnalysisInvestingResponse.STRONG_SELL
            ) {
                return Core.StrategySide.SELL;
            }
            return false;
        }
        if (
            analysis ===
            TechnicalAnalysisInvesting.TechnicalAnalysisInvestingResponse
                .STRONG_BUY
        ) {
            return Core.StrategySide.BUY;
        }
        if (
            analysis ===
            TechnicalAnalysisInvesting.TechnicalAnalysisInvestingResponse
                .STRONG_SELL
        ) {
            return Core.StrategySide.SELL;
        }
        return false;
    }
}
