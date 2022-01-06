import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import { destroyCookie, parseCookies } from "nookies"
import decode from 'jwt-decode'
import { AuthTokenError } from "../services/errors/AuthTokenError"
import { validateUserPermissions } from "./validateUserPermissions"

type WithSSRAuthOptions = {
  permissions?: string[];
  roles?: string[]
}

export function withSSRAuth<P>(fn: GetServerSideProps<P>, options?: WithSSRAuthOptions): GetServerSideProps {
  return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(ctx)
    const token = cookies['dashgo.token']
    if (!token) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        }
      }
    }

    if (options) {
      const user = decode<{ permissions: string[], roles: string[] }>(token)
      const { permissions, roles } = options
      const userHasValidPermissions = validateUserPermissions({
        user,
        permissions,
        roles
      })

      if (!userHasValidPermissions) {
        return {
          redirect: {
            destination: '/dashboard',
            permanent: false
          }
        }
      }
    }

    try {

      return await fn(ctx)
    } catch (error) {
      if (error instanceof AuthTokenError) {
        destroyCookie(ctx, 'dashgo.token')
        destroyCookie(ctx, 'dashgo.refreshToken')
        return {
          redirect: {
            destination: '/',
            permanent: false
          }
        }
      }
    }

  }
}