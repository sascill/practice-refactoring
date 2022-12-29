"use strict"

interface IPerformance {
    playId: string,
    audience: number,
    amount: number,
    volumeCredits: number,
    play: {
        name: string,
        type: string
    }
}

interface IInvoice {
    customer: string,
    totalAmount: number,
    totalVolumeCredits: number,
    performances: IPerformance[]
}

interface IPlays {
    [key: string]: {
        name: string,
        type: string
    }
    hamlet: {
        name: string
        type: string
    },
    as_like: {
        name: string
        type: string
    },
    othello: {
        name: string
        type: string
    }
}

function statement(invoice:IInvoice, plays: IPlays) {
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
    return renderPlainText(statementData, plays)

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

function renderPlainText(data: IInvoice, plays: IPlays) {
    let result = `청구 내역 (고객명: ${data.customer})\n`

    for (let perf of data.performances) {
        //청구 내역 출력
        result += `${perf.play.name}: ${usd(perf.amount)} (${perf.audience}석)\n` // thisAmount 변수를 인라인화
    }

    result += `총액: ${usd(data.totalAmount)}\n`
    result += `적립 포인트: ${data.totalVolumeCredits}점\n`

    return result

    function usd(aNumber: number) {
        return new Intl.NumberFormat("es-US",
            {style: "currency", currency: "USD", minimumFractionDigits: 2}).format(aNumber/100)
    }


}

module.exports = statement