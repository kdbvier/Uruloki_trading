import Image from "next/image";
import Link from "next/link";

export interface NavbarProps {
  icon: {
    url: string;
    title: string;
  };
  titlesCollection: {
    items: NavbarTitleProps[];
  };
}

interface NavbarTitleProps {
  label: string;
  linkTo: string;
}

export const Navbar: React.FC<NavbarProps> = ({ icon, titlesCollection }) => {
  const { items } = titlesCollection;
  return (
    <div className="flex inner-container justify-between items-center mb-32 z-50">
      <Image src={icon.url} alt="logo__image" width={160} height={23} style={{position: 'relative'}} />
      
      <div className="flex gap-8">
        {items.map((item) => (
          <Link
            key={item.label}
            href={item.linkTo}
            className="text-white font-Inter-400 font-normal text-base"
            scroll={false}
          >
            {item.label}
          </Link>
        ))}
      </div>
      <div className="inline-block bg-gradient-to-r from-[#003525] to-[#31C699] rounded-full p-[1px] justify-center items-center">
        <button className="h-full text-white bg-black text-base font-Inter-400 font-normal text-center rounded-full pl-[38px] py-[16px] pr-[38px] flex justify-center items-center gap-3">
          {"Trade now"}
        </button>
      </div>
    </div>
  );
};
