import { FiEdit2, FiTrash } from "react-icons/fi";
import { useEffect } from "react";

export interface EditOrDeleteTokenProp {
  setShowPopupBg: (a: any) => void;
  setShowConfirmDlg: (a: any) => void;
  setShowEditOrderModal: (a: any) => void;
}

export const EditOrDeleteToken: React.FC<EditOrDeleteTokenProp> = ({
  setShowPopupBg,
  setShowConfirmDlg,
  setShowEditOrderModal,
}) => {
  // useEffect(() => {setShowPopupBg(false)})

  const PopupClickHandler = () => {
    setShowPopupBg(false);
    setShowEditOrderModal(true);
  }

  return (
    <div className="absolute z-40 top-full w-[176px] border border-[#343C4F] rounded-2xl p-4 bg-tsuka-500 shadow-[0px_20px_64px_rgba(0,0,0,0.4)]">
      <div
        className="flex justify-between items-center text-tsuka-50 text-lg cursor-pointer"
        onClick={PopupClickHandler}
      >
        <span>Edit</span>
        <FiEdit2 className="text-tsuka-300" />
      </div>
      <hr className="my-3 border-tsuka-400" />
      <div
        className="flex justify-between items-center text-red text-lg cursor-pointer"
        onClick={() => {setShowConfirmDlg(true);}}
      >
        <span>Delete</span>
        <FiTrash />
      </div>
    </div>
  );
};