import {
  IBenifitsItemFields,
  ILandingPage,
  INavbarFields,
} from "@/@types/generated/contentful.types";
import {
  BenifitsSection,
  BenifitsSectionProps,
} from "@/components/landing/benifits.section";
import { CoinTypeLanding } from "@/components/landing/cointype.landing";
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
        howItWorks: HowItWorksSectionProps;
        benifits: BenifitsSectionProps;
        keyFeatures: KeyFeaturesSectionProps;
        footer: FooterProps;
      }
    }
  };
};

const Ssr = ({ responsData }: SsrProps) => {
  console.log("in rendering", responsData);
  const coins =[
    {
      url: '/tokens/ethereum.png',
      name:'Ethereum',
      abbr: 'ETH',
      rate: 5.53,
      price: 12574.24
    },
    {
      url: '/tokens/bitcoin.png',
      name:'Bitcoin',
      abbr: 'BTC',
      rate: 6.95,
      price: 12503.63
    },
    {
      url: '/tokens/anchor.png',
      name:'Anchor',
      abbr: 'ANC',
      rate: 3.21,
      price: 15590.74
    },
    {
      url: '/tokens/polkadot.png',
      name:'Polkadot',
      abbr: 'PKD',
      rate: 5.53,
      price: 12574.24
    },
  ];
  return (
    <div className="w-full flex flex-col items-center bg-black">
      <HeroLanding {...responsData.response.landingPage.hero} />
      <CoinTypeLanding coins={coins}/>
      <KeyFeaturesSection {...responsData.response.landingPage.keyFeatures} />
      <HowItWorksSection {...responsData.response.landingPage.howItWorks} />
      <BenifitsSection {...responsData.response.landingPage.benifits} />
      <FooterLanding {...responsData.response.landingPage.footer} />
    </div>
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
