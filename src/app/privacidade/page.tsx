import Link from "next/link";

export default function PrivacidadePage() {
    return (
        <div className="min-h-screen max-w-3xl mx-auto px-4 md:px-8 py-20">
            <Link href="/" className="text-sm font-bold text-periwinkle hover:opacity-80 transition-opacity mb-8 inline-block">
                ← Voltar ao início
            </Link>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-off-white mb-8">
                Política de Privacidade
            </h1>
            <div className="prose prose-invert max-w-none space-y-6 text-slate-light leading-relaxed">
                <p className="text-lg">
                    A tua privacidade é importante para nós. Esta política descreve como a SecondAvenue 
                    recolhe, utiliza e protege os teus dados pessoais.
                </p>

                <h2 className="text-xl font-bold text-off-white mt-8">1. Dados Recolhidos</h2>
                <p>
                    Recolhemos apenas os dados estritamente necessários para o funcionamento da plataforma:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Nome e endereço de email (registo e comunicação)</li>
                    <li>Morada de envio (quando fazes uma compra)</li>
                    <li>Número de telefone (contacto do vendedor)</li>
                    <li>Imagens e informações dos produtos que publicas</li>
                </ul>

                <h2 className="text-xl font-bold text-off-white mt-8">2. Como Utilizamos os Teus Dados</h2>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Processar transações e pedidos</li>
                    <li>Enviar recibos de compra por email</li>
                    <li>Melhorar a experiência na plataforma</li>
                    <li>Garantir a segurança dos utilizadores</li>
                </ul>

                <h2 className="text-xl font-bold text-off-white mt-8">3. Partilha de Dados</h2>
                <p>
                    Não partilhamos os teus dados com terceiros, exceto quando necessário para 
                    processar uma transação (por exemplo, fornecer a morada ao vendedor).
                </p>

                <h2 className="text-xl font-bold text-off-white mt-8">4. Segurança</h2>
                <p>
                    Implementamos medidas de segurança para proteger os teus dados contra acesso 
                    não autorizado, alteração ou destruição.
                </p>

                <h2 className="text-xl font-bold text-off-white mt-8">5. Os Teus Direitos</h2>
                <p>
                    Tens o direito de aceder, corrigir ou eliminar os teus dados pessoais. 
                    Para tal, contacta-nos através do email info@secondavenue.pt.
                </p>

                <p className="text-sm text-slate-lighter mt-12">
                    Última atualização: julho de 2026. Este site foi desenvolvido como projeto PAP 
                    (Prova de Aptidão Profissional). As políticas aqui descritas são simuladas para 
                    fins demonstrativos.
                </p>
            </div>
        </div>
    );
}
