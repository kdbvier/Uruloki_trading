import { StatusSpan } from "@/components/ui/spans/status.span"
import { OrderToken, StrategyStatusEnum } from "@/types"
import Link from "next/link"
import { MdArrowForward } from "react-icons/md"

interface Props {
    title: string
    orderTokens: Array<OrderToken>
    createdAt: string
    id: string
    status: StrategyStatusEnum
  }
  
const SetupsTableRow: React.FC<Props> = ({title, orderTokens, createdAt, id, status}) => {
    return (
      <tr
        className="border-b align-baseline border-tsuka-400 text-base w-full text-left"
      >
        <td className="py-2 px-4 text-tsuka-50 text-sm font-normal whitespace-nowrap">
          {title}
        </td>
        {orderTokens.length == 0 && (
          <td
            className="flex py-2 px-4 text-tsuka-50 text-sm font-normal whitespace-nowrap"
          >
            <div className="flex text-tsuka-200 items-center font-medium py-1">
            </div>
            <div className="my-auto ml-auto mr-8 min-w-[128px]">
              <StatusSpan status={status} />
            </div>
          </td>
        )}
        {orderTokens?.map(
          (
            { network, name1, name2, code1, code2, status },
            index
          ) => (
            <td
              key={index}
              className="flex py-2 px-4 text-tsuka-50 text-sm font-normal whitespace-nowrap"
            >
              <div className="flex text-tsuka-200 items-center font-medium py-1">
                <span className="text-tsuka-50 font-semibold text-base">
                  {code1}/
                  <span className="text-tsuka-200 text-sm">
                    {code2}
                  </span>
                </span>
                <span className="ml-4">{network}</span>
              </div>
              <div className="my-auto ml-auto mr-8 min-w-[128px]">
                <StatusSpan status={status} />
              </div>
            </td>
          )
        )}
        <td className="py-2 px-4 text-tsuka-50 text-sm font-normal whitespace-nowrap">
          {new Date(
            Number(createdAt) * 1000
          ).toDateString()}
        </td>
        <td className="py-2 px-4 text-tsuka-50 text-sm font-normal whitespace-nowrap">
          <div>
            <Link href={`/strategies/${id}`}>
              <span
                className={
                  "text-custom-primary hover:text-custom-primary/90 w-full text-center focus:outline-none rounded-md text-sm px-5 py-2 inline-flex justify-center items-center mr-2"
                }
              >
                See details
                <label className="ml-1">
                  <MdArrowForward />
                </label>
              </span>
            </Link>
          </div>
        </td>
      </tr>
    )
}

export default SetupsTableRow