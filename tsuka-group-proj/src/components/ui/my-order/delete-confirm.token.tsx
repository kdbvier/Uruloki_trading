import {useState, useRef, useEffect} from 'react';

export interface DeleteConfirmTokenProp {
  setShowConfirmDlg: (a: any) => void;
  setShowDeletedAlert: (a: any) => void;
}

export const DeleteConfirmToken: React.FC<DeleteConfirmTokenProp> = ({
  setShowConfirmDlg,
  setShowDeletedAlert,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [clickedInside, setClickedInside] = useState(false);
  const onOutsideClick = () => {
    setShowConfirmDlg(false)
  };
  useEffect(() => {
    const handleClick = (event:any) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setClickedInside(false);
        onOutsideClick();
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [onOutsideClick]);

  const handleClickInside = (event:any) => {
    setClickedInside(true);
  };

  return (
    <div ref={ref}  className="absolute z-40 right-0 top-full w-[176px] border border-[#343C4F] rounded-2xl p-4 bg-tsuka-500 shadow-[0px_20px_64px_rgba(0,0,0,0.4)]" onClick={handleClickInside}>
      <p className="text-center text-tsuka-50 text-lg font-medium">
        Are you sure?
      </p>
      <hr className="my-3 border-tsuka-400" />
      <div
        className="py-[11px] text-custom-primary text-lg text-center bg-tsuka-400 rounded-md cursor-pointer"
        onClick={() => {
          setShowConfirmDlg(false);
        }}
      >
        No, Cancel
      </div>
      <div
        className="mt-2 py-[11px] text-custom-red text-lg text-center bg-tsuka-400 rounded-md cursor-pointer"
        onClick={() => {
          setShowConfirmDlg(false);
          setShowDeletedAlert(true);
        }}
      >
        Yes, Delete
      </div>
    </div>
  );
};
