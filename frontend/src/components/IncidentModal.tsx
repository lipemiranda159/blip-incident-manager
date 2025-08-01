import {
  BdsModal,
  BdsButton,
  BdsInput,
  BdsSelect,
  BdsSelectOption,
  BdsIcon,
  BdsPaper,
  BdsTypo,
  BdsGrid,
  BdsDivider,
  BdsChipTag,
  BdsAccordion,
  BdsAccordionHeader,
  BdsAccordionBody,
  BdsAccordionGroup,
} from 'blip-ds/dist/blip-ds-react/components'
import { useState } from 'react'
import type { Incident, User as UserType } from '../types'

interface IncidentModalProps {
  incident: Incident
  currentUser: UserType
  onClose: () => void
  onStatusUpdate: (incidentId: string, status: Incident['status']) => void
  onAddComment: (incidentId: string, content: string, author: UserType) => void
}

export const IncidentModal = ({
  incident,
  currentUser,
  onClose,
  onStatusUpdate,
  onAddComment
}: IncidentModalProps) => {
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [modalOpen, setModalOpen] = useState(true);

  const formatDate = (date: string) =>
    new Date(date).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })

  const handleStatusChange = (e: CustomEvent) => {
    onStatusUpdate(incident.id, e.detail.value as Incident['status'])
  }

  const handleAddComment = async () => {
    if (!newComment.trim()) return
    setIsSubmitting(true)
    await onAddComment(incident.id, newComment.trim(), currentUser)
    setNewComment('')
    setIsSubmitting(false)
  }

  return (
    <BdsModal
      open={modalOpen}
      outzone-close={true}
      close-button={true}
      size='dynamic'>
      <BdsGrid padding='1' direction='column' gap='2'>
        <BdsGrid direction="column" gap="1">
          <BdsGrid direction='row'>
            <BdsGrid direction="column" md='8'>
              <BdsTypo variant="fs-14" bold="extra-bold">
                {incident.id} - {incident.title}
              </BdsTypo>
            </BdsGrid>
            <BdsTypo>
              Prioridade:
            </BdsTypo>
            <BdsChipTag color="default" icon="">
              {incident.priority}
            </BdsChipTag>
          </BdsGrid>

          <BdsGrid direction="row" gap="1">
            <BdsGrid direction="row" gap="1" align-items="center">
              <BdsTypo variant="fs-16" bold="regular">
                <BdsIcon name="calendar" size="x-small" class="mr-1" />
                {formatDate(incident.createdAt.toDateString())}
              </BdsTypo>
            </BdsGrid>

            <BdsGrid direction="row" gap="1" align-items="center">
              <BdsTypo variant="fs-16" bold="regular">
                <BdsIcon name="avatar-user" size="x-small" class="mr-1" />
                {incident.createdBy.name}
              </BdsTypo>
            </BdsGrid>
          </BdsGrid>
        </BdsGrid>

        <BdsDivider />

        <BdsGrid direction='row'>
          <BdsGrid direction="column" gap="1" md='8'>
            <BdsTypo variant="fs-14" bold="extra-bold">
              Descrição
            </BdsTypo>
            <BdsTypo variant="fs-14" bold="regular">
              {incident.description}
            </BdsTypo>
          </BdsGrid>

          <BdsGrid gap='1' direction='column' md='4'>
            <BdsTypo variant="fs-14" bold="extra-bold">
              Comentários
            </BdsTypo>
            <BdsAccordionGroup collapse="multiple">
              {incident.comments.map((comment) => (
                <BdsAccordion key={comment.id}>
                  <BdsAccordionHeader icon='avatar-user' accordion-title={comment.author.name}>

                    <BdsGrid direction='row' gap='1' align-items='center'>
                      <BdsIcon name='calendar' size='x-small' />
                      <BdsTypo variant="fs-12" bold="regular">{formatDate(comment.createdAt)}</BdsTypo>
                    </BdsGrid>
                  </BdsAccordionHeader>
                  <BdsAccordionBody>
                    <BdsTypo variant="fs-16">{comment.content}</BdsTypo>
                  </BdsAccordionBody>
                </BdsAccordion>
              ))}
            </BdsAccordionGroup>
            <BdsInput
              placeholder="Adicione um comentário..."
              value={newComment}
              disabled={isSubmitting}
              onBdsChange={(e: CustomEvent) =>
                setNewComment(e.detail.value || '')
              }
              isTextarea
            ></BdsInput>
            <BdsButton
              variant="primary"
              disabled={!newComment.trim() || isSubmitting}
              onBdsClick={handleAddComment}
              icon='send'
            >
              Comentar
            </BdsButton>
          </BdsGrid>

        </BdsGrid>

        <BdsGrid gap='1' direction='column'>
          <BdsTypo variant="fs-14" bold="extra-bold">
            Detalhes
          </BdsTypo>

          {(incident.status != 'Resolvido' && incident.status != 'Cancelado') ? (
            <BdsSelect value={incident.status} onBdsChange={handleStatusChange}>
              <BdsSelectOption value={1}>Aberto</BdsSelectOption>
              <BdsSelectOption value={2}>Em andamento</BdsSelectOption>
              <BdsSelectOption value={3}>Resolvido</BdsSelectOption>
              <BdsSelectOption value={4}>Cancelado</BdsSelectOption>
            </BdsSelect>
          ) : (
            <BdsTypo>Status: {incident.status}</BdsTypo>
          )}

          <BdsTypo variant="fs-14" bold="regular">
            Criado por: {incident.createdBy.name}
          </BdsTypo>

          {incident.assignedTo && (
            <BdsTypo variant="fs-14" bold="regular">
              Atribuído a: {incident.assignedTo.name}
            </BdsTypo>
          )}

          <BdsTypo variant="fs-14" bold="regular">
            Atualizado em: {formatDate(incident.updatedAt.toString())}
          </BdsTypo>

        </BdsGrid>
      </BdsGrid>
    </BdsModal >
  )
}
