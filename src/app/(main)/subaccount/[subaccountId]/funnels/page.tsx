import { getFunnels } from '@/lib/queries'
import React from 'react'
import DataTable from './_components/DataTable'
import { Plus } from 'lucide-react'
import { columns } from './_components/Columns'
import FunnelForm from '@/components/forms/FunnelForm'
import BlurPage from '@/components/global/BlurPage'

type Props = {
  params: { subaccountId: string };
}

export default async function FunnelsPage({ params }: Props) {
  const funnels = await getFunnels(params.subaccountId)

  if (!funnels) return null

  return (
    <BlurPage>
      <DataTable
        actionButtonText={
          <>
            <Plus size={15} />
            Create Funnel
          </>
        }
        modalChildren={
          <FunnelForm subAccountId={params.subaccountId}></FunnelForm>
        }
        filterValue="name"
        columns={columns}
        data={funnels}
      />
    </BlurPage>
  )
}
