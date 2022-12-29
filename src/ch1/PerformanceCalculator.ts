import IPerformance from "./interfaces";

export default class PerformanceCalculator {
    private performance: IPerformance;
    constructor(aPerformance: IPerformance) {
        this.performance = aPerformance
    }
}