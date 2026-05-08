import React, { useState } from 'react';

const PaymentFlow = ({ onFinalize, loading, onClose }) => {
    const [step, setStep] = useState('dados'); // dados -> metodo -> pix/cartao -> sucesso
    const [method, setMethod] = useState('');
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        cartaoNum: '',
        cartaoNome: '',
        validade: '',
        cvv: ''
    });

    // --- 1. BLOQUEIOS DE DIGITAÇÃO (IMPEDE O ERRO ANTES DE ACONTECER) ---
    const apenasLetras = (val) => val.replace(/[^a-zA-ZÀ-ÿ\s]/g, ''); // Bloqueia números e símbolos
    const apenasNumeros = (val) => val.replace(/\D/g, ''); // Bloqueia letras

    const normalizar = (t) => t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toUpperCase();

    // --- 2. VALIDAÇÃO FINAL (A TRAVA MESTRA) ---
    const handleFinish = async () => {
        // Validação de E-mail
        if (!formData.email.includes('@')) {
            alert("🚨 Digite um e-mail válido.");
            return;
        }

        if (method === 'cartao') {
            const nCliente = normalizar(formData.nome);
            const nCartao = normalizar(formData.cartaoNome);

            // TRAVA DE NOME DIFERENTE
            if (nCliente !== nCartao) {
                alert("🚨 ERRO DE SEGURANÇA:\nO nome no cartão deve ser IDENTICO ao nome do cadastro.");
                console.error("Divergência:", { cartao: nCartao });
                return; // Mata a execução aqui
            }

            // TRAVA DE DATA DE VALIDAD
            if (formData.validade.length < 5) {
                alert("🚨 Data de validade incompleta.");
                return;
            }

            const [mes, ano] = formData.validade.split('/').map(Number);
            const agora = new Date();
            const anoAtual = agora.getFullYear() % 100; // 26
            const mesAtual = agora.getMonth() + 1;

            if (ano < anoAtual || (ano === anoAtual && mes < mesAtual)) {
                alert("🚨 CARTÃO VENCIDO: Não podemos processar.");
                return; // Mata a execução aqui
            }

            // TRAVA DE NÚMERO
            if (formData.cartaoNum.length < 16) {
                alert("🚨 Número do cartão incompleto.");
                return;
            }
        }

        // SE CHEGOU AQUI, PASSOU NAS TRAVAS
        const dadosCompra = {
            id_pedido: `PED-${Math.floor(1000 + Math.random() * 9000)}`,
            nome: formData.nome,
            email: formData.email,
            pagamento: method.toUpperCase(),
            status: 'CONCLUÍDO'
        };

        try {
            await onFinalize(dadosCompra);
            setStep('sucesso');
        } catch (error) {
            alert("Erro ao salvar no banco.");
        }
    };

    return (
        <div className="text-zinc-100">
            {/* ETAPA 1: DADOS PESSOAIS */}
            {step === 'dados' && (
                <div className="space-y-4">
                    <h3 className="font-bold border-b border-zinc-800 pb-2">MEUS DADOS</h3>
                    <input
                        type="text" placeholder="NOME COMPLETO (SÓ LETRAS)"
                        className="w-full bg-zinc-800 p-3 rounded-xl outline-none focus:ring-2 ring-yellow-500"
                        value={formData.nome}
                        onChange={(e) => setFormData({ ...formData, nome: apenasLetras(e.target.value) })}
                    />
                    <input
                        type="email" placeholder="E-MAIL"
                        className="w-full bg-zinc-800 p-3 rounded-xl outline-none focus:ring-2 ring-yellow-500"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value.trim() })}
                    />
                    <button
                        disabled={!formData.nome || !formData.email}
                        onClick={() => setStep('metodo')}
                        className="w-full bg-yellow-500 text-black font-bold py-3 rounded-xl disabled:opacity-30"
                    >
                        PRÓXIMO
                    </button>
                </div>
            )}

            {/* ETAPA 2: ESCOLHER MÉTODO */}
            {step === 'metodo' && (
                <div className="space-y-4">
                    <h3 className="font-bold border-b border-zinc-800 pb-2">FORMA DE PAGAMENTO</h3>
                    <div className="flex gap-2">
                        <button onClick={() => { setMethod('pix'); setStep('pix'); }} className="flex-1 bg-zinc-800 p-4 rounded-xl border border-zinc-700 hover:border-emerald-500">PIX</button>
                        <button onClick={() => { setMethod('cartao'); setStep('cartao'); }} className="flex-1 bg-zinc-800 p-4 rounded-xl border border-zinc-700 hover:border-blue-500">CARTÃO</button>
                    </div>
                    <button onClick={() => setStep('dados')} className="w-full text-zinc-500 text-sm">Voltar</button>
                </div>
            )}

            {/* ETAPA 3: DADOS DO CARTÃO */}
            {step === 'cartao' && (
                <div className="space-y-3">
                    <h3 className="font-bold border-b border-zinc-800 pb-2">DADOS DO CARTÃO</h3>
                    <input
                        type="text" placeholder="NÚMERO DO CARTÃO (SÓ NÚMEROS)" maxLength="16"
                        className="w-full bg-zinc-800 p-3 rounded-xl outline-none"
                        value={formData.cartaoNum}
                        onChange={(e) => setFormData({ ...formData, cartaoNum: apenasNumeros(e.target.value) })}
                    />
                    <input
                        type="text" placeholder="NOME IGUAL AO DO CADASTRO"
                        className="w-full bg-zinc-800 p-3 rounded-xl outline-none uppercase"
                        value={formData.cartaoNome}
                        onChange={(e) => setFormData({ ...formData, cartaoNome: apenasLetras(e.target.value) })}
                    />
                    <div className="flex gap-2">
                        <input
                            type="text" placeholder="MM/AA" maxLength="5"
                            className="w-1/2 bg-zinc-800 p-3 rounded-xl outline-none"
                            value={formData.validade}
                            onChange={(e) => {
                                let v = apenasNumeros(e.target.value);
                                if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2, 4);
                                setFormData({ ...formData, validade: v });
                            }}
                        />
                        <input
                            type="text" placeholder="CVV" maxLength="3"
                            className="w-1/2 bg-zinc-800 p-3 rounded-xl outline-none"
                            value={formData.cvv}
                            onChange={(e) => setFormData({ ...formData, cvv: apenasNumeros(e.target.value) })}
                        />
                    </div>
                    <button onClick={handleFinish} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl">
                        FINALIZAR PAGAMENTO
                    </button>
                    <button onClick={() => setStep('metodo')} className="w-full text-zinc-500 text-sm">Voltar</button>
                </div>
            )}

            {/* ETAPA PIX */}
            {step === 'pix' && (
                <div className="text-center space-y-4">
                    <div className="bg-white p-4 rounded-xl inline-block">
                        <img src="/pix.jpg" className="w-40 h-40" alt="Pix" />
                    </div>
                    <button onClick={handleFinish} className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl">JÁ PAGUEI</button>
                </div>
            )}

            {/* SUCESSO */}
            {step === 'sucesso' && (
                <div className="text-center py-10">
                    <h2 className="text-2xl font-bold text-emerald-500">RESERVA CONCLUÍDA!</h2>
                    <p className="text-zinc-400 mt-2">Aguarde o redirecionamento...</p>
                </div>
            )}
        </div>
    );
};

export default PaymentFlow;