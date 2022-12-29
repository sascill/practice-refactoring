"use strict"
import createStatementData from './createStatementData'
import { IInvoice, IPlays } from './interfaces'

function statement(invoice:IInvoice, plays: IPlays) {
    return renderPlainText(createStatementData(invoice, plays))
}

function renderPlainText(data: IInvoice) {
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