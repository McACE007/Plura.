import { currentUser } from "@clerk/nextjs";

type Props = {
  params: { subaccountId: string };
}

export default async function page({ params }: Props) {
  const authUser = await currentUser();
  return (
    <div>{params.subaccountId}</div>
  )
}
