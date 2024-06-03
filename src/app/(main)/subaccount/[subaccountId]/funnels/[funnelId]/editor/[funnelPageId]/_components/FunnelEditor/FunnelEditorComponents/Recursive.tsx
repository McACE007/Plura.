import { EditorElement } from '@/providers/editor/EditorProvider'
import React from 'react'
import TextComponent from './TextComponent'
import Container from './Container'
import VideoComponent from './VideoComponent'
import LinkComponent from './LinkComponent'
import ContactFormComponent from './ContactFormComponent'
import Checkout from './Checkout'

type Props = {
  element: EditorElement
}

const Recursive = ({ element }: Props) => {
  switch (element.type) {
    case 'text':
      return <TextComponent element={element} />
    case 'container':
      return <Container element={element} />
    case 'video':
      return <VideoComponent element={element} />
    case 'contactForm':
      return <ContactFormComponent element={element} />
    case 'paymentForm':
      return <Checkout element={element} />
    case '2Col':
      return <Container element={element} />
    case '__body':
      return <Container element={element} />

    case 'link':
      return <LinkComponent element={element} />
    default:
      return null
  }
}

export default Recursive
