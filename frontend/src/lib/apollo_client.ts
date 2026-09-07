import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import { CombinedGraphQLErrors } from '@apollo/client/errors'
import { SetContextLink } from '@apollo/client/link/context'
import { ErrorLink } from '@apollo/client/link/error'
import { getToken, clearToken } from '@storage/auth'

const httpLink = new HttpLink({
  uri: import.meta.env.VITE_GRAPHQL_URI,
})

const authenticationLink = new SetContextLink((prevContext) => {
  const token = getToken()
  return {
    headers: {
      ...prevContext.headers,
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
  }
})

const errorLink = new ErrorLink(({ error }) => {
  if (CombinedGraphQLErrors.is(error)) {
    const isUnauthorized = error.errors.some(
      (graphQLError) => {
        const extensions = graphQLError.extensions as
          | { code?: string; http?: { status?: number } }
          | undefined

        return (
          extensions?.code === 'NOT_AUTHENTICATED' ||
          extensions?.http?.status === 401
        )
      }
    )

    if (isUnauthorized) {
      clearToken()
      window.location.href = '/login'
    }
  }
})

export const apolloClient = new ApolloClient({
  link: authenticationLink.concat(errorLink).concat(httpLink),
  cache: new InMemoryCache(),
})