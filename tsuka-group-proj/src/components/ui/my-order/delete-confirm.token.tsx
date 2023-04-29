import { deleteOrder } from "@/store/apps/user-order";
import { useAppDispatch } from "@/store/hooks";

export interface DeleteConfirmTokenProp {
  setShowPopupBg: (a: any) => void;
  setShowConfirmDlg: (a: any) => void;
  setShowDeletedAlert: (a: any) => void;
  deleteID: number;
}

export const DeleteConfirmToken: React.FC<DeleteConfirmTokenProp> = ({
  setShowPopupBg,
  setShowConfirmDlg,
  setShowDeletedAlert,
  deleteID
}) => {
  const dispatch = useAppDispatch();

  return (
    <div className="absolute z-40 top-0 right-0 w-[176px] border border-[#343C4F] rounded-2xl p-2 px-3 bg-tsuka-500 shadow-[0px_20px_64px_rgba(0,0,0,0.4)]">
      <p className="text-center text-tsuka-50 text-lg font-medium">
        Are you sure?
      </p>
      <hr className="my-3 border-tsuka-400" />
      <div
        className="py-[8px] text-custom-primary text-sm text-center bg-tsuka-400 rounded-md cursor-pointer"
        onClick={() => {
          setShowPopupBg(false);
          setShowConfirmDlg(false);
        }}
      >
        No, Cancel
      </div>
      <div
        className="mt-2 py-[8px] text-custom-red text-sm text-center bg-tsuka-400 rounded-md cursor-pointer"
        onClick={() => {
          setShowPopupBg(false);
          setShowConfirmDlg(false);
          dispatch(deleteOrder(deleteID))
          setShowDeletedAlert(true);
        }}
      >
        Yes, Delete
      </div>
    </div>
  );
};
