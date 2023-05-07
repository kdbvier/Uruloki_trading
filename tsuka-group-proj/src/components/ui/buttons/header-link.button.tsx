export interface HeaderLinkButtonProps {
  path: string;
  title: string;
  active: boolean;
  callback?: () => void;
}

export const HeaderLinkButton: React.FC<HeaderLinkButtonProps> = ({
  path,
  title,
  active,
  callback,
}) => {
  return (
    <a
      onClick={callback}
      href={path}
      className={`${
        active ? "text-white font-medium" : "text-tsuka-100 font-normal"
      } whitespace-nowrap block rounded-md px-3 py-2.5 text-lg md:text-base`}
    >
      {title}
    </a>
  );
};
