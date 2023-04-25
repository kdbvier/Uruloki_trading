import { IconType } from "react-icons";

export interface DefaultButtonProps {
  label: string;
  callback: () => void;
  filled?: boolean;
  Icon?: IconType;
}

export const DefaultButton: React.FC<DefaultButtonProps> = ({
  label,
  callback,
  filled,
  Icon,
}) => {
  return (
    <button
      type="button"
      onClick={callback}
      className={`${
        filled
          ? "text-white bg-primary hover:bg-primary/90"
          : "text-primary hover:text-primary/90"
      } w-full text-center focus:outline-none rounded-md text-sm px-5 py-2 inline-flex justify-center items-center mr-2`}
    >
      {Icon && (
        <label className="mr-1">
          <Icon />
        </label>
      )}
      {label}
    </button>
  );
};
