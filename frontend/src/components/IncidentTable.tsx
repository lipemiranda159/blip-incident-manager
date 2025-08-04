import { useMemo, useState, useEffect } from 'react';
import {
    BdsTable,
    BdsTableHeader,
    BdsTableBody,
    BdsTableRow,
    BdsTableTh,
    BdsTableCell,
    BdsButton,
    BdsIcon,
    BdsChipTag,
    BdsTypo,
    BdsGrid
} from 'blip-ds/dist/blip-ds-react/components';
import type { Incident } from '../types';

interface IncidentTableProps {
    incidents: Incident[];
    loading: boolean;
    onIncidentClick: (incident: Incident) => void;
}

// Função para truncar texto
const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

// Função para obter cor do status
const getStatusColor = (status: string): "warning" | "info" | "success" | "outline" | "danger" | "default" | "disabled" => {
    switch (status?.toLowerCase()) {
        case 'aberto':
            return 'warning';
        case 'em andamento':
            return 'info';
        case 'resolvido':
            return 'success';
        case 'fechado':
            return 'success';
        case 'cancelado':
            return 'outline';
        case 'pendente':
            return 'outline';
        default:
            return 'outline';
    }
};

// Função para obter cor da prioridade
const getPriorityColor = (priority: string): "warning" | "info" | "success" | "outline" | "danger" | "default" | "disabled" => {
    switch (priority?.toLowerCase()) {
        case 'alta':
            return 'danger';
        case 'média':
            return 'warning';
        case 'baixa':
            return 'success';
        default:
            return 'outline';
    }
};

// Função para formatar data
const formatDate = (date: string | Date): string => {
    try {
        let dateObj: Date;
        
        if (typeof date === 'string') {
            // Garantir que a string termine com 'Z' para UTC
            const utcDate = date.endsWith('Z') ? date : date + 'Z';
            dateObj = new Date(utcDate);
        } else {
            dateObj = date;
        }
        
        // Verificar se a data é válida
        if (isNaN(dateObj.getTime())) {
            return '—';
        }
        
        return dateObj.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'America/Sao_Paulo'
        });
    } catch (error) {
        console.error('Erro ao formatar data:', error);
        return '—';
    }
};

export const IncidentTable = ({
    incidents,
    loading = false,
    onIncidentClick
}: IncidentTableProps) => {
    // Sempre trate incidents como array
    const safeIncidents = Array.isArray(incidents) ? incidents : [];

    // Estabilizar a lista de incidentes com useMemo
    const stableIncidents = useMemo(() => {
        return safeIncidents.filter(
            (incident) =>
                incident &&
                incident.id &&
                incident.title &&
                incident.description &&
                incident.status &&
                incident.priority &&
                incident.createdBy &&
                incident.createdAt
        );
    }, [safeIncidents]);

    // Estado para debounce mais agressivo - estabilizar renderização
    const [debouncedIncidents, setDebouncedIncidents] = useState(stableIncidents);
    const [isStabilizing, setIsStabilizing] = useState(false);
    const [renderKey, setRenderKey] = useState(0);

    useEffect(() => {
        setIsStabilizing(true);
        const timer = setTimeout(() => {
            setDebouncedIncidents(stableIncidents);
            setRenderKey(prev => prev + 1); // Força re-render completo
            setIsStabilizing(false);
        }, 200); // Aumentar delay para 200ms

        return () => clearTimeout(timer);
    }, [stableIncidents]);

    // Renderizar loading durante estabilização
    if (isStabilizing || loading) {
        return (
            <BdsGrid direction="column" gap="3" padding="4">
                <BdsTypo variant="fs-16" color="content-secondary">
                    Carregando...
                </BdsTypo>
            </BdsGrid>
        );
    }

    if ((!safeIncidents || safeIncidents.length === 0) && !loading) {
        return (
            <BdsGrid direction="column" gap="3" padding="4">
                <BdsTypo variant="fs-16" color="content-secondary">
                    Nenhum incidente encontrado
                </BdsTypo>
            </BdsGrid>
        );
    }

    // Criar key única baseada no renderKey para forçar re-mount completo
    const tableKey = `table-${renderKey}-${debouncedIncidents.length}-${debouncedIncidents[0]?.id || 'empty'}`;

    return (
        <BdsGrid direction="column" gap="4">
            <BdsTable key={tableKey}>
                <BdsTableHeader>
                    <BdsTableRow>
                        <BdsTableTh>ID</BdsTableTh>
                        <BdsTableTh>Título</BdsTableTh>
                        <BdsTableTh>Descrição</BdsTableTh>
                        <BdsTableTh>Status</BdsTableTh>
                        <BdsTableTh>Prioridade</BdsTableTh>
                        <BdsTableTh>Criado por</BdsTableTh>
                        <BdsTableTh>Atribuído a</BdsTableTh>
                        <BdsTableTh>Data</BdsTableTh>
                        <BdsTableTh>Ações</BdsTableTh>
                    </BdsTableRow>
                </BdsTableHeader>
                <BdsTableBody>
                    {debouncedIncidents.map((incident) => {
                        try {
                            return (
                                <BdsTableRow key={`incident-${incident.id}`}>
                                    <BdsTableCell>
                                        <BdsTypo variant="fs-12">
                                            INCO-{incident.id?.split?.('-')[0]?.toUpperCase?.() || ''}
                                        </BdsTypo>
                                    </BdsTableCell>
                                    <BdsTableCell>
                                        <BdsTypo variant="fs-14" title={incident.title || ''}>
                                            {truncateText(incident.title || '', 30)}
                                        </BdsTypo>
                                    </BdsTableCell>
                                    <BdsTableCell>
                                        <BdsTypo variant="fs-12" color="content-secondary" title={incident.description || ''}>
                                            {truncateText(incident.description || '', 40)}
                                        </BdsTypo>
                                    </BdsTableCell>
                                    <BdsTableCell>
                                        <BdsChipTag color={getStatusColor(incident.status)}>
                                            {incident.status}
                                        </BdsChipTag>
                                    </BdsTableCell>
                                    <BdsTableCell>
                                        <BdsChipTag color={getPriorityColor(incident.priority)}>
                                            {incident.priority}
                                        </BdsChipTag>
                                    </BdsTableCell>
                                    <BdsTableCell>
                                        <BdsTypo variant="fs-12">
                                            {incident.createdBy?.name || '—'}
                                        </BdsTypo>
                                    </BdsTableCell>
                                    <BdsTableCell>
                                        <BdsTypo variant="fs-12" color={incident.assignedTo ? 'primary' : 'content-tertiary'}>
                                            {incident.assignedTo?.name || 'Não atribuído'}
                                        </BdsTypo>
                                    </BdsTableCell>
                                    <BdsTableCell>
                                        <BdsTypo variant="fs-12">
                                            {incident.createdAt ? formatDate(incident.createdAt) : '—'}
                                        </BdsTypo>
                                    </BdsTableCell>
                                    <BdsTableCell>
                                        <BdsButton
                                            variant="ghost"
                                            size="short"
                                            onClick={() => onIncidentClick(incident)}
                                        >
                                            <BdsIcon name="edit" size="small" />
                                        </BdsButton>
                                    </BdsTableCell>
                                </BdsTableRow>
                            );
                        } catch (err) {
                            console.error('[IncidentTable] Erro ao renderizar incidente:', incident, err);
                            return null;
                        }
                    })}
                </BdsTableBody>
            </BdsTable>
        </BdsGrid>
    );
};
