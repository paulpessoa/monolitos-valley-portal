import { Button } from '@/components/ui/button'
import { FileQuestion } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="container mx-auto px-4 py-16">
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <FileQuestion className="w-20 h-20 text-muted-foreground mb-6" />
                <h1 className="text-4xl font-bold mb-4">Página não encontrada</h1>
                <p className="text-lg text-muted-foreground mb-8 text-center max-w-md">
                    A página que você está procurando não existe ou foi movida.
                </p>
                <Button asChild>
                    <Link href="/">Voltar para Home</Link>
                </Button>
            </div>
        </div>
    )
}
