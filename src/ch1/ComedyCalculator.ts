import PerformanceCalculator from "./PerformanceCalculator";
import IPerformance, { IPlays } from "./interfaces";

export default class ComedyCalculator extends PerformanceCalculator {
    constructor(aPerformance: IPerformance, aPlay: IPlays) {
        super(aPerformance, aPlay);
    }
    get amount() {
        let result = 30000
        if (this.performance.audience > 20) {
            result += 10000 + 500 * (this.performance.audience - 20)
        }
        result += 300 * this.performance.audience
        return result
    }

    public volumeCredits(): number {
        return super.volumeCredits() + Math.floor(this.performance.audience / 5)
    }

}