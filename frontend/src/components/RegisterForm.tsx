import {
  BdsIcon,
  BdsGrid,
  BdsTypo,
  BdsInput,
  BdsButton,
  BdsAlert,
  BdsSelect,
  BdsSelectOption
} from 'blip-ds/dist/blip-ds-react/components';
import React, { useState } from 'react';
import { useAuthContext } from '../contexts/AuthContext';

interface RegisterFormProps {
  onRegisterSuccess?: () => void;
  onBackToLogin?: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ 
  onRegisterSuccess, 
  onBackToLogin 
}) => {
  const { register, error: authError, isLoading } = useAuthContext();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState<'solicitante' | 'atendente'>('solicitante');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    // Validate form
    if (!name || !email || !password || !confirmPassword) {
      setLocalError('Por favor, preencha todos os campos');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('As senhas não coincidem');
      return;
    }

    if (password.length < 6) {
      setLocalError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setLocalError('Por favor, insira um email válido');
      return;
    }

    try {
      const success = await register(name, email, password, userType);

      if (success) {
        // Registration successful - show success message
        setSuccessMessage('Conta criada com sucesso! Redirecionando para o login...');
        setLocalError('');
        
        // Redirect to login after showing success message
        setTimeout(() => {
          onRegisterSuccess?.();
        }, 2000);
      }
    } catch (error) {
      // Error is already handled by AuthContext
      console.error('Register error:', error);
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
            backgroundColor: '#16a34a',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <BdsIcon name='user-add' size="large" style={{ color: 'white' }} />
          </div>
          <BdsTypo variant="fs-24" bold="extra-bold" color="primary">
            Criar Conta
          </BdsTypo>
          <BdsTypo variant="fs-14" color="content-secondary">
            Preencha os dados para criar sua conta
          </BdsTypo>
        </BdsGrid>

        {/* Form Section */}
        <BdsGrid direction="column" gap="3">
          <BdsGrid direction="column" gap="1">
            <BdsTypo variant="fs-14" bold="semi-bold">
              Nome Completo
            </BdsTypo>
            <BdsInput
              type="text"
              value={name}
              placeholder="Seu nome completo"
              disabled={isLoading}
              onBdsChange={(e: CustomEvent) => setName(e.detail.value || '')}
            />
          </BdsGrid>

          <BdsGrid direction="column" gap="1">
            <BdsTypo variant="fs-14" bold="semi-bold">
              Email
            </BdsTypo>
            <BdsInput
              type="email"
              value={email}
              placeholder="seu@email.com"
              disabled={isLoading}
              onBdsChange={(e: CustomEvent) => setEmail(e.detail.value || '')}
            />
          </BdsGrid>

          <BdsGrid direction="column" gap="1">
            <BdsTypo variant="fs-14" bold="semi-bold">
              Tipo de Usuário
            </BdsTypo>
            <BdsSelect
              value={userType}
              disabled={isLoading}
              onBdsChange={(e: CustomEvent) => setUserType(e.detail.value as 'solicitante' | 'atendente')}
            >
              <BdsSelectOption value="solicitante">
                Solicitante - Pode criar e acompanhar incidentes
              </BdsSelectOption>
              <BdsSelectOption value="atendente">
                Atendente - Pode gerenciar e resolver incidentes
              </BdsSelectOption>
            </BdsSelect>
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
                disabled={isLoading}
                onBdsChange={(e: CustomEvent) => setPassword(e.detail.value || '')}
                style={{ width: '100%' }}
              />
              <BdsButton
                variant="ghost"
                size="short"
                icon={showPassword ? 'eye-closed' : 'eye-open'}
                onBdsClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
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

          <BdsGrid direction="column" gap="1">
            <BdsTypo variant="fs-14" bold="semi-bold">
              Confirmar Senha
            </BdsTypo>
            <BdsGrid direction="row" align-items="center" style={{ position: 'relative' }}>
              <BdsInput
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                placeholder="••••••••"
                disabled={isLoading}
                onBdsChange={(e: CustomEvent) => setConfirmPassword(e.detail.value || '')}
                style={{ width: '100%' }}
              />
              <BdsButton
                variant="ghost"
                size="short"
                icon={showConfirmPassword ? 'eye-closed' : 'eye-open'}
                onBdsClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
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

          {(localError || authError) && (
            <BdsAlert>
              <BdsGrid direction="row" align-items="center" gap="1">
                <BdsIcon name="warning" size="small" />
                <BdsTypo variant="fs-14" color="danger">
                  {localError || authError}
                </BdsTypo>
              </BdsGrid>
            </BdsAlert>
          )}

          {successMessage && (
            <BdsAlert>
              <BdsGrid direction="row" align-items="center" gap="1">
                <BdsIcon name="check" size="small" />
                <BdsTypo variant="fs-14" color="success">
                  {successMessage}
                </BdsTypo>
              </BdsGrid>
            </BdsAlert>
          )}

          <BdsButton
            variant="primary"
            size="medium"
            disabled={isLoading || !name || !email || !password || !confirmPassword}
            onBdsClick={() => handleSubmit({ preventDefault: () => { } } as React.FormEvent)}
            style={{ width: '100%' }}
          >
            {isLoading ? 'Criando conta...' : 'Criar Conta'}
          </BdsButton>

          <BdsGrid direction="column" justify-content="center" alignItems='center' gap="1">
            <BdsTypo variant="fs-14" color="content-secondary">
              Já tem uma conta?
            </BdsTypo>
            <BdsButton
              variant="ghost"
              size="short"
              onBdsClick={onBackToLogin}
              disabled={isLoading}
              style={{ minWidth: 'auto', padding: '0' }}
            >
                Entrar
            </BdsButton>
          </BdsGrid>
        </BdsGrid>
      </BdsGrid>
    </BdsGrid>
  );
};
