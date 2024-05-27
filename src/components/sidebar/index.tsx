import { getAuthUserDetails } from "@/lib/queries";
import MenuOptions from "./MenuOptions";

type Props = {
  id: string;
  type: 'agency' | 'subaccount';
}

export default async function Sidebar({ id, type }: Props) {
  const user = await getAuthUserDetails()
  if (!user) return null;

  if (!user.Agency) return

  const details = type === "agency"
    ? user.Agency
    : user.Agency.SubAccount.find(subaccount => subaccount.id === id)
  const isWhiteLabledAgency = user.Agency.whiteLabel

  if (!details) return;

  let sideBarLogo = user.Agency.agencyLogo || '/assets/plura-logo.svg'

  if (!isWhiteLabledAgency) {
    if (type === "subaccount") {
      sideBarLogo = user.Agency.SubAccount.find(subaccount => subaccount.id === id)?.subAccountLogo || user.Agency.agencyLogo
    }
  }

  const sidebarOpt = type === "agency"
    ? user.Agency.SidebarOption || []
    : user.Agency.SubAccount.find(subaccount => subaccount.id === id)?.SidebarOption || []

  const subaccounts = user.Agency.SubAccount.filter(subaccount => user.Permissions.find(permission => permission.subAccountId === subaccount.id && permission.access))

  return (
    <>
      <MenuOptions defaultOpen={true} details={details} id={id} sidebarLogo={sideBarLogo} sidebarOpt={sidebarOpt} subAccounts={subaccounts} user={user} />
      <MenuOptions details={details} id={id} sidebarLogo={sideBarLogo} sidebarOpt={sidebarOpt} subAccounts={subaccounts} user={user} />
    </>
  )
}
