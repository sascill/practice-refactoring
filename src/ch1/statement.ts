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
    let result = `청구 내역 (고객명: ${invoice.customer})\n`

    function usd(aNumber: number) {
        return new Intl.NumberFormat("es-US",
            {style: "currency", currency: "USD", minimumFractionDigits: 2}).format(aNumber/100)
    }

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

    function volumeCreditsFor(aPerformance: { playId: string; audience: number }) {
        let result = 0
        result += Math.max(aPerformance.audience - 30, 0)
        //희극 관객 5명마다 추가 포인트 제공
        if ("comedy" === playFor(aPerformance).type)
            result += Math.floor(aPerformance.audience / 5)
        return result
    }

    for (let perf of invoice.performances) {
        //청구 내역 출력
        result += `${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience}석)\n` // thisAmount 변수를 인라인화
        totalAmount += amountFor(perf)
    }
    let volumeCredits = 0 //변수 선언부를 반복문 바로 앞으로 이동
    for (let perf of invoice.performances) { //값 누적 로직을 별도 for 문으로 분리
        volumeCredits += volumeCreditsFor(perf)
    }

    result += `총액: ${usd(totalAmount)}\n` //임시 변수 였던 format 을 함수 호출로 대체
    result += `적립 포인트: ${volumeCredits}점\n`

    return result
}

module.exports = statement