import { ContainerScreen } from "@components/designSystem";
import { Card, CardContent, CardDescription, CardHeader } from '@components/ui/card';
import FinancyLogo from '@assets/financy_logo.svg';
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

interface CredentialCardProps {
    title: string;
    description: string;
    children: React.ReactNode;
    secondaryDescription: string;
    secondaryLink: string;
    secondaryIcon: React.ReactNode;
    secondaryIconLabel: string;
}

export function CredentialCard({
    title,
    description,
    children,
    secondaryDescription,
    secondaryLink,
    secondaryIcon,
    secondaryIconLabel
}: CredentialCardProps) {
  return (
    <ContainerScreen
        className="min-h-screen flex flex-col items-center justify-center py-12"
        maxWidth="sm">
        <img src={FinancyLogo} alt={"Financy"} className="h-8 w-auto mb-8" />
        <Card className="w-full max-w-[448px]">
            <CardHeader className="flex flex-col items-center text-center">
                <h2 className="text-xl font-semibold leading-none tracking-tight">
                    {title}
                </h2>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            {children}
            <CardContent className="pt-0 flex flex-col gap-4">
                <div className="relative flex items-center gap-2">
                    <div className="flex-1 border-t border-solid" />
                    <span className="text-sm text-muted-foreground">ou</span>
                    <div className="flex-1 border-t border-solid" />
                </div>
                <p className="text-sm text-muted-foreground text-center">
                    {secondaryDescription}
                </p>
                <Button variant="outline" className="w-full" asChild>
                    <Link to={secondaryLink}>
                        {secondaryIcon}
                        {secondaryIconLabel}
                    </Link>
                </Button>
            </CardContent>
        </Card>
    </ContainerScreen>
  )
}