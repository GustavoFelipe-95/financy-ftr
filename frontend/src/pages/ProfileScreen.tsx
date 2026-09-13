import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema } from '@/validations/profileValidation';
import { useAuthenticated } from '@/contexts/authContext';
import { useNavigate } from 'react-router-dom'; 
import '@/index.css';
import { useProfileMutations } from '@/hooks/useMutations';
import { AuthLayout } from '@/components/custom/authLayout';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { AvatarProfile } from '@/components/custom/avatarProfile';
import { Input } from '@/components/ui/input';
import { LogOut, Mail, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

type ProfileFormData = z.infer<typeof profileSchema>;

export function ProfileScreen() {
  const navigation = useNavigate();
  const { user, updateUser, logout } = useAuthenticated();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? '',
    },
  });

  const { updateProfile, loadingProfile, errorProfile } = useProfileMutations((updatedUser) => {
    const name = updatedUser?.name ?? '';

    updateUser({ name });
    form.reset({ name });
  });

  if (!user) return null;

  const userId = user.id;

  async function handleUpdateProfile(data: ProfileFormData) {
    await updateProfile(userId, { name: data.name });
  }

  async function handleLogout() {
    logout();
    navigation('/login', { replace: true });
  }

  return (
    <AuthLayout>
      <div className='flex justify-center'>
        <Card className='w-full max-w-[448px]'>
          <CardHeader className='flex flex-col pb-2 items-center text-center'>
            <AvatarProfile
              name={user.name}
              email={user.email}
              size="lg"
              className="mb-3" />
            <h2 className='text-xl font-semibold leading-none tracking-tight'>
              {user?.name}
            </h2>
            <p className='text-sm text-muted-foreground mt-1'>
              {user?.email}
            </p>
          </CardHeader>

          <hr className='m-6' />
          
          <CardContent className='space-y-6'>
            <form onSubmit={form.handleSubmit(handleUpdateProfile)} className='space-y-4'>
              <Input
                label='Nome Completo'
                startIcon={<User className='size-4' />}
                {...form.register('name')}
                error={!!form.formState.errors.name}
                helperText={form.formState.errors.name?.message} />

              <Input
                label='E-mail'
                startIcon={<Mail className='size-4' />}
                value={user.email}
                disabled
                helperText="O e-mail não pode ser alterado." />

              {errorProfile && (
                <p className='text-sm text-destructive'>
                  Não foi possível atualizar o perfil. Tente novamente.
                </p>
              )}
              
              <div className='flex flex-col pt-2 gap-3'>
                <Button type='submit' disabled={loadingProfile} className='w-full'>
                  {loadingProfile ? 'Atualizando...' : 'Atualizar Perfil'}
                </Button>
                <Button
                  type='button'
                  className='w-full'
                  variant="outline"
                  onClick={handleLogout}>
                  <LogOut className='size-4 mr-2' />
                  Sair da Conta
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AuthLayout>    
  )
}
