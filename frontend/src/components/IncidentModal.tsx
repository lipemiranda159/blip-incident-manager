import {
  BdsModal,
  BdsButton,
  BdsInput,
  BdsSelect,
  BdsSelectOption,
  BdsIcon,
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
import { useBodyScrollLock } from '../hooks/useBodyScrollLock'
import type { IncidentDto } from '../services'

interface IncidentModalProps {
  incident: IncidentDto
  currentUser: UserType
  onClose: () => void
  onStatusUpdate: (incidentId: string, status: IncidentDto['status']) => void
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

  
  useBodyScrollLock(true)

  const formatDate = (date: string) => {
    // Se a data não termina com 'Z', assumimos que é UTC e adicionamos 'Z'
    const utcDate = date.endsWith('Z') ? date : date + 'Z';
    return new Date(utcDate).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Sao_Paulo'
    });
  }

  const handleStatusChange = (e: CustomEvent) => {
    onStatusUpdate(incident.id, e.detail.value as IncidentDto['status'])
  }

  const handleAddComment = async () => {
    if (!newComment.trim()) return
    setIsSubmitting(true)
    try {
      incident.comments?.push({
        id: Date.now().toString(),
        content: newComment.trim(),
        createdAt: new Date().toISOString(),
        author: {
          name: currentUser.name,
          id: currentUser.id,
          email: currentUser.email,
          type: currentUser.type,
          avatar: ""
        },
        authorId: currentUser.id,
        incidentId: incident.id
      });
      await onAddComment(incident.id, newComment.trim(), currentUser)
      setNewComment('')
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error)
    } finally {
      setIsSubmitting(false)
    }
  }



  const handleBackdropClick = (e: React.MouseEvent) => {
    // Close modal when clicking on backdrop
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      onClick={handleBackdropClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
      }}
    >
      <BdsModal
        open={true}
        outzone-close={false}
        close-button={true}
        size='dynamic'
        style={{ maxHeight: '85vh', overflow: 'hidden' }}>
      <div style={{ maxHeight: '75vh', overflowY: 'auto', padding: '16px' }}>
        {/* Header Section */}
        <BdsGrid direction="column" gap="1">
          <BdsGrid direction="row" justify-content="space-between" align-items="flex-start" flex-wrap="wrap" gap="2">
            <BdsGrid direction="column">
              <BdsTypo variant="fs-20" bold="extra-bold" color="primary">
                {incident.id}
              </BdsTypo>
              <BdsTypo variant="fs-16" bold="semi-bold">
                {incident.title}
              </BdsTypo>
            </BdsGrid>
            <BdsGrid direction="row" gap="1" align-items="center">
              <BdsGrid direction="column" align-items="flex-end">
                <BdsTypo variant="fs-12" color="content-secondary">
                  Prioridade
                </BdsTypo>
                <BdsChipTag color={incident.priority === 'Alta' ? 'danger' : incident.priority === 'Média' ? 'warning' : 'success'}>
                  {incident.priority}
                </BdsChipTag>
              </BdsGrid>
            </BdsGrid>
          </BdsGrid>

          {/* Metadata Section */}
          <BdsGrid direction="row" gap="3" flex-wrap="wrap">
            <BdsGrid direction="row" gap="1" align-items="center">
              <BdsIcon name="calendar" size="small" />
              <BdsGrid direction="column">
                <BdsTypo variant="fs-12" color="content-secondary">Criado em</BdsTypo>
                <BdsTypo variant="fs-14" bold="semi-bold">
                  {formatDate(incident.createdAt)}
                </BdsTypo>
              </BdsGrid>
            </BdsGrid>

            <BdsGrid direction="row" gap="1" align-items="center">
              <BdsIcon name="avatar-user" size="small" />
              <BdsGrid direction="column">
                <BdsTypo variant="fs-12" color="content-secondary">Criado por</BdsTypo>
                <BdsTypo variant="fs-14" bold="semi-bold">
                  {incident.createdBy.name}
                </BdsTypo>
              </BdsGrid>
            </BdsGrid>

            {incident.assignedTo && (
              <BdsGrid direction="row" gap="1" align-items="center">
                <BdsIcon name="person" size="small" />
                <BdsGrid direction="column">
                  <BdsTypo variant="fs-12" color="content-secondary">Atribuído a</BdsTypo>
                  <BdsTypo variant="fs-14" bold="semi-bold">
                    {incident.assignedTo.name}
                  </BdsTypo>
                </BdsGrid>
              </BdsGrid>
            )}
          </BdsGrid>
        </BdsGrid>

        <BdsDivider />

        {/* Main Content Section */}
        <BdsGrid direction="row" gap="1">
          {/* Description Section */}
          <BdsGrid direction="column" gap="2" md="6">
            <BdsTypo variant="fs-16" bold="extra-bold" color="primary">
              Descrição
            </BdsTypo>
            <BdsGrid padding="3">
              <BdsTypo variant="fs-14" line-height="relaxed">
                {incident.description}
              </BdsTypo>
            </BdsGrid>
          </BdsGrid>

          {/* Comments Section */}
          <BdsGrid direction="column" gap="2" md="6">
            <BdsTypo variant="fs-14" bold="extra-bold">
              Comentários
            </BdsTypo>
            <BdsAccordionGroup collapse="multiple">
              {incident.comments?.map((comment) => (
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

        <BdsDivider />

        {/* Status and Actions Section */}
        <BdsGrid direction="column" gap="1">
          <BdsTypo variant="fs-16" bold="extra-bold" color="primary">
            Status e Ações
          </BdsTypo>

          <BdsGrid direction="row" gap="2" flex-wrap="wrap" align-items="flex-start">
            {/* Status Control */}
            <BdsGrid direction="row" gap="2" xxs="12" sm="6">
              <BdsTypo variant="fs-14" bold="semi-bold">
                Status:
              </BdsTypo>
              {(incident.status !== 'Resolvido' && incident.status !== 'Cancelado') ? (
                <BdsSelect value={incident.status} onBdsChange={handleStatusChange}>
                  <BdsSelectOption value="Aberto">Aberto</BdsSelectOption>
                  <BdsSelectOption value="Em andamento">Em andamento</BdsSelectOption>
                  <BdsSelectOption value="Pendente">Pendente</BdsSelectOption>
                  <BdsSelectOption value="Resolvido">Resolvido</BdsSelectOption>
                  <BdsSelectOption value="Cancelado">Cancelado</BdsSelectOption>
                </BdsSelect>
              ) : (
                <BdsGrid direction="row" align-items="center" gap="1">
                  <BdsChipTag color={incident.status === 'Resolvido' ? 'success' : 'danger'}>
                    {incident.status}
                  </BdsChipTag>
                </BdsGrid>
              )}

            </BdsGrid>

            {/* Last Update Info */}
            <BdsGrid direction="column" gap="2" xxs="12" sm="6">
              <BdsTypo variant="fs-14" bold="semi-bold">
                Última Atualização
              </BdsTypo>
              <BdsGrid direction="row" gap="1" align-items="center">
                <BdsIcon name="calendar" size="small" />
                <BdsTypo variant="fs-14">
                  {formatDate(incident.updatedAt)}
                </BdsTypo>
              </BdsGrid>
            </BdsGrid>
          </BdsGrid>
        </BdsGrid>
      </div>
      </BdsModal>
    </div>
  )
}
