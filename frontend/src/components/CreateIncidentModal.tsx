import { useState } from 'react';
import {
  BdsModal,
  BdsGrid,
  BdsTypo,
  BdsInput,
  BdsSelect,
  BdsSelectOption,
  BdsButton,
  BdsAlert,
  BdsAlertHeader,
  BdsAlertBody
} from 'blip-ds/dist/blip-ds-react/components';
import type { Incident, User } from '../types';

interface CreateIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Incident, 'id' | 'createdAt' | 'updatedAt' | 'comments'>) => Promise<{ success: boolean; error?: string }>;
  currentUser: User;
}

export const CreateIncidentModal = ({
  isOpen,
  onClose,
  onSubmit,
  currentUser
}: CreateIncidentModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Aberto' as Incident['status'],
    priority: 'Média' as Incident['priority'],
    category: 'Tecnologia',
    tags: [] as string[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const result = await onSubmit({
      ...formData,
      createdBy: currentUser,
      assignedTo: undefined
    });

    if (result.success) {
      // Reset form and close modal
      setFormData({
        title: '',
        description: '',
        status: 'Aberto',
        priority: 'Média',
        category: 'Tecnologia',
        tags: []
      });
      onClose();
    } else {
      setError(result.error || 'Erro ao criar incidente');
    }

    setIsSubmitting(false);
  };

  if (!isOpen) return null;

  return (
    <BdsModal
      open={isOpen}
      outzone-close={true}
      close-button={true}
      size="dynamic"
    >
      <BdsGrid direction="column" gap="4" padding="4">
        <BdsTypo variant="fs-20" bold="bold">
          Criar Novo Incidente
        </BdsTypo>

        <form onSubmit={handleSubmit}>
          <BdsGrid direction="column" gap="3">
            <BdsGrid direction="column" gap="1">
              <BdsTypo variant="fs-14" bold="semi-bold">
                Título
              </BdsTypo>
              <BdsInput
                value={formData.title}
                onBdsChange={(e) => setFormData(prev => ({ ...prev, title: e.detail }))}
                placeholder="Digite o título do incidente"
                required
              />
            </BdsGrid>

            <BdsGrid direction="column" gap="1">
              <BdsTypo variant="fs-14" bold="semi-bold">
                Descrição
              </BdsTypo>
              <BdsInput
                value={formData.description}
                onBdsChange={(e) => setFormData(prev => ({ ...prev, description: e.detail }))}
                placeholder="Descreva o incidente em detalhes"
                isTextarea
                required
              />
            </BdsGrid>

            <BdsGrid direction="row" gap="3" xxs="12" sm="6">
              <BdsGrid direction="column" gap="1">
                <BdsTypo variant="fs-14" bold="semi-bold">
                  Prioridade
                </BdsTypo>
                <BdsSelect
                  value={formData.priority}
                  onBdsChange={(e) => setFormData(prev => ({ ...prev, priority: e.detail as unknown as Incident['priority'] }))}
                >
                  <BdsSelectOption value="Baixa">Baixa</BdsSelectOption>
                  <BdsSelectOption value="Média">Média</BdsSelectOption>
                  <BdsSelectOption value="Alta">Alta</BdsSelectOption>
                  <BdsSelectOption value="Crítica">Crítica</BdsSelectOption>
                </BdsSelect>
              </BdsGrid>

              <BdsGrid direction="column" gap="1">
                <BdsTypo variant="fs-14" bold="semi-bold">
                  Categoria
                </BdsTypo>
                <BdsInput
                  value={formData.category}
                  onBdsChange={(e) => setFormData(prev => ({ ...prev, category: e.detail }))}
                  placeholder="Categoria do incidente"
                />
              </BdsGrid>
            </BdsGrid>

            {error && (

              <BdsAlert open={true} id="alert">
                <BdsAlertHeader variant="error" icon="info">
                  Atenção!
                </BdsAlertHeader>
                <BdsAlertBody>
                  {error}
                </BdsAlertBody>
              </BdsAlert>

            )}

            <BdsGrid direction="row" justify-content="flex-end" gap="2" padding-top="3">
              <BdsButton
                variant="ghost"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancelar
              </BdsButton>
              <BdsButton
                type="submit"
                variant="primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Criando...' : 'Criar Incidente'}
              </BdsButton>
            </BdsGrid>
          </BdsGrid>
        </form>
      </BdsGrid>
    </BdsModal>
  );
};
