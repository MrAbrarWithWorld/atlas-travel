import { NICHES, NicheView, nicheMetadata } from '../NichePage';

export const metadata = nicheMetadata(NICHES.trades);

export default function Page() {
  return <NicheView data={NICHES.trades} />;
}
