export function ErrorMessage(
    error: (Error & { graphqlErrors?: Array<{ message: string }>}) | undefined
): string | null {
    if(!error) return null;
    const graphqlErrorMessage = error.graphqlErrors?.[0]?.message ?? error.message ?? 'Ocorreu um erro. Tente novamente.';
    if(graphqlErrorMessage === 'User already exists') return 'Este e-mail já está cadastrado.';
    if(graphqlErrorMessage === 'Invalid credentials') return 'O e-mail ou a senha estão inválidos.';
    return graphqlErrorMessage;
}