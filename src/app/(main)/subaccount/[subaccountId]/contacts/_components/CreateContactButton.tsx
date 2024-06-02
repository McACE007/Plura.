'use client'
import ContactUserForm from '@/components/forms/ContactUserForm'
import CustomModal from '@/components/global/CustomModal'
import { Button } from '@/components/ui/button'
import { useModal } from '@/providers/ModalProvider'

type Props = {
  subaccountId: string;
}

export default function CreateContactButton({ subaccountId }: Props) {
  const { setOpen } = useModal()

  const handleCreateContact = async () => {
    setOpen(
      <CustomModal
        title="Create Or Update Contact information"
        subHeading="Contacts are like customers."
      >
        <ContactUserForm subaccountId={subaccountId} />
      </CustomModal>
    )
  }

  return <Button onClick={handleCreateContact}>Create Contact</Button>
}
