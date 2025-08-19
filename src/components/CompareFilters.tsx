
//import Section from "../ui/Section";
import Card from "../ui/Card";
import Chip from "../ui/Chip";
import Button from "../ui/Button";

export function CompareFilters() {
  return (
    <Card>
      <div className="flex flex-wrap items-center gap-8">
        <div className="flex gap-6 items-center">
          <span className="text-[var(--text-dim)] text-sm">Filters:</span>
          <Chip>MGA</Chip>
          <Chip>Fast payout</Chip>
          <Chip>Crypto</Chip>
        </div>
        <div className="ml-auto flex gap-3">
          <Button variant="soft">Reset</Button>
          <Button>Apply</Button>
        </div>
      </div>
    </Card>
  );
}
export default CompareFilters;