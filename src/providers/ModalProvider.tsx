"use client"

import { TicketDetails } from "@/lib/types";
import { Agency, Contact, User } from "@prisma/client";
import { ReactNode, createContext, useContext, useEffect, useState } from "react"

type ModalProviderProps = {
  children: ReactNode;
}

export type ModalData = {
  user?: User;
  agency?: Agency;
  ticket?: TicketDetails[0];
  contact?: Contact;
}

type ModelContextType = {
  data: ModalData;
  isOpen: boolean;
  setOpen: (model: ReactNode, fetchData?: () => Promise<any>) => void;
  setClose: () => void;
}

export const ModelContext = createContext<ModelContextType>({
  data: {},
  isOpen: false,
  setOpen: (model: ReactNode, fetchData?: () => Promise<any>) => { },
  setClose: () => { },
})

export default function ModalProvider({ children }: ModalProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<ModalData>({});
  const [showingModal, setShowingModal] = useState<ReactNode>(null);
  const [isMount, setIsMount] = useState(false);

  useEffect(() => {
    setIsMount(true)
  }, [])

  const setOpen = async (modal: ReactNode, fetchData?: () => Promise<any>) => {
    if (modal) {
      if (fetchData) {
        setData({ ...data, ...(await fetchData()) } || {})
      }
      setShowingModal(modal)
      setIsOpen(true)
    }
  }

  const setClose = () => {
    setIsOpen(false)
    setData({})
  }

  if (!isMount) return null;

  return (
    <ModelContext.Provider value={{ data, setClose, setOpen, isOpen }}>
      {children}
      {showingModal}
    </ModelContext.Provider>
  )
}

export const useModal = () => {
  const context = useContext(ModelContext)
  if (!context) {
    throw new Error("useModal must be used within the modal provider")
  }
  return context;
}

