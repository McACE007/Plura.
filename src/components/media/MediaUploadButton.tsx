"use client"

import { useModal } from "@/providers/ModalProvider"
import { Button } from "../ui/button"
import CustomModal from "../global/CustomModal"
import UploadMediaForm from "../forms/UploadMediaForm"

type Props = {
  subaccountId: string
}

export default function MediaUploadButton({ subaccountId }: Props) {
  const { isOpen, setOpen, setClose } = useModal()


  return (
    <Button onClick={() => (setOpen(<CustomModal title="Upload Media" subHeading="Upload a file to your media bucket">
      <UploadMediaForm subaccountId={subaccountId} />
    </CustomModal>))}>
      Upload
    </Button>
  )
}
