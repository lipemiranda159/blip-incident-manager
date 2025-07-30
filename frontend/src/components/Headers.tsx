import {BdsButton, BdsIcon} from 'blip-ds/dist/blip-ds-react/components'; 

interface HeaderProps {
  onCreateIncident: () => void;
}

export default function Header({ onCreateIncident }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <BdsIcon size="medium" name="info"/>
            <h1 className="text-xl font-semibold text-gray-900">
              Sistema de Incidentes
            </h1>
          </div>
          
          <BdsButton
            onClick={onCreateIncident}
            iconLeft="plus"
          >
            {/* <Plus className="h-4 w-4 mr-2" /> */}
            {/* <BdsIcon theme="outline" size="small" name="plus"/> */}
            Novo incidente
          </BdsButton>
        </div>
      </div>
    </header>
  );
}