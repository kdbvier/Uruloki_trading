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
        active ? "font-medium text-tsuka-50" : "text-tsuka-100"
      } block rounded-md px-3 py-2 text-base`}
    >
      {title}
    </a>
  );
};
