export interface DeleteConfirmTokenProp {
  setShowPopupBg: (a: any) => void;
  setShowConfirmDlg: (a: any) => void;
  setShowDeletedAlert: (a: any) => void;
}

export const DeleteConfirmToken: React.FC<DeleteConfirmTokenProp> = ({
  setShowPopupBg,
  setShowConfirmDlg,
  setShowDeletedAlert,
}) => {

  return (
    <div className="absolute z-40 top-full w-[176px] border border-[#343C4F] rounded-2xl p-4 bg-tsuka-500 shadow-[0px_20px_64px_rgba(0,0,0,0.4)]">
      <p className="text-center text-tsuka-50 text-lg font-medium">Are you sure?</p>
      <hr className="my-3 border-tsuka-400" />
      <div
        className="py-[11px] text-primary text-lg text-center bg-tsuka-400 rounded-md cursor-pointer"
        onClick={() => {setShowPopupBg(false); setShowConfirmDlg(false);}}
      >
        No, Cancel
      </div>
      <div
        className="mt-2 py-[11px] text-red text-lg text-center bg-tsuka-400 rounded-md cursor-pointer"
        onClick={() => {setShowPopupBg(false); setShowConfirmDlg(false); setShowDeletedAlert(true)}}
      >
        Yes, Delete
      </div>
    </div>
  );
};
