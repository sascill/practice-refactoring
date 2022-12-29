"use strict"
import createStatementData from './createStatementData'
import { IInvoice, IPlays } from './interfaces'

function usd(aNumber: number) {
    return new Intl.NumberFormat("es-US",
        {style: "currency", currency: "USD", minimumFractionDigits: 2}).format(aNumber/100)
}

function statement(invoice:IInvoice, plays: IPlays) {
    return renderPlainText(createStatementData(invoice, plays))
}

function renderPlainText(data: IInvoice) {
    let result = `청구 내역 (고객명: ${data.customer})\n`
    for (let perf of data.performances) {
        result += `${perf.play.name}: ${usd(perf.amount)} (${perf.audience}석)\n` // thisAmount 변수를 인라인화
    }
    result += `총액: ${usd(data.totalAmount)}\n`
    result += `적립 포인트: ${data.totalVolumeCredits}점\n`
    return result
}

function htmlStatement(invoice:IInvoice, plays: IPlays) {
    return renderHtml(createStatementData(invoice, plays))
}

function renderHtml(data: IInvoice) {
    let result = `<h1>청구내역 (고객명: ${data.customer})</h1>\n`
    result += `<table>
                <tr>
                    <th>연극</th>
                    <th>좌석 수</th>
                    <th>금액</th>
                </tr>
                ${data.performances.map(performance => {
                    return `<tr>
                        <td>${performance.play.name}</td>
                        <td>${performance.play.name}</td>
                        <td>${performance.play.name}</td>
                    </tr>`        
                })}
               </table>
    `
    return result
}

module.exports = statement