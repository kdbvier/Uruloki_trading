import { formItensData } from "@/@fake-data/form.fake-data";
import { tokensData } from "@/@fake-data/token.fake-data";

export default function Home() {
  const titles = formItensData;
  const data = tokensData;
  const [inputToken, outputToken] = data.map((token) => {
    return { id: token.id, token: token.chain.code, icon: token.chain.icon };
  });

  const networks = ["ETH", "BSC", "POLYGON"];

  return (
    <div className="flex flex-col">
      <div className="flex items-center">
        <p className="hidden md:block mx-4 text-3xl font-medium text-tsuka-50 ">
          Homepage
        </p>
      </div>
    </div>
  );
}
