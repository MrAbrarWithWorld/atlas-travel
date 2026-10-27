import { AreaView, areaMetadata } from '../AreaPage';

export const metadata = areaMetadata('mississauga');

export default function Page() {
  return <AreaView slug="mississauga" />;
}
