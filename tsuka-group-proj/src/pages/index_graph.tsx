import {
  IBenifitsItemFields,
  ILandingPage,
  INavbarFields,
} from "@/@types/generated/contentful.types";
import getEntriesLanding from "@/lib/content-graphql";

type SsrProps = {
  responsData: ILandingPage[];
};

const Ssr = ({ responsData }: SsrProps) => {
  // console.log("in rendering", responsData);
  return (
    <>
      
    </>
  );
};

export async function getServerSideProps() {
  const responsData = await getEntriesLanding();

  // console.log(
  //   "responsData::::In getServerSideProps",
  //   JSON.stringify(responsData)
  // );

  return { props: { responsData } };
}

export default Ssr;
