import { db } from "@/lib/db";
import DataTable from "./DataTable";
import { Plus } from "lucide-react";
import { currentUser } from "@clerk/nextjs";
import { columns } from "./Columns";
import SendInvitation from "@/components/forms/SendInvitation";

type Props = {
  params: { agencyId: string };
}

export default async function page({ params }: Props) {
  const authUser = await currentUser()
  const teamMembers = await db.user.findMany({
    where: {
      Agency: {
        id: params.agencyId,
      },
    },
    include: {
      Agency: { include: { SubAccount: true } },
      Permissions: { include: { SubAccount: true } },
    }
  })

  if (!authUser) return

  const agencyDetails = await db.agency.findUnique({
    where: { id: params.agencyId },
    include: { SubAccount: true }
  })

  if (!agencyDetails) return

  return (
    <DataTable
      actionButtonText={
        <>
          <Plus size={15} />
          Add
        </>}
      modalChilren={<SendInvitation agencyId={agencyDetails.id} />}
      filterValue="name"
      columns={columns}
      data={teamMembers}
    />
  )
}

