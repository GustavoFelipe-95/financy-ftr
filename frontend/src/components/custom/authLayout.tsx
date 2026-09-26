import React from 'react';
import { useAuthenticated } from '@/contexts/authContext';
import { Link, useLocation } from 'react-router-dom';
import { ContainerScreen } from '@components/designSystem';
import { AvatarProfile } from '@components/custom/avatarProfile';
import FinancyLogo from '@assets/financy_logo.svg';

const routesNavigation = [
    {label: 'Dashboard', value: '/'},
    {label: 'Transações', value: '/transactions'},
    {label: 'Categorias', value: '/categories'},
]

export function AuthLayout({ children }: { children: React.ReactNode }) {
    const { user } = useAuthenticated();
    const location = useLocation();

	return (
        <div className='min-h-screen flex flex-col bg-background'>
            <header className='border-b border-solid bg-background'>
                <ContainerScreen className='relative flex h-14 items-center justify-between'>
                    <Link
                        className='flex items-center shrink-0'
                        aria-label="Financy HomePage"
                        to="/">
                        <img src={FinancyLogo} alt="Financy Logo" className="h-8"/>
                    </Link>

                    <nav className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-8">
                        {routesNavigation.map((item) => (
                            <Link
                                key={item.value}
                                to={item.value}
                                className={`text-sm font-medium transition-colors ${
                                    location.pathname === item.value
                                        ? 'text-primary'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}>
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    <Link
                        className='flex items-center shrink-0 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring'
                        aria-label='Abrir Perfil'
                        to="/profile">
                        <AvatarProfile
                            name={user?.name ?? ''}
                            email={user?.email ?? ''}
                            size='sm'
                            className='bg-gray-200 text-gray-600' />
                    </Link>
                </ContainerScreen>
            </header>
            
            <main className='flex-1 py-8 bg-[var(--page-background)]'>
                <ContainerScreen>{children}</ContainerScreen>
            </main>
        </div>
	);
}