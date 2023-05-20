export const getLiveDexTrades = (
  tradeSide: string,
  baseAddress: string
): { query: string } => {
  console.log('pressed');
  console.log(tradeSide);
  console.log(baseAddress);
  return {
    query: `
    subscription {
      EVM(network: eth) {
        DEXTrades(
          where: {Trade: {Buy: {Currency: {SmartContract: {is: "${baseAddress}"}}}}}
        ) {
          Trade {
            ${tradeSide} {
              Currency {
                Symbol
                SmartContract
              }
              Price
              Amount
            }
          }
        }
      }
    }
    `,
  };
};

export default getLiveDexTrades;
