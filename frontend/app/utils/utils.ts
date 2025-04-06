// CryptoCard.tsx

export const formatUsdPrice = (price: number) => {
    return price.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};

export const formatBtcPrice = (price: number) => {
    const decimals = price < 0.001 ? 8 : 6;
    return price.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
};