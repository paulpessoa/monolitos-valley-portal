'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { LogOut, User as UserIcon, Settings } from 'lucide-react'

interface AuthButtonProps {
    user: User | null
    buttonText?: string
}

export function AuthButton({ user: initialUser, buttonText = 'Acesso de Membros' }: AuthButtonProps) {
    const router = useRouter()
    const supabase = createClient()
    const [user, setUser] = useState<User | null>(initialUser)
    const [profile, setProfile] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [isAdmin, setIsAdmin] = useState(false)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data: { user: currentUser } } = await supabase.auth.getUser()
                setUser(currentUser)

                if (currentUser) {
                    const { data } = await supabase
                        .from('profiles')
                        .select('full_name, avatar_url, role')
                        .eq('id', currentUser.id)
                        .single()
                    setProfile(data)
                    setIsAdmin(data?.role === 'admin')
                }
            } catch (error) {
                console.error('Error fetching user:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchUser()

        // Subscribe to auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
            setUser(session?.user || null)
            if (session?.user) {
                fetchUser()
            } else {
                setProfile(null)
            }
        })

        return () => subscription?.unsubscribe()
    }, [supabase])

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' })
        router.push('/')
        router.refresh()
    }

    if (loading) {
        return <Button variant="ghost" className="h-10 w-10 rounded-full animate-pulse" />
    }

    if (!user) {
        return (
            <Button
                onClick={() => router.push('/login')} variant="default"
            >
                {buttonText}
            </Button>
        )
    }

    const initials = user.email
        ?.split('@')[0]
        .slice(0, 2)
        .toUpperCase() || 'U'

    const avatarUrl = profile?.avatar_url || user.user_metadata?.avatar_url
    const fullName = profile?.full_name || user.user_metadata?.full_name || 'Usuário'

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={avatarUrl} alt={user.email || ''} />
                        <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                            {fullName}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/profile')}>
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Perfil</span>
                </DropdownMenuItem>
                {isAdmin && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => router.push('/admin')}>
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Administração</span>
                        </DropdownMenuItem>
                    </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
