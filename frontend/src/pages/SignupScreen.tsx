import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@apollo/client/react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, LogIn, Mail, User } from 'lucide-react';

import { SIGNUP } from '@/graphql/api';
import { useAuthenticated } from '@/contexts/authContext';
import { CredentialCard } from '@/components/custom/credentialCard';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ErrorMessage } from '@/lib/erroMessage';
import { saveRememberMe } from '@/storage/auth';
import { signupSchema } from '@/validations/signupValidation';

import '@/index.css';

type FormData = z.infer<typeof signupSchema>;

export function SignupScreen() {
    const navigation = useNavigate();
    const { login } = useAuthenticated();

    const [showPassword, setShowPassword] = useState(false);

    const form = useForm<FormData>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            name: '',
            email: '',
            password: ''
        }
    })

    async function onSubmit(data: FormData) {
        console.log(data);
        signupMutation({
            variables: {
                name: data.name,
                email: data.email,
                password: data.password
            }
        })
    }

    const [signupMutation, { loading, error }] = useMutation(SIGNUP, {
        onCompleted: (data: unknown, clientOptions) => {
            const payload = data as { signup: { token: string; user: { id: string; email: string; name: string } } };
            const { token, user } = payload.signup;
            login(token, user);

            const values = clientOptions?.variables as { name?: string; email?: string; password?: string } | undefined;
            const email = values?.email;
            const password = values?.password;
            if (email && password) {
                saveRememberMe({ email, password });
            }

            navigation('/', { replace: true});
        }
    });

    const errorMessage = ErrorMessage(error);

    return (
        <CredentialCard
            title="Criar conta"
            description="Comece a controlar suas finanças ainda hoje"
            secondaryDescription="Já tem uma conta?"
            secondaryLink="/login"
            secondaryIcon={<LogIn />}
            secondaryIconLabel="Fazer Login">
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                    {errorMessage && (
                        <p className="text-sm text-destructive">{errorMessage}</p>
                    )}
                    <div className="space-y-2">
                        <Input
                            id="name"
                            label="Nome completo"
                            type="text"
                            placeholder="Seu nome completo"
                            startIcon={<User />}
                            error={!!form.formState.errors.name}
                            valid={!form.formState.errors.name && !!form.watch('name')}
                            {...form.register('name')}
                        />
                        {form.formState.errors.name && (
                            <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                        )}
                    </div>
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
                            <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
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
                            valid={!form.formState.errors.password && (form.watch('password')?.length ?? 0) >= 8}
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
                            <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                            A senha deve ter no mínimo 8 caracteres
                        </p>
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Cadastrando...' : 'Cadastrar'}
                    </Button>
                </CardContent>
            </form>
        </CredentialCard>
    )
}
