import {
  BdsIcon,
  BdsGrid,
  BdsTypo,
  BdsInput,
  BdsButton,
  BdsAlert
} from 'blip-ds/dist/blip-ds-react/components';
import React, { useState } from 'react';

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<boolean>;
  loading?: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin, loading = false }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const success = await onLogin(email, password);
    if (!success) {
      setError('Email ou senha inválidos');
    }
  };

  return (
    <BdsGrid 
      direction="column" 
      justify-content="center" 
      align-items="center" 
      padding="4"
      style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%)' }}
    >
      <BdsGrid 
        direction="column" 
        gap="4" 
        padding="6"
        style={{ 
          maxWidth: '400px', 
          width: '100%', 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)' 
        }}
      >
        {/* Header Section */}
        <BdsGrid direction="column" align-items="center" gap="2">
          <div style={{
            width: '64px',
            height: '64px',
            backgroundColor: '#2563eb',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <BdsIcon name='info' size="large" style={{ color: 'white' }} />
          </div>
          <BdsTypo variant="fs-24" bold="extra-bold" color="primary">
            Sistema de Incidentes
          </BdsTypo>
          <BdsTypo variant="fs-14" color="content-secondary">
            Entre com suas credenciais
          </BdsTypo>
        </BdsGrid>

        {/* Form Section */}
        <BdsGrid direction="column" gap="3">
          <BdsGrid direction="column" gap="1">
            <BdsTypo variant="fs-14" bold="semi-bold">
              Email
            </BdsTypo>
            <BdsInput
              type="email"
              value={email}
              placeholder="seu@email.com"
              disabled={loading}
              onBdsChange={(e: CustomEvent) => setEmail(e.detail.value || '')}
            />
          </BdsGrid>

          <BdsGrid direction="column" gap="1">
            <BdsTypo variant="fs-14" bold="semi-bold">
              Senha
            </BdsTypo>
            <BdsGrid direction="row" align-items="center" style={{ position: 'relative' }}>
              <BdsInput
                type={showPassword ? 'text' : 'password'}
                value={password}
                placeholder="••••••••"
                disabled={loading}
                onBdsChange={(e: CustomEvent) => setPassword(e.detail.value || '')}
                style={{ width: '100%' }}
              />
              <BdsButton
                variant="ghost"
                size="short"
                icon={showPassword ? 'eye-closed' : 'eye-open'}
                onBdsClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                style={{ 
                  position: 'absolute', 
                  right: '8px', 
                  zIndex: 1,
                  minWidth: 'auto',
                  padding: '4px'
                }}
              />
            </BdsGrid>
          </BdsGrid>

          {error && (
            <BdsAlert>
              <BdsGrid direction="row" align-items="center" gap="1">
                <BdsIcon name="warning" size="small" />
                <BdsTypo variant="fs-14" color="danger">
                  {error}
                </BdsTypo>
              </BdsGrid>
            </BdsAlert>
          )}

          <BdsButton
            variant="primary"
            size="medium"
            disabled={loading}
            onBdsClick={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)}
            style={{ width: '100%' }}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </BdsButton>
        </BdsGrid>

        {/* Test Accounts Section */}
        <BdsGrid 
          direction="column" 
          gap="2" 
          padding="3"
          style={{ 
            backgroundColor: '#eff6ff', 
            borderRadius: '8px',
            border: '1px solid #dbeafe'
          }}
        >
          <BdsTypo variant="fs-16" bold="semi-bold" color="primary">
            Contas de Teste:
          </BdsTypo>
          <BdsGrid direction="column" gap="2">
            <BdsGrid direction="column" gap="1">
              <BdsTypo variant="fs-14" bold="semi-bold">
                Solicitante:
              </BdsTypo>
              <BdsTypo variant="fs-14" color="content-secondary">
                joao@empresa.com / 123456
              </BdsTypo>
            </BdsGrid>
            <BdsGrid direction="column" gap="1">
              <BdsTypo variant="fs-14" bold="semi-bold">
                Atendente:
              </BdsTypo>
              <BdsTypo variant="fs-14" color="content-secondary">
                maria@empresa.com / 123456
              </BdsTypo>
            </BdsGrid>
          </BdsGrid>
        </BdsGrid>
      </BdsGrid>
    </BdsGrid>
  );
};