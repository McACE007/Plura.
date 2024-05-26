export default function page({ params }: { params: { agencyId: string } }) {
  return (
    <div>{params.agencyId}</div>
  )
}

