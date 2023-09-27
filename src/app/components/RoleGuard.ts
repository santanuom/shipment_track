import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

export function useRoleGuard(requiredRole:String) {
  const { data: session } = useSession()
  const router = useRouter()

  if (!session || session.user.role !== requiredRole) {
    // Redirect to an error page or handle unauthorized access
    router.push('/unauthorized') // You can customize this URL
    return false
  }

  return true
}
