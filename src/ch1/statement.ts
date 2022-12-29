"use strict"
interface IInvoice {
    customer: string
}

interface IPerformances extends IInvoice {
    performances: {
        playId: string,
        audience: number,
        play: {
            name: string,
            type: string
        }
    }[]
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
    const statementData = {
        customer: '',
        performances: [
            {
                playId:'',
                audience: 0,
                play: {
                    name: '',
                    type: ''
                }
            }
        ]
    }

    statementData.customer = invoice.customer
    // @ts-ignore
    statementData.performances = invoice.performances.map(enrichPerformance)
    return renderPlainText(statementData, plays)

    function enrichPerformance(aPerformance: { playId: string; audience: number }) {
        const result = Object.assign({}, aPerformance)
        // @ts-ignore
        result.play = playFor(result)
        return result
    }

    function playFor(perf: { playId: string; audience: number }) {
        return plays[perf.playId];
    }
}
function renderPlainText(data: IPerformances, plays: IPlays) {
    let result = `청구 내역 (고객명: ${data.customer})\n`

    for (let perf of data.performances) {
        //청구 내역 출력
        result += `${perf.play?.name}: ${usd(amountFor(perf))} (${perf.audience}석)\n` // thisAmount 변수를 인라인화
    }

    result += `총액: ${usd(totalAmount())}\n`
    result += `적립 포인트: ${totalVolumeCredits()}점\n`

    return result

    function usd(aNumber: number) {
        return new Intl.NumberFormat("es-US",
            {style: "currency", currency: "USD", minimumFractionDigits: 2}).format(aNumber/100)
    }

    function amountFor(aPerformance: {
            playId: string,
            audience: number
            play?: {
                name:string,
                type:string
            }
        }) {
        //인터페이스에 있는 타입을 사용 할 순 없나?
        let result = 0
        switch (aPerformance.play?.type) {
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
                throw new Error(`알 수 없는 장르: ${aPerformance.play?.type}`)
        }
        return result;
    }

    function volumeCreditsFor(aPerformance: { playId: string; audience: number, play: { name: string, type:string} }) {
        let result = 0
        result += Math.max(aPerformance.audience - 30, 0)
        //희극 관객 5명마다 추가 포인트 제공
        if ("comedy" === aPerformance.play.type)
            result += Math.floor(aPerformance.audience / 5)
        return result
    }

    function totalVolumeCredits(): number {
        let result = 0
        for (let perf of data.performances) { //값 누적 로직을 별도 for 문으로 분리
            result += volumeCreditsFor(perf)
        }
        return result
    }

    function totalAmount(): number {
        let result = 0
        for (let perf of data.performances) {
            result += amountFor(perf);
        }
        return result
    }
}

module.exports = statement