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

