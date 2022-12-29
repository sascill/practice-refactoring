import IPerformance, { IInvoice, IPlays } from './interfaces'

export default function createStatementData(invoice: IInvoice, plays: IPlays) {
    const statementData: IInvoice = {
        customer: '',
        performances: [
            {
                playId:'',
                audience: 0,
                amount: 0,
                volumeCredits: 0,
                play: {
                    name: '',
                    type: ''
                }
            }
        ],
        totalAmount: 0,
        totalVolumeCredits: 0
    }

    statementData.customer = invoice.customer
    statementData.performances = invoice.performances.map(enrichPerformance)
    statementData.totalAmount = totalAmount(statementData)
    statementData.totalVolumeCredits = totalVolumeCredits(statementData)

    return statementData

    function enrichPerformance(aPerformance: IPerformance) {
        const result = Object.assign({}, aPerformance)
        result.play = playFor(result)
        result.amount = amountFor(result)
        result.volumeCredits = volumeCreditsFor(result)
        return result
    }

    function playFor(perf: IPerformance) {
        return plays[perf.playId];
    }

    function amountFor(aPerformance: IPerformance) {
        //인터페이스에 있는 타입을 사용 할 순 없나?
        let result = 0
        switch (aPerformance.play.type) {
            case "tragedy": {
                result = 40000
                if (aPerformance.audience > 30) {
                    result += 1000 * (aPerformance.audience - 30)
                }
            }
                break;
            case "comedy": {
                result = 30000
                if (aPerformance.audience > 20) {
                    result += 10000 + 500 * (aPerformance.audience - 20)
                }
            }
                break;
            default:
                throw new Error(`알 수 없는 장르: ${aPerformance.play.type}`)
        }
        return result;
    }

    function volumeCreditsFor(aPerformance: IPerformance) {
        let result = 0
        result += Math.max(aPerformance.audience - 30, 0)
        //희극 관객 5명마다 추가 포인트 제공
        if ("comedy" === aPerformance.play.type)
            result += Math.floor(aPerformance.audience / 5)
        return result
    }

    function totalVolumeCredits(data: IInvoice): number {
        return data.performances
            .reduce((total, p) => total + p.volumeCredits, 0)
    }

    function totalAmount(data: IInvoice): number {
        return data.performances
            .reduce((total, p) => total + p.amount, 0)
    }
}