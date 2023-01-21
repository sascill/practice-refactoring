export default interface IPerformance {
    playId: string,
    audience: number,
    amount: number,
    volumeCredits: number,
    play: {
        name: string,
        type: string
    }
}

export interface IInvoice {
    customer: string,
    totalAmount: number,
    totalVolumeCredits: number,
    performances: IPerformance[]
}

export interface IPlays {
    name: string,
    type: string
}

