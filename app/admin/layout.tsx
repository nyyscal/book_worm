import { auth } from '@/auth'
import { redirect } from 'next/navigation';
import React, { ReactNode } from 'react'
import "@/styles/admin.css"
import Sidebar from '@/components/admin/Sidebar';
import Header from '@/components/admin/Header';
import { db } from '@/database/drizzle';
import { eq } from 'drizzle-orm';
import { users } from '@/database/schema';
const Layout = async({children}:{children:ReactNode}) => {
  
  const session = await auth();
  if(!session?.user?.id) redirect("/sign-in")
    const isAdmin = await db.select({isAdmin: users.role})
  .from(users)
  .where(eq(users.id,session.user.id))
  .limit(1)
  .then((res)=> res[0]?.isAdmin === "ADMIN");

  if(!isAdmin) redirect("/")
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