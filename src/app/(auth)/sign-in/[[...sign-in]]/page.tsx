'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { SignIn, useSignIn } from '@clerk/nextjs'

const SignInPage: React.FC = () => {
  const router = useRouter()
  const { isLoaded, signIn } = useSignIn()

  if (!isLoaded) {
    return null
  }
  return <SignIn />
}

export default SignInPage
