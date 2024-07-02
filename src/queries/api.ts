import {fetchAPI} from "../utils/fetchApi";
import {atom, selector} from "recoil";
import {useStore} from "./loadable";

export const SYNE = "SYNE"

const SYNEUnitPriceState = atom<any>({
    key: "SYNEUnitPriceState",
    default: '0',
})

export const useSYNEUnitPrice = () => {
    return useStore(syneUnitPrice, SYNEUnitPriceState)
}
export const syneUnitPrice = selector({
    key: "syneUnitPrice",
    get: async ({ get }) => {
        const prices = get(tokensInfo)
        // return prices.find((item)=> item?.symbol.toUpperCase() === SYNE)?.unitPrice ?? "0"
        return prices.find((item)=> item?.symbol.toUpperCase() === "LOOP")?.unitPrice ?? "0"
    },
})

export const tokensInfo = selector({
    key: "tokensInfo",
    get: async ({ get }) => {
        const fetchAPIQ = get(fetchAPIQuery)
        return fetchAPIQ({name: 'tokenInfo'})
    },
})

export const fetchAPIQuery = selector({
    key: "aggAPIQuery",
    get: ({ get }) => {
        const url = 'https://middlewareapi.loop.markets/v1/juno/'
        return async({ name }: { name: string}) => await fetchAPI(url+ name)
    },
})