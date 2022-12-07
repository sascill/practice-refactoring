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


    function amountFor(play: { name: string; type: string }, aPerformance: { playId: string; audience: number }) { //명확한 이름으로 변경
        //인터페이스에 있는 타입을 사용 할 순 없나?
        let result = 0 //명확한 이름으로 변경

        switch (playFor(aPerformance).type) { //play 를 playFor() 호출로 변경
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
                throw new Error(`알 수 없는 장르: ${playFor(aPerformance).type}`) //play 를 playFor() 호출로 변경
        }
        return result; // 함수안에서 값이 바뀌는 변수를 반환
    }

    function playFor(perf: { playId: string; audience: number }) {
        return plays[perf.playId];
    }

    for (let perf of invoice.performances) {
        let thisAmount = 0
        thisAmount = amountFor(playFor(perf), perf); // playFor 변수를 인라인화
        //포인트를 적립
        volumeCredits += Math.max(perf.audience - 30, 0)
        //희극 관객 5명마다 추가 포인트 제공
        if ("comedy" === playFor(perf).type) volumeCredits += Math.floor(perf.audience / 5) // playFor 변수를 인라인화
        //청구 내역 출력
        result += `${playFor(perf).name}: ${format(thisAmount/100)} (${perf.audience}석)\n` // playFor 변수를 인라인화
        totalAmount += thisAmount
    }

    result += `총액: ${format(totalAmount/100)}\n`
    result += `적립 포인트: ${volumeCredits}점\n`

    return result
}

module.exports = statement