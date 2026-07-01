'use client'

import { useState, useRef } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Upload, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { uploadFileAction } from '@/lib/actions/upload'
import Image from 'next/image'

interface AvatarUploadProps {
    currentUrl?: string | null
    userName?: string
    onUploadComplete: (url: string) => void
}

export function AvatarUpload({ currentUrl, userName, onUploadComplete }: AvatarUploadProps) {
    const [uploading, setUploading] = useState(false)
    const [preview, setPreview] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file type
        if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
            toast.error('Formato inválido. Use JPEG, PNG ou WebP')
            return
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Imagem muito grande. Máximo 5MB')
            return
        }

        // Show preview
        const reader = new FileReader()
        reader.onloadend = () => {
            setPreview(reader.result as string)
        }
        reader.readAsDataURL(file)

        // Upload
        setUploading(true)
        try {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('bucket', 'avatars')

            const result = await uploadFileAction(formData)

            if (result.error) {
                throw new Error(result.error)
            }

            onUploadComplete(result.url!)
            toast.success('Avatar atualizado com sucesso!')
        } catch (error) {
            toast.error('Erro ao fazer upload da imagem')
            console.error(error)
            setPreview(null)
        } finally {
            setUploading(false)
        }
    }

    const handleClick = () => {
        fileInputRef.current?.click()
    }

    const displayUrl = preview || currentUrl

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="relative">
                {displayUrl ? (
                    <div className="relative w-32 h-32 rounded-full overflow-hidden">
                        <Image src={displayUrl} alt="Avatar" fill className="object-cover" />
                    </div>
                ) : (
                    <Avatar className="w-32 h-32">
                        <AvatarFallback className="text-4xl">
                            {userName?.charAt(0)?.toUpperCase() || 'U'}
                        </AvatarFallback>
                    </Avatar>
                )}
                {uploading && (
                    <div className="absolute inset-0 bg-background/80 rounded-full flex items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin" />
                    </div>
                )}
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
            />

            <Button type="button" variant="outline" onClick={handleClick} disabled={uploading}>
                <Upload className="w-4 h-4 mr-2" />
                Alterar Avatar
            </Button>

            <p className="text-sm text-muted-foreground text-center">
                JPEG, PNG ou WebP. Máximo 5MB.
            </p>
        </div>
    )
}
