import IPerformance, { IPlays } from "./interfaces";

export default class PerformanceCalculator {
    public performance: IPerformance
    public play: IPlays
    constructor(aPerformance: IPerformance, aPlay: IPlays) {
        this.performance = aPerformance
        this.play = aPlay
    }

    get amount(): number|void {
        throw new Error('서브 클래스에서 처리하도록 설계 되었습니다.')
    }

    public volumeCredits(): number {
        return Math.max(this.performance.audience - 30, 0)
    }

}