'use client'

import { useState } from 'react'
import { Startup } from '@/types/database'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useForm, Controller } from 'react-hook-form'
import { Loader2, Upload, X } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'
import dynamic from 'next/dynamic'

const LocationPicker = dynamic(
    () => import('./LocationPicker').then((mod) => ({ default: mod.LocationPicker })),
    { ssr: false, loading: () => <div className="h-[200px] bg-muted animate-pulse rounded-lg" /> }
)

interface StartupFormProps {
    startup?: Startup | null
    onSuccess?: () => void
    isAdminEdit?: boolean
}

const SEGMENTOS = [
    'Agritech',
    'Socialtech',
    'Edtech',
    'Fintech',
    'Healthtech',
    'Retailtech',
    'Logística',
    'Energia',
    'Mobilidade',
    'Turismo',
    'Alimentação',
    'Moda',
    'Construção',
    'Manufatura',
    'Serviços',
    'Outro',
]

const ESTAGIOS = [
    { value: 'ideia', label: 'Ideação' },
    { value: 'validacao', label: 'Validação' },
    { value: 'mvp', label: 'MVP' },
    { value: 'tracao', label: 'Tração' },
    { value: 'escala', label: 'Escala' },
    { value: 'crescimento', label: 'Crescimento' },
] as const

export function StartupForm({ startup, onSuccess, isAdminEdit = false }: StartupFormProps) {
    const [loading, setLoading] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [uploadingLogo, setUploadingLogo] = useState(false)
    const [uploadingPitch, setUploadingPitch] = useState(false)
    const [logoUrl, setLogoUrl] = useState(startup?.logo_url || '')
    const [pitchDeckUrl, setPitchDeckUrl] = useState(startup?.pitch_deck_url || '')
    const [technologies, setTechnologies] = useState<string[]>(startup?.tecnologias || [])
    const [newTech, setNewTech] = useState('')
    const [latitude, setLatitude] = useState<number | undefined>(startup?.latitude || undefined)
    const [longitude, setLongitude] = useState<number | undefined>(startup?.longitude || undefined)
    const [cidade, setCidade] = useState(startup?.cidade || '')
    const [estado, setEstado] = useState(startup?.estado || '')

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<any>({
        defaultValues: {
            name: startup?.name || '',
            description: startup?.description || '',
            segmento: startup?.segmento || '',
            estagio_maturidade: startup?.estagio_maturidade || undefined,
            ano_fundacao: startup?.ano_fundacao || new Date().getFullYear(),
            website: startup?.website || '',
            linkedin: startup?.linkedin || '',
            instagram: startup?.instagram || '',
            cidade: startup?.cidade || '',
            estado: startup?.estado || '',
            cnpj: startup?.cnpj || '',
            tem_esg: startup?.tem_esg || false,
        },
    })

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploadingLogo(true)
        try {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('bucket', 'logos')

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            })

            if (!res.ok) throw new Error('Erro ao fazer upload')

            const data = await res.json()
            setLogoUrl(data.url)

            // Save logo immediately
            const saveRes = await fetch(isAdminEdit && startup?.id ? `/api/startups/${startup.id}` : '/api/profile', {
                method: isAdminEdit ? 'PUT' : 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    startup: { logo_url: data.url },
                }),
            })

            if (saveRes.ok) {
                toast.success('Logo enviado com sucesso!')
                onSuccess?.()
            } else {
                throw new Error('Erro ao salvar logo')
            }
        } catch (error) {
            toast.error('Erro ao enviar logo')
            console.error(error)
        } finally {
            setUploadingLogo(false)
        }
    }

    const handlePitchUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploadingPitch(true)
        try {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('bucket', 'pitch-decks')

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            })

            if (!res.ok) throw new Error('Erro ao fazer upload')

            const data = await res.json()
            setPitchDeckUrl(data.url)

            // Save pitch deck immediately
            const saveRes = await fetch(isAdminEdit && startup?.id ? `/api/startups/${startup.id}` : '/api/profile', {
                method: isAdminEdit ? 'PUT' : 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    startup: { pitch_deck_url: data.url },
                }),
            })

            if (saveRes.ok) {
                toast.success('Pitch deck enviado com sucesso!')
                onSuccess?.()
            } else {
                throw new Error('Erro ao salvar pitch deck')
            }
        } catch (error) {
            toast.error('Erro ao enviar pitch deck')
            console.error(error)
        } finally {
            setUploadingPitch(false)
        }
    }

    const addTechnology = () => {
        if (newTech.trim() && !technologies.includes(newTech.trim())) {
            setTechnologies([...technologies, newTech.trim()])
            setNewTech('')
        }
    }

    const removeTechnology = (tech: string) => {
        setTechnologies(technologies.filter((t) => t !== tech))
    }



    const onSubmit = async (data: any) => {
        setLoading(true)
        try {
            const startupData = {
                ...data,
                logo_url: logoUrl || null,
                pitch_deck_url: pitchDeckUrl || null,
                tecnologias: technologies,
                latitude: latitude || null,
                longitude: longitude || null,
                cidade: cidade || data.cidade,
                estado: estado || data.estado,
                cnpj: data.cnpj || null,
            }

            const res = await fetch(isAdminEdit && startup?.id ? `/api/startups/${startup.id}` : '/api/profile', {
                method: isAdminEdit ? 'PUT' : 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ startup: startupData }),
            })

            if (!res.ok) {
                throw new Error('Erro ao salvar startup')
            }

            toast.success('Startup salva com sucesso!')
            onSuccess?.()
        } catch (error) {
            toast.error('Erro ao salvar startup')
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        setDeleting(true)
        try {
            const res = await fetch(isAdminEdit && startup?.id ? `/api/startups/${startup.id}` : '/api/profile', {
                method: 'DELETE',
            })

            if (!res.ok) {
                throw new Error('Erro ao excluir startup')
            }

            toast.success('Startup excluída com sucesso!')
            if (isAdminEdit && typeof window !== 'undefined') {
                window.location.href = '/admin'
            } else {
                onSuccess?.()
            }
        } catch (error) {
            toast.error('Erro ao excluir startup')
            console.error(error)
        } finally {
            setDeleting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Logo Upload */}
            <div className="space-y-2">
                <Label>Logo da Startup</Label>
                <div className="flex items-center gap-4">
                    {logoUrl && (
                        <Image src={logoUrl} alt="Logo" width={80} height={80} className="rounded-lg object-cover" />
                    )}
                    <div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="hidden"
                            id="logo-upload"
                        />
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById('logo-upload')?.click()}
                            disabled={uploadingLogo}
                        >
                            {uploadingLogo ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <Upload className="w-4 h-4 mr-2" />
                            )}
                            {logoUrl ? 'Alterar Logo' : 'Enviar Logo'}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Nome */}
            <div className="space-y-2">
                <Label htmlFor="name">Nome da Startup *</Label>
                <Input id="name" {...register('name')} />
                {errors.name && <p className="text-sm text-destructive">{String(errors.name.message)}</p>}
            </div>

            {/* CNPJ */}
            <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ (Opcional)</Label>
                <Controller
                    name="cnpj"
                    control={control}
                    render={({ field }) => (
                        <Input
                            id="cnpj"
                            placeholder="00.000.000/0000-00"
                            maxLength={18}
                            value={field.value || ''}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '')
                                let formatted = value
                                if (value.length > 0) {
                                    formatted = value.replace(/^(\d{2})(\d)/, '$1.$2')
                                    formatted = formatted.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
                                    formatted = formatted.replace(/\.(\d{3})(\d)/, '.$1/$2')
                                    formatted = formatted.replace(/(\d{4})(\d)/, '$1-$2')
                                }
                                field.onChange(formatted)
                            }}
                        />
                    )}
                />
            </div>

            {/* Descrição */}
            <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea id="description" {...register('description')} rows={4} />
                {errors.description && <p className="text-sm text-destructive">{String(errors.description.message)}</p>}
            </div>

            {/* Segmento */}
            <div className="space-y-2">
                <Label htmlFor="segmento">Segmento</Label>
                <Controller
                    name="segmento"
                    control={control}
                    render={({ field }) => (
                        <Select value={field.value || ''} onValueChange={field.onChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione um segmento" />
                            </SelectTrigger>
                            <SelectContent>
                                {SEGMENTOS.map((seg) => (
                                    <SelectItem key={seg} value={seg}>
                                        {seg}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
            </div>

            {/* Estágio de Maturidade */}
            <div className="space-y-2">
                <Label htmlFor="estagio_maturidade">Estágio de Maturidade</Label>
                <Controller
                    name="estagio_maturidade"
                    control={control}
                    render={({ field }) => (
                        <Select value={field.value || ''} onValueChange={field.onChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione um estágio" />
                            </SelectTrigger>
                            <SelectContent>
                                {ESTAGIOS.map((est) => (
                                    <SelectItem key={est.value} value={est.value}>
                                        {est.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
            </div>

            {/* Modelo de Monetização */}
            <div className="space-y-2">
                <Label htmlFor="modelo_monetizacao">Modelo de Monetização</Label>
                <Textarea id="modelo_monetizacao" {...register('modelo_monetizacao')} rows={3} />
            </div>

            {/* Problema Abordado */}
            <div className="space-y-2">
                <Label htmlFor="problema_abordado">Problema Abordado</Label>
                <Textarea id="problema_abordado" {...register('problema_abordado')} rows={3} />
            </div>

            {/* Solução Oferecida */}
            <div className="space-y-2">
                <Label htmlFor="solucao_oferecida">Solução Oferecida</Label>
                <Textarea id="solucao_oferecida" {...register('solucao_oferecida')} rows={3} />
            </div>

            {/* Público Atende */}
            <div className="space-y-2">
                <Label htmlFor="publico_atende">Público que Atende</Label>
                <Textarea id="publico_atende" {...register('publico_atende')} rows={2} />
            </div>

            {/* Programas Prévios */}
            <div className="space-y-2">
                <Label htmlFor="programas_previos">Programas de Aceleração/Incubação</Label>
                <Textarea
                    id="programas_previos"
                    {...register('programas_previos')}
                    placeholder="Ex: Startup Brasil, Inovativa Brasil..."
                    rows={2}
                />
            </div>

            {/* Tecnologias */}
            <div className="space-y-2">
                <Label>Tecnologias Utilizadas</Label>
                <div className="flex gap-2">
                    <Input
                        value={newTech}
                        onChange={(e) => setNewTech(e.target.value)}
                        placeholder="Ex: React, Python, AWS..."
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                    />
                    <Button type="button" onClick={addTechnology} variant="outline">
                        Adicionar
                    </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                    {technologies.map((tech) => (
                        <div key={tech} className="bg-secondary px-3 py-1 rounded-full flex items-center gap-2">
                            <span className="text-sm">{tech}</span>
                            <button type="button" onClick={() => removeTechnology(tech)}>
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>



            {/* Pitch Deck */}
            <div className="space-y-2">
                <Label>Pitch Deck (PDF)</Label>
                <div className="flex items-center gap-4">
                    {pitchDeckUrl && startup?.owner_id && (
                        <a
                            href={`/api/pitch-deck/${startup.owner_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline"
                        >
                            Ver pitch deck atual
                        </a>
                    )}
                    <div>
                        <input
                            type="file"
                            accept="application/pdf"
                            onChange={handlePitchUpload}
                            className="hidden"
                            id="pitch-upload"
                        />
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById('pitch-upload')?.click()}
                            disabled={uploadingPitch}
                        >
                            {uploadingPitch ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <Upload className="w-4 h-4 mr-2" />
                            )}
                            {pitchDeckUrl ? 'Alterar Pitch Deck' : 'Enviar Pitch Deck'}
                        </Button>
                    </div>
                </div>
            </div>

            {/* ESG */}
            <div className="flex items-center space-x-2">
                <Controller
                    name="is_esg"
                    control={control}
                    render={({ field }) => (
                        <Checkbox id="is_esg" checked={field.value} onCheckedChange={field.onChange} />
                    )}
                />
                <Label htmlFor="is_esg" className="cursor-pointer">
                    Startup com foco em ESG (Ambiental, Social e Governança)
                </Label>
            </div>

            {/* Ano de Fundação */}
            <div className="space-y-2">
                <Label htmlFor="ano_fundacao">Ano de Fundação *</Label>
                <Input
                    id="ano_fundacao"
                    type="number"
                    min="1900"
                    max={new Date().getFullYear()}
                    {...register('ano_fundacao', { valueAsNumber: true })}
                />
            </div>

            {/* Website */}
            <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input id="website" type="url" placeholder="https://..." {...register('website')} />
            </div>

            {/* LinkedIn */}
            <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input id="linkedin" type="url" placeholder="https://linkedin.com/..." {...register('linkedin')} />
            </div>

            {/* Instagram */}
            <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input id="instagram" type="url" placeholder="https://instagram.com/..." {...register('instagram')} />
            </div>

            {/* Cidade e Estado */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="cidade">Cidade *</Label>
                    <Input
                        id="cidade"
                        {...register('cidade')}
                        value={cidade}
                        onChange={(e) => setCidade(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="estado">Estado (UF) *</Label>
                    <Input
                        id="estado"
                        {...register('estado')}
                        value={estado}
                        onChange={(e) => setEstado(e.target.value.toUpperCase())}
                        maxLength={2}
                        placeholder="CE"
                    />
                </div>
            </div>

            {/* Localização */}
            <LocationPicker
                initialLat={latitude}
                initialLng={longitude}
                cidade={cidade}
                estado={estado}
                onLocationSelect={(lat, lng) => {
                    setLatitude(lat)
                    setLongitude(lng)
                }}
            />

            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t">
                <Button type="submit" disabled={loading || deleting} className="flex-1">
                    {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Salvar Startup
                </Button>

                {startup && (
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" type="button" disabled={loading || deleting}>
                                {deleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Excluir Startup
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Esta ação não pode ser desfeita. Isso excluirá permanentemente o cadastro da startup,
                                    incluindo logo, pitch deck e todos os membros da equipe.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                    Sim, excluir startup
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
            </div>
        </form>
    )
}
