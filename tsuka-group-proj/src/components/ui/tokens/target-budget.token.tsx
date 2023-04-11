export interface TargetBudgetTokenProps {
  title: string;
  percentValue: number;
  positive?: boolean;
}

export const TargetBudgetToken: React.FC<TargetBudgetTokenProps> = ({
  title,
  percentValue,
  positive = false,
}) => {
  return (
    <div className="mb-4">
      <div className="px-4 py-2 border border-tsuka-400 text-tsuka-50">
        <p>{title}</p>
      </div>
      <div className="border border-tsuka-400 text-tsuka-100">
        <p
          className={`${
            positive ? "text-green-400" : "text-red-400"
          } mx-4 my-2 text-xs`}
        >
          Target Price
        </p>
        <td className="flex mt-4">
          <div
            className={`${
              positive ? "from-green-400/10" : "from-red-400/10"
            } w-full h-10 bg-gradient-to-t to-transparent`}
          >
            <div
              className={`${
                positive ? "border-green-400" : "border-red-400"
              } border-r-4 h-10`}
              style={{
                width: `${percentValue}%`,
              }}
            />
          </div>
        </td>
      </div>
    </div>
  );
};
