import React, { useState } from 'react';
import type { Incident, User as UserType } from '../types';
import { BdsIcon } from 'blip-ds/dist/blip-ds-react/components';

interface IncidentModalProps {
  incident: Incident;
  currentUser: UserType;
  onClose: () => void;
  onStatusUpdate: (incidentId: string, status: Incident['status']) => void;
  onAddComment: (incidentId: string, content: string, author: UserType) => void;
}

const statusIcons = {
  'Aberto': 'close',
  'Em andamento': 'close',
  'Resolvido': 'close',
  'Cancelado': 'close'
};

const statusColors = {
  'Aberto': 'bg-red-100 text-red-800 border-red-200',
  'Em andamento': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'Resolvido': 'bg-green-100 text-green-800 border-green-200',
  'Cancelado': 'bg-gray-100 text-gray-800 border-gray-200'
};

const priorityColors = {
  'Baixa': 'bg-blue-100 text-blue-800',
  'Média': 'bg-yellow-100 text-yellow-800',
  'Alta': 'bg-orange-100 text-orange-800',
  'Crítica': 'bg-red-100 text-red-800'
};

export const IncidentModal: React.FC<IncidentModalProps> = ({
  incident,
  currentUser,
  onClose,
  onStatusUpdate,
  onAddComment
}) => {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const StatusIcon = statusIcons[incident.status];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleStatusChange = (newStatus: Incident['status']) => {
    onStatusUpdate(incident.id, newStatus);
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    await onAddComment(incident.id, newComment.trim(), currentUser);
    setNewComment('');
    setIsSubmitting(false);
  };

  const canUpdateStatus = currentUser.type === 'atendente';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <BdsIcon name='status' className={`w-6 h-6 ${statusColors[incident.status].includes('text-red') ? 'text-red-600' : statusColors[incident.status].includes('text-yellow') ? 'text-yellow-600' : statusColors[incident.status].includes('text-green') ? 'text-green-600' : 'text-gray-600'}`} />
            <div>
              <h2 className="text-xl font-bold text-gray-900">{incident.title}</h2>
              <p className="text-sm text-gray-600">{incident.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Descrição</h3>
                  <p className="text-gray-700 leading-relaxed">{incident.description}</p>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Comentários ({incident.comments.length})
                  </h3>
                  
                  <div className="space-y-4 mb-6">
                    {incident.comments.map((comment) => (
                      <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-2">
                          {comment.author.avatar && (
                            <img
                              src={comment.author.avatar}
                              alt={comment.author.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          )}
                          <div>
                            <p className="font-medium text-gray-900">{comment.author.name}</p>
                            <p className="text-xs text-gray-500">{formatDate(comment.createdAt)}</p>
                          </div>
                        </div>
                        <p className="text-gray-700">{comment.content}</p>
                      </div>
                    ))}
                    
                    {incident.comments.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <BdsIcon name='close' className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>Nenhum comentário ainda</p>
                      </div>
                    )}
                  </div>

                  <form onSubmit={handleAddComment} className="space-y-4">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Adicione um comentário..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      disabled={isSubmitting}
                    />
                    <button
                      type="submit"
                      disabled={!newComment.trim() || isSubmitting}
                      className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <BdsIcon name='close' className="w-4 h-4" />
                      )}
                      Comentar
                    </button>
                  </form>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-4">Detalhes</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Status</label>
                      {canUpdateStatus ? (
                        <select
                          value={incident.status}
                          onChange={(e) => handleStatusChange(e.target.value as Incident['status'])}
                          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        >
                          <option value="Aberto">Aberto</option>
                          <option value="Em andamento">Em andamento</option>
                          <option value="Resolvido">Resolvido</option>
                          <option value="Cancelado">Cancelado</option>
                        </select>
                      ) : (
                        <div className="mt-1">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusColors[incident.status]}`}>
                            {incident.status}
                          </span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">Prioridade</label>
                      <div className="mt-1">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${priorityColors[incident.priority]}`}>
                          {incident.priority}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">Criado por</label>
                      <div className="mt-1 flex items-center gap-2">
                        {incident.createdBy.avatar && (
                          <img
                            src={incident.createdBy.avatar}
                            alt={incident.createdBy.name}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                        )}
                        <span className="text-sm text-gray-900">{incident.createdBy.name}</span>
                      </div>
                    </div>

                    {incident.assignedTo && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Atribuído a</label>
                        <div className="mt-1 flex items-center gap-2">
                          {incident.assignedTo.avatar && (
                            <img
                              src={incident.assignedTo.avatar}
                              alt={incident.assignedTo.name}
                              className="w-6 h-6 rounded-full object-cover"
                            />
                          )}
                          <span className="text-sm text-gray-900">{incident.assignedTo.name}</span>
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="text-sm font-medium text-gray-700">Criado em</label>
                      <div className="mt-1 flex items-center gap-1 text-sm text-gray-600">
                        <BdsIcon name='close' className="w-4 h-4" />
                        {formatDate(incident.createdAt.toISOString())}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">Atualizado em</label>
                      <div className="mt-1 flex items-center gap-1 text-sm text-gray-600">
                        <BdsIcon name='close' className="w-4 h-4" />
                        {formatDate(incident.updatedAt.toISOString())}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};