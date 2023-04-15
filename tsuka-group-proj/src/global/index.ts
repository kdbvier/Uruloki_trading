export interface ITopGainersTokenProps {
  topGainers: ITopGainer[]
}

export interface IMostBuyOrdersTokenProps {
  mostBuyOrders: IMostBuyOrder[]
}

export interface IMostSellOrdersTokenProps {
  mostSellOrders: IMostSellOrder[]
}

export interface ITopMoversTokenProps {
  topMovers: ITopMover[]
}

export interface ITopGainer {
  token: {
    id: string;
    name: string;
    shortName: string;
    imgUrl: string;
  };
  price: number;
  risingPercent: number;
}

export interface IMostBuyOrder {
  token: {
    id: string;
    name: string;
    shortName: string;
    imgUrl: string;
  };
  buyOrders: number;
}

export interface IMostSellOrder {
  token: {
    id: string;
    name: string;
    shortName: string;
    imgUrl: string;
  };
  sellOrders: number;
}

export interface ITopMover {
  id: number;
  token: string;
  chain: {
    id: string;
    name: string;
    shortName: string;
    imgUrl: string;
  };
  price: number;
  risingPercent: number;
  volume: number;
  marketCap: number;
  orderCount: number;
  buyOrderCount: number;
  sellOrderCount: number;
}
