'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { SignUp, useSignUp } from '@clerk/nextjs'

const SignUpPage: React.FC = () => {
  const router = useRouter()
  const { isLoaded, signUp } = useSignUp()

  if (!isLoaded) {
    return null
  }
  return <SignUp />
}

export default SignUpPage
