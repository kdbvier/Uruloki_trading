import { TokenGraphChart } from "../charts/token-graph.chart";

export interface LiveGraphTokenProps {
  token: {
    id: string;
    token: string;
  };
}

export const LiveGraphToken: React.FC<LiveGraphTokenProps> = ({ token }) => {
  return (
    <div className="h-full md:h-[58%]">
      <div className="bg-tsuka-500 h-full rounded-xl text-tsuka-100 mb-4 md:mb-0 p-4">
        <TokenGraphChart token={token.token} />
      </div>
    </div>
  );
};
