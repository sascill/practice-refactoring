import IPerformance, { IPlays } from "./interfaces";

export default class PerformanceCalculator {
    public performance: IPerformance
    public play: IPlays
    constructor(aPerformance: IPerformance, aPlay: IPlays) {
        this.performance = aPerformance
        this.play = aPlay
    }

    get amount() {
        let result = 0
        switch (this.play.type) {
            case "tragedy": {
                result = 40000
                if (this.performance.audience > 30) {
                    result += 1000 * (this.performance.audience - 30)
                }
            }
                break;
            case "comedy": {
                result = 30000
                if (this.performance.audience > 20) {
                    result += 10000 + 500 * (this.performance.audience - 20)
                }
            }
                break;
            default:
                throw new Error(`알 수 없는 장르: ${this.performance.play.type}`)
        }
        return result;
    }

    get volumeCredits() {
        let result = 0
        result += Math.max(this.performance.audience - 30, 0)
        //희극 관객 5명마다 추가 포인트 제공
        if ("comedy" === this.play.type)
            result += Math.floor(this.performance.audience / 5)
        return result
    }
}