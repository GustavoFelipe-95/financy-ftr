import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@apollo/client/react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, UserPlus2 } from 'lucide-react';

import { LOGIN } from '@/graphql/api';
import { useAuthenticated } from '@/contexts/authContext';
import { CredentialCard } from '@/components/custom/credentialCard';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ErrorMessage } from '@/lib/erroMessage';
import { clearRememberMe, getRememberMe, saveRememberMe } from '@/storage/auth';
import { loginSchema } from '@/validations/loginValidation';

import '@/index.css';

type FormData = z.infer<typeof loginSchema>;

export function LoginScreen() {
  const navigation = useNavigate();
  const { login } = useAuthenticated();

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const rememberMeRef = useRef(rememberMe);

  rememberMeRef.current = rememberMe;

  const form = useForm<FormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  useEffect(() => {
    const remembered = getRememberMe();
    if (remembered) {
      form.reset({'email': remembered.email, 'password': remembered.password});
      setRememberMe(true);
    }
  }, []);

  async function onSubmit(data: FormData) {
    loginMutation({
      variables: {
        email: data.email,
        password: data.password
      }
    })
  }

  const [loginMutation, { loading, error }] = useMutation(LOGIN, {
    onCompleted: (data: unknown, clientOptions) => {
      const payload = data as { login: { token: string; user: { id: string; email: string; name: string } } };
      const { token, user } = payload.login;
      login(token, user);

      const values = clientOptions?.variables as { email: string; password: string } | undefined;
      const email = values?.email;
      const password = values?.password;
      if (rememberMeRef.current && email && password) {
        saveRememberMe({ email, password });
      } else {
        clearRememberMe();
      }

      navigation('/', { replace: true });
    }
  });

  const errorMessage = ErrorMessage(error);

  return (
    <CredentialCard
        title="Fazer Login"
        description="Entre na sua conta para continuar"
        secondaryDescription="Ainda não tem uma conta?"
        secondaryLink="/signup"
        secondaryIcon={<UserPlus2 />}
        secondaryIconLabel="Criar conta"
    >
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {errorMessage && (
            <p className="text-sm text-destructive">{errorMessage}</p>
          )}
          <div className="space-y-2">
            <Input
              id="email"
              label="E-mail"
              type="email"
              placeholder="mail@exemplo.com"
              startIcon={<Mail />}
              error={!!form.formState.errors.email}
              valid={!form.formState.errors.email && !!form.watch('email')}
              {...form.register('email')}
            />
            {form.formState.errors.email && (
              <p className="text-xs text-gray-500">{form.formState.errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Input
              id="password"
              label="Senha"
              type={showPassword ? 'text' : 'password'}
              placeholder="Digite sua senha"
              startIcon={<Lock />}
              error={!!form.formState.errors.password}
              endIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="cursor-pointer hover:text-foreground focus:outline-none"
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? <Eye /> : <EyeOff />}
                </button>
              }
              {...form.register('password')}
            />
            {form.formState.errors.password && (
              <p className="text-xs text-gray-500">{form.formState.errors.password.message}</p>
            )}
          </div>
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="rounded border-input"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span className="text-muted-foreground">Lembrar-me</span>
            </label>
            <Link to="#" className="text-primary hover:cursor-not-allowed">
              Recuperar senha
            </Link>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </CardContent>
      </form>
    </CredentialCard>
  )
}
