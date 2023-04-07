export interface LiveGraphTokenProps {
  token: {
    id: string;
    token: string;
    icon: string;
  };
}

export const LiveGraphToken: React.FC<LiveGraphTokenProps> = ({ token }) => {
  return (
    <div>
      <div className="bg-tsuka-500 h-20 rounded-xl text-tsuka-100 mb-4 md:mb-0">
        {token.token}
      </div>
    </div>
  );
};
