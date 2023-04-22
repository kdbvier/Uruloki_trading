import {
  IBenifitsItemFields,
  ILandingPage,
  INavbarFields,
} from "@/@types/generated/contentful.types";
import {
  BenifitsSection,
  BenifitsSectionProps,
} from "@/components/landing/benifits.section";
import {
  FooterProps,
  FooterLanding,
} from "@/components/landing/footer.section";
import { HeroLanding, HeroProps } from "@/components/landing/hero.section";
import {
  HowItWorksSection,
  HowItWorksSectionProps,
} from "@/components/landing/howitworks.section";
import {
  KeyFeaturesSection,
  KeyFeaturesSectionProps,
} from "@/components/landing/keyfeatures.section";
import getEntriesLanding from "@/lib/content-graphql";

type SsrProps = {
  responsData: {
    response:{

      landingPage:{
  
        hero: HeroProps;
        howitworks: HowItWorksSectionProps;
        benifits: BenifitsSectionProps;
        keyfeatures: KeyFeaturesSectionProps;
        footer: FooterProps;
      }
    }
  };
};

const Ssr = ({ responsData }: SsrProps) => {
  console.log("in rendering", responsData);
  return (
    <>
      <HeroLanding {...responsData.response.landingPage.hero} />
      <HowItWorksSection {...responsData.response.landingPage.howitworks} />
      <BenifitsSection {...responsData.response.landingPage.benifits} />
      <KeyFeaturesSection {...responsData.response.landingPage.keyfeatures} />
      <FooterLanding {...responsData.response.landingPage.footer} />
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
