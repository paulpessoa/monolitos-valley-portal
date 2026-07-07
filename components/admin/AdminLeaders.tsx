'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { 
    Users, Plus, Trash2, Edit2, CheckCircle2, Circle, 
    Linkedin, Instagram, Sparkles, Target, Loader2, Image as ImageIcon,
    FileSpreadsheet, Award, ShieldCheck, Clock
} from 'lucide-react'
import { toast } from 'sonner'
import { CommunityLeader } from '@/types/database'
import Image from 'next/image'

interface ProfileOption {
    id: string
    full_name: string | null
    email: string
    avatar_url?: string | null
    role?: string
}

const CHECKLIST_ITEMS = [
    { id: 'linkedin_headline', label: "LinkedIn: Mencionar 'Community Leader @ Monólitos Valley' no título", category: 'Linkedin' },
    { id: 'linkedin_experience', label: "LinkedIn: Adicionar experiência voluntária de Community Leader", category: 'Linkedin' },
    { id: 'linkedin_startup', label: "LinkedIn: Adicionar sua respectiva startup no perfil do LinkedIn", category: 'Linkedin' },
    { id: 'linkedin_post', label: "Post: Publicar post/depoimento no LinkedIn sobre o ecossistema", category: 'Linkedin' },
    { id: 'instagram_collab', label: "Redes: Collab no Instagram/TikTok com a comunidade", category: 'Redes' },
    { id: 'client_interviews', label: "Mercado: Entrevistar 5 clientes reais (sair do PowerPoint/Hackathon)", category: 'Mercado' },
    { id: 'monthly_retro', label: "Feedback: Enviar retro mensal com impedimentos da startup", category: 'Engajamento' },
    { id: 'event_presence', label: "Ecosistema: Comparecer a 1 evento externo (fora da universidade)", category: 'Engajamento' },
]

export function AdminLeaders() {
    const [leaders, setLeaders] = useState<CommunityLeader[]>([])
    const [profiles, setProfiles] = useState<ProfileOption[]>([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingLeader, setEditingLeader] = useState<CommunityLeader | null>(null)
    
    const [selectedLeader, setSelectedLeader] = useState<CommunityLeader | null>(null)
    const [isChecklistOpen, setIsChecklistOpen] = useState(false)

    // Form states
    const [formData, setFormData] = useState({
        role_title: 'Community Leader',
        startup_name: '',
        linkedin_url: '',
        instagram_url: '',
        photo_url: '',
        profile_id: '',
        dedicated_hours: 0
    })

    useEffect(() => {
        fetchLeaders()
        fetchProfiles()
    }, [])

    async function fetchLeaders() {
        try {
            const res = await fetch('/api/admin/leaders')
            const data = await res.json()
            if (res.ok) {
                setLeaders(data.data || [])
            } else {
                toast.error(data.error || "Erro ao buscar lideranças")
            }
        } catch (err) {
            console.error(err)
            toast.error("Erro na comunicação com a API")
        } finally {
            setLoading(false)
        }
    }

    async function fetchProfiles() {
        try {
            const res = await fetch('/api/admin/profiles')
            const data = await res.json()
            if (res.ok) {
                setProfiles(data.data || [])
            }
        } catch (err) {
            console.error(err)
        }
    }

    const handleOpenCreate = () => {
        fetchProfiles()
        setEditingLeader(null)
        setFormData({
            role_title: 'Community Leader',
            startup_name: '',
            linkedin_url: '',
            instagram_url: '',
            photo_url: '',
            profile_id: '',
            dedicated_hours: 0
        })
        setIsDialogOpen(true)
    }

    const handleOpenEdit = (leader: CommunityLeader) => {
        fetchProfiles()
        setEditingLeader(leader)
        setFormData({
            role_title: leader.role_title,
            startup_name: leader.startup_name || '',
            linkedin_url: leader.linkedin_url || '',
            instagram_url: leader.instagram_url || '',
            photo_url: leader.profiles?.avatar_url || '',
            profile_id: leader.profile_id,
            dedicated_hours: leader.dedicated_hours || 0
        })
        setIsDialogOpen(true)
    }

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setUploading(true)
        try {
            const uploadFormData = new FormData()
            uploadFormData.append('file', file)
            uploadFormData.append('bucket', 'avatars')
            if (formData.profile_id) {
                uploadFormData.append('profileId', formData.profile_id)
            }
            
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: uploadFormData
            })
            const data = await res.json()
            if (res.ok && data.url) {
                setFormData(prev => ({ ...prev, photo_url: data.url }))
                toast.success("Foto enviada com sucesso!")
            } else {
                toast.error(data.error || "Erro no upload")
            }
        } catch (err) {
            console.error(err)
            toast.error("Erro ao enviar arquivo")
        } finally {
            setUploading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.profile_id || !formData.role_title) {
            toast.error("Preencha perfil de usuário e cargo")
            return
        }
        setSubmitting(true)
        try {
            const url = editingLeader ? `/api/admin/leaders/${editingLeader.id}` : '/api/admin/leaders'
            const method = editingLeader ? 'PUT' : 'POST'
            
            const payload = {
                role_title: formData.role_title,
                startup_name: formData.startup_name || null,
                linkedin_url: formData.linkedin_url || null,
                instagram_url: formData.instagram_url || null,
                profile_id: formData.profile_id,
                avatar_url: formData.photo_url || undefined,
                dedicated_hours: Number(formData.dedicated_hours)
            }

            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
            const data = await res.json()
            if (res.ok) {
                const savedAvatar = data.data?.profiles?.avatar_url
                toast.success(
                    editingLeader 
                        ? `Liderança atualizada! Foto salva no perfil: ${savedAvatar ? 'Sim' : 'Não'}` 
                        : "Liderança adicionada com sucesso!"
                )
                if (savedAvatar) {
                    console.log("Avatar persistido com sucesso na conta:", savedAvatar)
                }
                // Refresh list of leaders
                fetchLeaders()
                setIsDialogOpen(false)
            } else {
                toast.error(data.error || "Erro ao processar requisição")
            }
        } catch (err) {
            console.error(err)
            toast.error("Erro interno")
        } finally {
            setSubmitting(false)
        }
    }

    const handleToggleTask = async (leader: CommunityLeader, taskId: string) => {
        const isCompleted = leader.checklist?.includes(taskId) || false
        const updatedChecklist = isCompleted
            ? (leader.checklist || []).filter(id => id !== taskId)
            : [...(leader.checklist || []), taskId]

        try {
            const res = await fetch(`/api/admin/leaders/${leader.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ checklist: updatedChecklist })
            })
            const data = await res.json()
            if (res.ok) {
                setLeaders(leaders.map(l => l.id === leader.id ? data.data : l))
                if (selectedLeader?.id === leader.id) {
                    setSelectedLeader(data.data)
                }
            } else {
                toast.error("Erro ao salvar progresso")
            }
        } catch (err) {
            console.error(err)
        }
    }

    const handleUpdateHoursDirect = async (leader: CommunityLeader, hours: number) => {
        try {
            const res = await fetch(`/api/admin/leaders/${leader.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ dedicated_hours: hours })
            })
            const data = await res.json()
            if (res.ok) {
                setLeaders(leaders.map(l => l.id === leader.id ? data.data : l))
                if (selectedLeader?.id === leader.id) {
                    setSelectedLeader(data.data)
                }
                toast.success("Horas dedicadas atualizadas!")
            }
        } catch (err) {
            console.error(err)
        }
    }

    const handleToggleValidator = async (leader: CommunityLeader, adminId: string) => {
        const alreadySigned = leader.approved_by?.includes(adminId) || false
        const updatedValidators = alreadySigned
            ? (leader.approved_by || []).filter(id => id !== adminId)
            : [...(leader.approved_by || []), adminId]

        const approved = updatedValidators.length >= 2

        try {
            const res = await fetch(`/api/admin/leaders/${leader.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    approved_by: updatedValidators,
                    hours_approved: approved 
                })
            })
            const data = await res.json()
            if (res.ok) {
                setLeaders(leaders.map(l => l.id === leader.id ? data.data : l))
                if (selectedLeader?.id === leader.id) {
                    setSelectedLeader(data.data)
                }
                toast.success(alreadySigned ? "Assinatura removida" : "Horas validadas com sucesso!")
            } else {
                toast.error("Erro ao atualizar validação")
            }
        } catch (err) {
            console.error(err)
        }
    }

    const handleDeleteLeader = async (leaderId: string) => {
        if (!confirm("Tem certeza que deseja remover esta liderança?")) return
        try {
            const res = await fetch(`/api/admin/leaders/${leaderId}`, { method: 'DELETE' })
            if (res.ok) {
                toast.success("Liderança removida")
                setLeaders(leaders.filter(l => l.id !== leaderId))
                setIsChecklistOpen(false)
            } else {
                toast.error("Erro ao deletar")
            }
        } catch (err) {
            console.error(err)
        }
    }

    const handleExportCSV = () => {
        const headers = ["Nome", "E-mail", "Cargo", "Startup", "Horas Dedicadas", "Validação Concluída", "Validadores (Assinaturas)", "Checklist Concluidos"]
        const rows = leaders.map(leader => {
            const fullName = leader.profiles?.full_name || 'Sem nome'
            const email = leader.profiles?.email || 'Sem e-mail'
            const role = leader.role_title
            const startup = leader.startup_name || 'Nenhuma'
            const hours = leader.dedicated_hours || 0
            const approved = leader.hours_approved ? 'Sim' : 'Não'
            const validatorsNames = leader.approved_by
                ?.map(id => profiles.find(p => p.id === id)?.full_name || 'Admin')
                .join('; ') || 'Nenhum'
            const checklistCount = leader.checklist?.length || 0
            return [
                `"${fullName}"`,
                `"${email}"`,
                `"${role}"`,
                `"${startup}"`,
                hours,
                `"${approved}"`,
                `"${validatorsNames}"`,
                `${checklistCount}/${CHECKLIST_ITEMS.length}`
            ]
        })
        const csvContent = "\uFEFF" + [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.setAttribute("href", url)
        link.setAttribute("download", `liderancas-relatorio-horas-${new Date().toISOString().slice(0,10)}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        toast.success("Relatório de Horas exportado com sucesso!")
    }

    const selectedUser = profiles.find(p => p.id === formData.profile_id)
    const adminProfiles = profiles.filter(p => p.role === 'admin')

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Lideranças da Comunidade</h2>
                    <p className="text-muted-foreground text-sm">
                        Gerencie os líderes voluntários, acompanhe suas tarefas práticas de mercado e certifique suas horas.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button 
                        onClick={handleExportCSV}
                        variant="outline"
                        className="gap-2 border-stone-200 hover:bg-stone-50 text-stone-700"
                    >
                        <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
                        <span>Exportar CSV</span>
                    </Button>
                    <Button 
                        onClick={handleOpenCreate}
                        className="bg-[#F2CB05] hover:bg-[#d4b304] text-stone-900 font-semibold gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Adicionar Líder</span>
                    </Button>
                </div>
            </div>

            {leaders.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <Users className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-60" />
                        <p className="text-muted-foreground">Nenhuma liderança cadastrada ainda.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="border rounded-xl bg-white overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left text-xs text-stone-600">
                            <thead className="bg-stone-50 text-[10px] font-bold text-stone-400 uppercase tracking-wider border-b">
                                <tr>
                                    <th className="px-6 py-4">Foto</th>
                                    <th className="px-6 py-4">Nome</th>
                                    <th className="px-6 py-4">Cargo / Função</th>
                                    <th className="px-6 py-4">Startup</th>
                                    <th className="px-6 py-4">Horas Dedicadas</th>
                                    <th className="px-6 py-4">Status Certificado</th>
                                    <th className="px-6 py-4 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                                {leaders.map(leader => {
                                    const completedCount = leader.checklist?.length || 0
                                    const totalCount = CHECKLIST_ITEMS.length
                                    const pct = Math.round((completedCount / totalCount) * 100)
                                    const fullName = leader.profiles?.full_name || 'Sem nome cadastrado'
                                    const email = leader.profiles?.email || 'Sem email'

                                    return (
                                        <tr key={leader.id} className="hover:bg-stone-50/40 transition-colors">
                                            {/* Photo */}
                                            <td className="px-6 py-4">
                                                {leader.profiles?.avatar_url ? (
                                                    <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-stone-200 bg-white">
                                                        <Image
                                                            src={leader.profiles.avatar_url}
                                                            alt={fullName}
                                                            fill
                                                            className="object-cover"
                                                            unoptimized
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 font-bold border border-amber-200 flex items-center justify-center text-sm shadow-sm">
                                                        {fullName.charAt(0)}
                                                    </div>
                                                )}
                                            </td>

                                            {/* Name */}
                                            <td className="px-6 py-4 font-bold text-stone-900">
                                                <div className="flex flex-col">
                                                    <span>{fullName}</span>
                                                    <span className="text-[10px] text-stone-400 font-normal">{email}</span>
                                                </div>
                                            </td>

                                            {/* Role */}
                                            <td className="px-6 py-4 font-semibold text-stone-700">
                                                {leader.role_title}
                                            </td>

                                            {/* Startup */}
                                            <td className="px-6 py-4">
                                                {leader.startup_name ? (
                                                    <Badge variant="outline" className="bg-amber-50/50 text-[10px]">
                                                        {leader.startup_name}
                                                    </Badge>
                                                ) : (
                                                    <span className="text-stone-400 italic">Nenhuma</span>
                                                )}
                                            </td>

                                            {/* Hours */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5 font-bold text-stone-700">
                                                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                                                    <span>{leader.dedicated_hours || 0} horas</span>
                                                </div>
                                            </td>

                                            {/* Certificado Approval Status */}
                                            <td className="px-6 py-4">
                                                {leader.hours_approved ? (
                                                    <Badge className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100/50 font-bold flex items-center gap-1 w-fit">
                                                        <Award className="w-3 h-3 text-green-600" />
                                                        <span>Aprovado</span>
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline" className="bg-stone-50/50 text-stone-500 font-semibold flex items-center gap-1 w-fit">
                                                        <ShieldCheck className="w-3 h-3 text-stone-400" />
                                                        <span>Aguardando ({leader.approved_by?.length || 0}/2)</span>
                                                    </Badge>
                                                )}
                                            </td>

                                            {/* Actions */}
                                            <td className="px-6 py-4 text-right space-x-1.5">
                                                <Button 
                                                    variant="secondary" 
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedLeader(leader)
                                                        setIsChecklistOpen(true)
                                                    }}
                                                    className="h-8 text-[10px] font-bold"
                                                >
                                                    <Sparkles className="h-3 w-3 text-amber-500 mr-1" />
                                                    Checklist
                                                </Button>
                                                <Button 
                                                    variant="outline" 
                                                    size="sm"
                                                    onClick={() => handleOpenEdit(leader)}
                                                    className="h-8 text-[10px] font-bold"
                                                >
                                                    <Edit2 className="h-3 w-3 mr-1" />
                                                    Editar
                                                </Button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Dialog de Criar/Editar Líder */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>{editingLeader ? "Editar Liderança" : "Adicionar Nova Liderança"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                        {/* 1. Escolha de Perfil de Usuário */}
                        <div className="grid gap-2">
                            <Label htmlFor="profile_id">Usuário da Plataforma *</Label>
                            <select
                                id="profile_id"
                                value={formData.profile_id}
                                onChange={e => setFormData({ ...formData, profile_id: e.target.value })}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                required
                                disabled={!!editingLeader}
                            >
                                <option value="">Selecione um usuário...</option>
                                {profiles.map(p => (
                                    <option key={p.id} value={p.id}>
                                        {p.full_name || p.email} ({p.email})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Selected user preview card */}
                        {selectedUser && (
                            <div className="bg-stone-50 border rounded-lg p-3 flex items-center gap-3">
                                {formData.photo_url || selectedUser.avatar_url ? (
                                    <div className="relative w-12 h-12 rounded-lg overflow-hidden border bg-white flex-shrink-0">
                                        <Image 
                                            src={formData.photo_url || selectedUser.avatar_url!} 
                                            alt="Avatar" 
                                            fill 
                                            className="object-cover" 
                                            unoptimized 
                                        />
                                    </div>
                                ) : (
                                    <div className="w-12 h-12 rounded-lg bg-amber-100 text-amber-800 font-bold border border-amber-200 flex items-center justify-center text-sm shadow-sm flex-shrink-0">
                                        {(selectedUser.full_name || selectedUser.email).charAt(0)}
                                    </div>
                                )}
                                <div className="text-xs space-y-0.5 min-w-0">
                                    <p className="font-bold text-stone-900 truncate">{selectedUser.full_name || 'Sem nome cadastrado'}</p>
                                    <p className="text-stone-400 truncate">{selectedUser.email}</p>
                                </div>
                            </div>
                        )}

                        {/* File image upload */}
                        <div className="grid gap-2">
                            <Label htmlFor="avatar_file">Foto de Perfil (Atualizar Avatar da Conta)</Label>
                            <div className="flex items-center gap-3">
                                <Input
                                    id="avatar_file"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarUpload}
                                    disabled={uploading || !formData.profile_id}
                                    className="flex-1 text-xs file:bg-stone-100 file:border-0 file:rounded-md file:text-xs"
                                />
                                {uploading && <Loader2 className="w-5 h-5 animate-spin text-amber-500 flex-shrink-0" />}
                            </div>
                            <p className="text-[10px] text-stone-400">
                                Envie uma imagem para atualizar diretamente o avatar de usuário na plataforma.
                            </p>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="role_title">Cargo / Função *</Label>
                            <Input
                                id="role_title"
                                value={formData.role_title}
                                onChange={e => setFormData({ ...formData, role_title: e.target.value })}
                                placeholder="Ex: Community Leader, Head de Mentoria"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="startup_name">Startup Relacionada (Opcional)</Label>
                            <Input
                                id="startup_name"
                                value={formData.startup_name}
                                onChange={e => setFormData({ ...formData, startup_name: e.target.value })}
                                placeholder="Ex: ApexVet"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="dedicated_hours">Horas de Atividade Dedicadas</Label>
                            <Input
                                id="dedicated_hours"
                                type="number"
                                min="0"
                                value={formData.dedicated_hours}
                                onChange={e => setFormData({ ...formData, dedicated_hours: Number(e.target.value) })}
                                placeholder="Ex: 40"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="linkedin_url">LinkedIn URL (Opcional)</Label>
                            <Input
                                id="linkedin_url"
                                value={formData.linkedin_url}
                                onChange={e => setFormData({ ...formData, linkedin_url: e.target.value })}
                                placeholder="Ex: https://linkedin.com/in/perfil"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="instagram_url">Instagram URL (Opcional)</Label>
                            <Input
                                id="instagram_url"
                                value={formData.instagram_url}
                                onChange={e => setFormData({ ...formData, instagram_url: e.target.value })}
                                placeholder="Ex: https://instagram.com/perfil"
                            />
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={submitting || uploading}>
                                {submitting ? "Processando..." : "Salvar Alterações"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal de Checklist do Líder */}
            <Dialog open={isChecklistOpen} onOpenChange={setIsChecklistOpen}>
                <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
                    {selectedLeader && (
                        <>
                            <DialogHeader>
                                <div className="flex justify-between items-start pr-6">
                                    <div>
                                        <DialogTitle className="text-xl font-bold">{selectedLeader.profiles?.full_name || 'Sem nome'}</DialogTitle>
                                        <p className="text-xs text-muted-foreground">{selectedLeader.role_title}</p>
                                    </div>
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        className="h-8 w-8 opacity-70 hover:opacity-100"
                                        onClick={() => handleDeleteLeader(selectedLeader.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </DialogHeader>

                            <div className="space-y-5 py-4">
                                {/* Informações Básicas */}
                                <div className="bg-stone-50 rounded-lg p-3 grid grid-cols-2 gap-2 text-xs border border-stone-200/60">
                                    <div>
                                        <p className="font-semibold text-stone-500">Startup</p>
                                        <p className="font-medium text-stone-900">{selectedLeader.startup_name || 'Nenhuma vinculada'}</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-stone-500">E-mail</p>
                                        <p className="font-medium text-stone-900 truncate">{selectedLeader.profiles?.email || 'Não informado'}</p>
                                    </div>
                                </div>

                                {/* Seção de Horas & Validação de Certificado */}
                                <div className="border rounded-lg p-4 bg-amber-50/20 border-amber-200/60 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1.5">
                                            <Award className="h-4.5 w-4.5 text-[#F2CB05]" />
                                            <h4 className="text-sm font-bold text-stone-900">Horas Complementares & Certificado</h4>
                                        </div>
                                        {selectedLeader.hours_approved ? (
                                            <Badge className="bg-green-100 text-green-800 border border-green-200 font-bold">
                                                Aprovado para Emissão
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="bg-stone-100 text-stone-600 border-stone-200 font-bold">
                                                Aguardando Assinaturas ({selectedLeader.approved_by?.length || 0}/2)
                                            </Badge>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 items-center">
                                        <div className="space-y-1">
                                            <Label htmlFor="dedicated_hours_modal" className="text-xs font-semibold text-stone-500">Total de Horas Dedicadas</Label>
                                            <div className="flex gap-2 items-center">
                                                <Input
                                                    id="dedicated_hours_modal"
                                                    type="number"
                                                    min="0"
                                                    className="h-8 text-xs font-bold w-24 bg-white"
                                                    defaultValue={selectedLeader.dedicated_hours || 0}
                                                    onBlur={(e) => handleUpdateHoursDirect(selectedLeader, Number(e.target.value))}
                                                />
                                                <span className="text-[10px] text-stone-400">Pressione fora para salvar</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2 pt-2 border-t border-dashed border-stone-200">
                                        <Label className="text-xs font-semibold text-stone-600 flex items-center gap-1">
                                            <ShieldCheck className="w-3.5 h-3.5 text-stone-400" />
                                            Assinaturas de Administradores Validadores (Mínimo 2)
                                        </Label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-white p-3 rounded-lg border">
                                            {adminProfiles.map(adm => {
                                                const signed = selectedLeader.approved_by?.includes(adm.id) || false
                                                return (
                                                    <button
                                                        key={adm.id}
                                                        type="button"
                                                        onClick={() => handleToggleValidator(selectedLeader, adm.id)}
                                                        className="flex items-center justify-between text-left text-xs p-1.5 rounded hover:bg-stone-50 transition-colors"
                                                    >
                                                        <span className="font-semibold text-stone-700 truncate mr-2">{adm.full_name || adm.email}</span>
                                                        <div className="flex-shrink-0">
                                                            {signed ? (
                                                                <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 font-bold border-amber-200 text-[9px] px-1 py-0.5">
                                                                    Assinado
                                                                </Badge>
                                                            ) : (
                                                                <span className="text-[9px] text-stone-400 font-medium">Assinar</span>
                                                            )}
                                                        </div>
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {/* Checklist Interativo */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <Target className="h-4 w-4 text-[#F2CB05]" />
                                        <h4 className="text-sm font-bold text-stone-900">Checklist: Do Acadêmico ao Mercado</h4>
                                    </div>
                                    <div className="divide-y border rounded-lg bg-background overflow-hidden">
                                        {CHECKLIST_ITEMS.map(item => {
                                            const done = selectedLeader.checklist?.includes(item.id) || false
                                            return (
                                                <button
                                                    key={item.id}
                                                    type="button"
                                                    onClick={() => handleToggleTask(selectedLeader, item.id)}
                                                    className="w-full text-left px-4 py-3 flex items-center justify-between hover:bg-stone-50/50 transition-colors"
                                                >
                                                    <span className={`text-xs ${done ? 'line-through text-stone-400 font-normal' : 'text-stone-700 font-medium'}`}>
                                                        {item.label}
                                                    </span>
                                                    <div>
                                                        {done ? (
                                                            <CheckCircle2 className="h-4.5 w-4.5 text-green-500 fill-green-50" />
                                                        ) : (
                                                            <Circle className="h-4.5 w-4.5 text-stone-300" />
                                                        )}
                                                    </div>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
