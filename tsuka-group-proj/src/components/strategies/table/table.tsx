import { Strategy } from "@/types"
import SetupsTableRow from "./table-row"

interface Props {
    strategies: Array<Strategy>
}

const Table: React.FC<Props> = ({strategies}) => {
    return (
        <table className="overflow-auto w-full">
            <thead className="text-sm text-left font-normal text-tsuka-300 border-b border-tsuka-400">
                <tr>
                <th scope="col" className="px-4 py-2">
                    Setup Title
                </th>
                <th scope="col" className="px-4 py-2 flex w-full">
                    <span>Tokens</span>
                    <span className="ml-auto mr-8 min-w-[128px]">Status</span>
                </th>
                <th scope="col" className="px-4 py-2">
                    Created on
                </th>
                <th className="px-4 py-2" />
                </tr>
            </thead>
            <tbody className="">
                {strategies?.map((item, index) => (
                    <SetupsTableRow
                        key={index}
                        title={item.title}
                        orderTokens={item.orderTokens}
                        createdAt={item.createdAt}
                        id={item.id}
                        status={item.status}
                    />
                ))}
            </tbody>
        </table>
    )
}

export default Table