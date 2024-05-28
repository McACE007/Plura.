import BlurPage from "@/components/global/BlurPage";
import InfoBar from "@/components/global/InfoBar";
import Sidebar from "@/components/sidebar";
import Unauthorized from "@/components/unauthorized";
import { getNotificationAndUser, verifyAndAcceptInvitation } from "@/lib/queries";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { ReactNode } from "react"

type Props = {
  children: ReactNode;
  params: { agencyId: string };
}

export default async function layout({ children, params }: Props) {
  const agencyId = await verifyAndAcceptInvitation()
  const user = await currentUser()

  if (!user) return redirect('/')

  if (!agencyId) return redirect('/agency')

  if (user.privateMetadata.role !== "AGENCY_OWNER" && user.privateMetadata.role !== "AGENCY_ADMIN") return <Unauthorized />

  let allNoti: any = []
  const notifications = await getNotificationAndUser(agencyId)

  if (notifications) allNoti = notifications

  return (
    <div className="h-screen">
      <Sidebar
        id={params.agencyId}
        type="agency"
      />
      <div className="md:pl-[300px]">
        <InfoBar notifications={allNoti} subAccountId={user.id} />
        <div className="relative">
          <BlurPage>{children}</BlurPage>
        </div>
      </div>
    </div>
  )
}
