import { BdsButton, BdsIcon } from 'blip-ds/dist/blip-ds-react/components';
import type { User } from '../types';

interface HeaderProps {
  user: User;
  onCreateIncident: () => void;
  onLogout: () => void;

}

export default function Header({ user, onCreateIncident, onLogout }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <BdsIcon size="medium" name="info" />
            <h1 className="text-xl font-semibold text-gray-900">
              Sistema de Incidentes
            </h1>
            <span className="hidden sm:inline-flex px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
              {user.type === 'solicitante' ? 'Solicitante' : 'Atendente'}
            </span>

          </div>

          <BdsButton
            onClick={onCreateIncident}
            iconLeft="plus"
          >
            Novo incidente
          </BdsButton>
        </div>
      </div>
    </header>
  );
}