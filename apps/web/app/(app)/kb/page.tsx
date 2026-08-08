import { requireBusiness } from "../../../lib/db";
import { EMPTY_KB, type BusinessKB } from "../../../lib/kb";
import { KBEditor } from "./KBEditor";

export const dynamic = "force-dynamic";

export default async function KBPage() {
  const business = await requireBusiness();
  const kb: BusinessKB = business.kbJson ? { ...EMPTY_KB, ...JSON.parse(business.kbJson) } : EMPTY_KB;

  return (
    <>
      <div className="page-head rise">
        <div>
          <h1 className="display">Knowledge Base</h1>
          <p>Everything Ripple knows about your business. Fix anything that looks off — every campaign is written from this.</p>
        </div>
      </div>
      <KBEditor initial={kb} />
    </>
  );
}
