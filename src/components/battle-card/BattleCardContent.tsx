
interface BattleCardContentProps {
  title: string;
  minRank: string;
  maxRank: string;
}

const BattleCardContent = ({ title, minRank, maxRank }: BattleCardContentProps) => {
  return (
    <>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs text-gray-400">
          {minRank} - {maxRank}
        </span>
      </div>
    </>
  );
};

export default BattleCardContent;
