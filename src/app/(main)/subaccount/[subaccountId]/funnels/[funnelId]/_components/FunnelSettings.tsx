import { Funnel } from '@prisma/client'
import FunnelForm from '@/components/forms/FunnelForm'
type Props = {
  subaccountId: string
  defaultData: Funnel
}

export default function FunnelSettings({ subaccountId, defaultData }: Props) {

  return (
    <FunnelForm
      subAccountId={subaccountId}
      defaultData={defaultData}
    />
  )
}
