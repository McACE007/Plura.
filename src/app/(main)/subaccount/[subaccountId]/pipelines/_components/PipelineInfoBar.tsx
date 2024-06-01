"use client"
import { useModal } from "@/providers/ModalProvider";
import { Pipeline } from "@prisma/client";
import { useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Check, ChevronsUpDown, Plus } from 'lucide-react'
import Link from 'next/link'
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import CustomModal from "@/components/global/CustomModal";
import CreatePipelineForm from "@/components/forms/CreatePipelineForm";

type Props = {
  pipelineId: string;
  subaccountId: string;
  pipelines: Pipeline[];
}

export default function PipelineInfoBar({ pipelineId, subaccountId, pipelines }: Props) {
  const { setOpen: setOpenModal, setClose } = useModal();
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(pipelineId)

  const handleClickCreatePipeline = () => {
    setOpenModal(
      <CustomModal
        title="Create A Pipeline"
        subHeading="Pipelines allows you to group tickets into lanes and track your business processes all in one place."
      >
        <CreatePipelineForm subaccountId={subaccountId} />
      </CustomModal>
    )
  }

  return (
    < div >
      <div className="flex items-end gap-2">
        <Popover
          open={open}
          onOpenChange={setOpen}
        >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[200px] justify-between"
            >
              {value
                ? pipelines.find((pipeline) => pipeline.id === value)?.name
                : 'Select a pipeline...'}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandList>
                <CommandEmpty>No pipelines found.</CommandEmpty>
                <CommandGroup>
                  {pipelines.map((pipeline) => (
                    <Link
                      key={pipeline.id}
                      href={`/subaccount/${subaccountId}/pipelines/${pipeline.id}`}
                    >
                      <CommandItem
                        key={pipeline.id}
                        value={pipeline.id}
                        onSelect={(currentValue) => {
                          setValue(currentValue)
                          setOpen(false)
                        }}
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            value === pipeline.id ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                        {pipeline.name}
                      </CommandItem>
                    </Link>
                  ))}
                  <Button
                    variant="secondary"
                    className="flex gap-2 w-full mt-4"
                    onClick={handleClickCreatePipeline}
                  >
                    <Plus size={15} />
                    Create Pipeline
                  </Button>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div >
  )
}
