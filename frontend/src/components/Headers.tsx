import {
  BdsButton,
  BdsIcon,
  BdsTypo,
  BdsGrid,
  BdsChipTag
} from 'blip-ds/dist/blip-ds-react/components';
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
        <BdsGrid
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          className="h-16"
        >
          <BdsGrid direction="row" alignItems="center" gap="2">
            <BdsIcon size="medium" name="info" />
            <BdsTypo bold="semi-bold" variant="fs-20">
              Sistema de Incidentes
            </BdsTypo>

            <BdsChipTag
              color={user.type === 'solicitante' ? 'info' : 'success'}
              className="hidden sm:inline-flex"
            >
              {user.type === 'solicitante' ? 'Solicitante' : 'Atendente'}
            </BdsChipTag>
          </BdsGrid>

          <BdsButton
            iconLeft="plus"
            onClick={onCreateIncident}
          >
            Novo incidente
          </BdsButton>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-3">
              {user.avatar && (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>

            <div className="sm:hidden">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <BdsIcon name="user-avatar" className="w-4 h-4 text-gray-600" />
                </div>
              )}
            </div>

            <button
              onClick={onLogout}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Sair"
            >
              <BdsIcon name="logout" size="small" />
            </button>
          </div>
        </BdsGrid>
      </div>
    </header>
  );
}
