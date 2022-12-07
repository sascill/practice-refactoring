// @ts-ignore
import invoicesJson from './invoices.json'
// @ts-ignore
import playsJson from './plays.json'

const statementTest = require('./statement');

test("statementTest", () => {
    const expected = `청구 내역 (고객명: BigCo)\nHamlet: $650.00 (55석)\nAs You Like It: $475.00 (35석)\nOthello: $500.00 (40석)\n총액: $1,625.00\n적립 포인트: 47점\n`
    const result = statementTest(invoicesJson, playsJson)
    expect(result).toEqual(expected)
});