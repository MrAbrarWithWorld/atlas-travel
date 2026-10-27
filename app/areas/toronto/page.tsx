import { AreaView, areaMetadata } from '../AreaPage';

export const metadata = areaMetadata('toronto');

export default function Page() {
  return <AreaView slug="toronto" />;
}
