"use strict"
interface Iinvoice {
    customer: string
    performances: {
        playId: string,
        audience: number
    }[]
}

interface Iplays {
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

function statement(invoice: Iinvoice, plays: Iplays) {
    let totalAmount = 0
    let volumeCredits = 0
    let result = `청구 내역 (고객명: ${invoice.customer})\n`
    const format = new Intl.NumberFormat("es-US",
        { style: "currency", currency: "USD", minimumFractionDigits: 2}).format

    function amountFor(aPerformance: { playId: string; audience: number }) {
        //인터페이스에 있는 타입을 사용 할 순 없나?
        let result = 0

        switch (playFor(aPerformance).type) {
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
                throw new Error(`알 수 없는 장르: ${playFor(aPerformance).type}`)
        }
        return result;
    }

    function playFor(perf: { playId: string; audience: number }) {
        return plays[perf.playId];
    }

    function volumeCreditsFor(perf: { playId: string; audience: number }) {
        volumeCredits = 0
        volumeCredits += Math.max(perf.audience - 30, 0)
        //희극 관객 5명마다 추가 포인트 제공
        if ("comedy" === playFor(perf).type)
            volumeCredits += Math.floor(perf.audience / 5)
        return volumeCredits
    }

    for (let perf of invoice.performances) {
        //포인트를 적립
        volumeCredits += volumeCreditsFor(perf) // 추출한 함수를 이용하여 값을 누적
        //청구 내역 출력
        result += `${playFor(perf).name}: ${format(amountFor(perf)/100)} (${perf.audience}석)\n` // thisAmount 변수를 인라인화
        totalAmount += amountFor(perf)
    }

    result += `총액: ${format(totalAmount/100)}\n`
    result += `적립 포인트: ${volumeCredits}점\n`

    return result
}

module.exports = statement