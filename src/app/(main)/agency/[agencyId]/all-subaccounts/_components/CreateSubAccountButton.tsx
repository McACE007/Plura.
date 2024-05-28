'use client'
import SubAccountDetails from '@/components/forms/SubAccountDetails'
import CustomModal from '@/components/global/CustomModal'
import { Button } from '@/components/ui/button'
import { useModal } from '@/providers/ModalProvider'
import { Agency, AgencySidebarOption, SubAccount, User } from '@prisma/client'
import { PlusCircleIcon } from 'lucide-react'
import React from 'react'
import { twMerge } from 'tailwind-merge'

type Props = {
  user: User & {
    Agency:
    | (
      | Agency
      | (null & {
        SubAccount: SubAccount[]
        SideBarOption: AgencySidebarOption[]
      })
    )
    | null
  }
  id: string
  className: string
}

const CreateSubAccountButton = ({ className, id, user }: Props) => {
  const { setOpen } = useModal()
  const agencyDetails = user.Agency

  if (!agencyDetails) return

  return (
    <Button
      className={twMerge('w-full flex gap-4', className)}
      onClick={() => {
        setOpen(
          <CustomModal
            title="Create a Subaccount"
            subHeading="You can switch bettween"
          >
            <SubAccountDetails
              agencyDetails={agencyDetails}
              userId={user.id}
              userName={user.name}
            />
          </CustomModal>
        )
      }}
    >
      <PlusCircleIcon size={15} />
      Create Sub Account
    </Button>
  )
}

export default CreateSubAccountButton
