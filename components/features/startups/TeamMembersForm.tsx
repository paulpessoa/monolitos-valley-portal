'use client'

import { useState } from 'react'
import { TeamMember } from '@/types/database'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Trash2, Upload, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { uploadFileAction } from '@/lib/actions/upload'

interface TeamMembersFormProps {
    startupId: string
    members: TeamMember[]
    onMembersChange?: (members: TeamMember[]) => void
}

export function TeamMembersForm({ startupId, members, onMembersChange }: TeamMembersFormProps) {
    const [isAdding, setIsAdding] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [photoUrl, setPhotoUrl] = useState('')
    const [formData, setFormData] = useState({
        full_name: '',
        role: '',
        linkedin: '',
        github: '',
        behance: '',
        portfolio: '',
        lattes: '',
        instagram: '',
        outros: '',
    })

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        try {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('bucket', 'team-members')

            const result = await uploadFileAction(formData)

            if (result.error) throw new Error(result.error)

            setPhotoUrl(result.url!)
        } catch (error) {
            console.error('Error uploading photo:', error)
            alert('Erro ao enviar foto')
        } finally {
            setUploading(false)
        }
    }

    const handleAddMember = async () => {
        if (!formData.full_name || !formData.role) {
            alert('Por favor, preencha nome e função')
            return
        }

        try {
            const res = await fetch('/api/team-members', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    startup_id: startupId,
                    full_name: formData.full_name,
                    photo_url: photoUrl || null,
                    role: formData.role,
                    linkedin: formData.linkedin || null,
                    github: formData.github || null,
                    behance: formData.behance || null,
                    portfolio: formData.portfolio || null,
                    lattes: formData.lattes || null,
                    instagram: formData.instagram || null,
                    outros: formData.outros || null,
                }),
            })

            if (!res.ok) {
                throw new Error('Erro ao adicionar membro')
            }

            const { data } = await res.json()

            if (onMembersChange) {
                onMembersChange([...members, data])
            }

            // Reset form
            setFormData({
                full_name: '',
                role: '',
                linkedin: '',
                github: '',
                behance: '',
                portfolio: '',
                lattes: '',
                instagram: '',
                outros: '',
            })
            setPhotoUrl('')
            setIsAdding(false)
        } catch (error) {
            console.error('Error adding member:', error)
            alert('Erro ao adicionar membro')
        }
    }

    const handleRemoveMember = async (memberId: string) => {
        if (!confirm('Tem certeza que deseja remover este membro?')) {
            return
        }

        try {
            const res = await fetch(`/api/team-members/${memberId}`, {
                method: 'DELETE',
            })

            if (!res.ok) {
                throw new Error('Erro ao remover membro')
            }

            if (onMembersChange) {
                onMembersChange(members.filter((m) => m.id !== memberId))
            }
        } catch (error) {
            console.error('Error removing member:', error)
            alert('Erro ao remover membro')
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-stone-900">Membros do Time</h3>
                    {!isAdding && (
                        <Button
                            size="sm"
                            className="bg-amber-600 hover:bg-amber-700"
                            onClick={() => setIsAdding(true)}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Adicionar Membro
                        </Button>
                    )}
                </div>

                {/* Lista de membros */}
                {members.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {members.map((member) => (
                            <Card key={member.id} className="hover:shadow-md transition-shadow">
                                <CardContent className="pt-6">
                                    <div className="flex items-start gap-3 mb-3">
                                        {member.photo_url ? (
                                            <Image
                                                src={member.photo_url}
                                                alt={member.full_name}
                                                width={48}
                                                height={48}
                                                className="rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold">
                                                {member.full_name.charAt(0)}
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-stone-900 truncate">
                                                {member.full_name}
                                            </p>
                                            <p className="text-xs text-amber-600 font-medium">{member.role}</p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                            onClick={() => handleRemoveMember(member.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Formulário de adição */}
                {isAdding && (
                    <Card className="border-amber-200 bg-amber-50">
                        <CardHeader>
                            <CardTitle className="text-base">Adicionar Novo Membro</CardTitle>
                            <CardDescription>Preencha os dados do novo membro do time</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Photo Upload */}
                            <div>
                                <Label>Foto</Label>
                                <div className="flex items-center gap-4 mt-2">
                                    {photoUrl && (
                                        <Image
                                            src={photoUrl}
                                            alt="Preview"
                                            width={64}
                                            height={64}
                                            className="rounded-full object-cover"
                                        />
                                    )}
                                    <div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handlePhotoUpload}
                                            className="hidden"
                                            id="photo-upload"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => document.getElementById('photo-upload')?.click()}
                                            disabled={uploading}
                                        >
                                            {uploading ? (
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            ) : (
                                                <Upload className="w-4 h-4 mr-2" />
                                            )}
                                            {photoUrl ? 'Alterar Foto' : 'Enviar Foto'}
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="full_name">Nome Completo *</Label>
                                <Input
                                    id="full_name"
                                    placeholder="Ex: João Silva"
                                    value={formData.full_name}
                                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <Label htmlFor="role">Função *</Label>
                                <Input
                                    id="role"
                                    placeholder="Ex: CEO, CTO, Designer"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="mt-1"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="linkedin">LinkedIn</Label>
                                    <Input
                                        id="linkedin"
                                        placeholder="https://linkedin.com/in/..."
                                        value={formData.linkedin}
                                        onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="github">GitHub</Label>
                                    <Input
                                        id="github"
                                        placeholder="https://github.com/..."
                                        value={formData.github}
                                        onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                                        className="mt-1"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="behance">Behance</Label>
                                    <Input
                                        id="behance"
                                        placeholder="https://behance.net/..."
                                        value={formData.behance}
                                        onChange={(e) => setFormData({ ...formData, behance: e.target.value })}
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="portfolio">Portfólio</Label>
                                    <Input
                                        id="portfolio"
                                        placeholder="https://..."
                                        value={formData.portfolio}
                                        onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                                        className="mt-1"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="lattes">Lattes</Label>
                                    <Input
                                        id="lattes"
                                        placeholder="http://lattes.cnpq.br/..."
                                        value={formData.lattes}
                                        onChange={(e) => setFormData({ ...formData, lattes: e.target.value })}
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="instagram">Instagram</Label>
                                    <Input
                                        id="instagram"
                                        placeholder="https://instagram.com/..."
                                        value={formData.instagram}
                                        onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                                        className="mt-1"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="outros">Outros</Label>
                                <Input
                                    id="outros"
                                    placeholder="https://..."
                                    value={formData.outros}
                                    onChange={(e) => setFormData({ ...formData, outros: e.target.value })}
                                    className="mt-1"
                                />
                            </div>

                            <div className="flex gap-2 pt-4">
                                <Button className="bg-amber-600 hover:bg-amber-700" onClick={handleAddMember}>
                                    Adicionar
                                </Button>
                                <Button variant="outline" onClick={() => setIsAdding(false)}>
                                    Cancelar
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
