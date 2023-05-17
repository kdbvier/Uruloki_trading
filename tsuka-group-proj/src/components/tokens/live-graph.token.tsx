import { TokenGraphChart } from "../charts/token-graph.chart";

export const LiveGraphToken: React.FC = () => {
  return (
    <div className="h-full md:h-[58%]">
      <div className="bg-tsuka-500 rounded-xl text-tsuka-100 mb-4 md:mb-0 p-4">
        <TokenGraphChart />
      </div>
    </div>
  );
};
