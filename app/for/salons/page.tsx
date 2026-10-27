import { NICHES, NicheView, nicheMetadata } from '../NichePage';

export const metadata = nicheMetadata(NICHES.salons);

export default function Page() {
  return <NicheView data={NICHES.salons} />;
}
