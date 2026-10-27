import { NICHES, NicheView, nicheMetadata } from '../NichePage';

export const metadata = nicheMetadata(NICHES.restaurants);

export default function Page() {
  return <NicheView data={NICHES.restaurants} />;
}
