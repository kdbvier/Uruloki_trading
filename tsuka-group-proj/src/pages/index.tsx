import { formItensData } from "@/@fake-data/form.fake-data";
import { tokensData } from "@/@fake-data/token.fake-data";
import { ILandingPage } from "@/@types/generated/contentful.types";
import getLandingPage from "@/lib/content-graphql";
import ContentService from "@/lib/content-service";

type newProps = {
  landingPage: ILandingPage;
};
export default function Home({ landingPage }: newProps) {
  const titles = formItensData;
  const data = tokensData;
  const [inputToken, outputToken] = data.map((token) => {
    return { id: token.id, token: token.chain.code, icon: "" };
  });

  console.log(landingPage);
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

export const getServerSideProps = async () => {
  const landingPageContents = (
    await ContentService.instance.getEntriesByType<ILandingPage>("landingPage")
  )[0];
  const landingPage = landingPageContents.fields;

  getLandingPage().then((response) =>
    console.log("response GraphQL:: ", response)
  );
  console.log("Inside ServerSideProps", landingPage);
  return { props: { landingPage } };
};
