import IPerformance, { IInvoice, IPlays } from './interfaces'
import PerformanceCalculator from './PerformanceCalculator'
import TragedyCalculator from './TragedyCalculator'
import ComedyCalculator from './ComedyCalculator'

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

    function createPerformanceCalculator(aPerformance: IPerformance, aPlay: IPlays) {
        switch(aPlay.type) {
            case "tragedy": return new TragedyCalculator(aPerformance, aPlay)
            case "comedy": return new ComedyCalculator(aPerformance, aPlay)
            default:
                throw new Error(`알 수 없는 장르: ${aPlay.type}`)
        }
    }

    function enrichPerformance(aPerformance: IPerformance) {
        const calculator = createPerformanceCalculator(aPerformance, playFor(aPerformance))
        const result = Object.assign({}, aPerformance)
        result.play = calculator.play
        result.amount = calculator.amount
        result.volumeCredits = calculator.volumeCredits()
        return result
    }

    function playFor(perf: IPerformance): IPlays {
        // @ts-ignore
        return plays[perf.playId]
    }

    function amountFor(perf: IPerformance) {
        return new PerformanceCalculator(perf, playFor(perf)).amount
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