import { auth } from '@/auth'
import { redirect } from 'next/navigation';
import React, { ReactNode } from 'react'
import "@/styles/admin.css"
import Sidebar from '@/components/admin/Sidebar';
import Header from '@/components/admin/Header';
const Layout = async({children}:{children:ReactNode}) => {
  
  const session = await auth();
  if(!session?.user?.id) redirect("/sign-in")

  return (
    <main className='flex min-h-screen w-full flex-row'>
      <p><Sidebar session={session}/></p>
      <div className='admin-container'>
        <p><Header session={session}/></p>
        {children}
      </div>
    </main>
  )
}

export default Layout