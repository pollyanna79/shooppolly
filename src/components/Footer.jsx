import React from 'react';

const Footer = ({ onShowLocation }) => {
    return (
        <footer className="bg-zinc-950 border-t border-zinc-800 pt-16 pb-8 px-8 mt-20">
            {/* Grid centralizado */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 mb-12 text-center">

                {/* Coluna 1: Logo e Endereço (Agora com clique) */}
                <div
                    className="space-y-4 flex flex-col items-center cursor-pointer group"
                    onClick={onShowLocation}
                >
                    <h3 className="text-xl font-black tracking-tighter text-white group-hover:text-yellow-500 transition-colors">
                        CINEMARK<span className="text-yellow-500 italic">POLLY</span>
                    </h3>
                    <div className="text-zinc-400 text-sm leading-relaxed not-italic group-hover:text-zinc-200 transition-colors">
                        <p>📍 Rua das Pipocas Gourmet, 777</p>
                        <p>Bairro Hollywood - São Paulo/SP</p>
                        <span className="block text-[10px] text-yellow-500/50 mt-2 font-bold uppercase tracking-widest animate-pulse">
                            Clique para conhecer o local
                        </span>
                    </div>
                </div>

                {/* Coluna 2: Contato */}
                <div className="space-y-4 flex flex-col items-center">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-yellow-500">Atendimento</h4>
                    <div className="text-zinc-400 text-sm space-y-2">
                        <p className="flex items-center gap-2 hover:text-white transition-colors cursor-default">
           {/* Ícone do WhatsApp */}
               <svg  className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 24 24"
       >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.148-.67-1.613-.918-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.955c-.001 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg> (11) 98765-4321</p>
                        <p className="flex items-center gap-2 hover:text-white transition-colors cursor-default">
  {/* Ícone de carta (Envelope) */}
  <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round"  strokeWidth="2"  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"  />
  </svg>contato@cinemarkpolly.com</p>
                    </div>
                </div>

                {/* Coluna 3: Redes Sociais */}
<div className="space-y-4 flex flex-col items-center">
    <h4 className="text-sm font-bold uppercase tracking-widest text-yellow-500">Siga-nos</h4>
    <div className="flex gap-4 justify-center">
        {[
            { 
                name: "Instagram", 
                src: "/instagram.jpg", 
                href: "https://www.instagram.com/popo7293" 
            },
            { 
                name: "Facebook", 
                src: "/facebook.jpg", 
                href: "https://www.facebook.com/Polly-Ydhdhaj" 
            },
            { 
                name: "Twitter", 
                src: "/twitter.jpg", 
                href: "#" 
            }
        ].map((social, idx) => (
            <a
                key={idx}
                href={social.href}
                target="_blank" 
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:border-yellow-500 transition-all overflow-hidden group/social"
            >
                <img
                    src={social.src}
                    alt={social.name}
                    className="w-full h-full object-cover opacity-70 group-hover/social:opacity-100 transition-opacity"
                />
            </a>
        ))}
    </div>
</div>
            </div>

            {/* Copyright */}
            <div className="max-w-7xl mx-auto pt-8 border-t border-zinc-900 text-center">
                <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">
                    © {new Date().getFullYear()} CinemarkPolly - Todos os direitos reservados.
                </p>
            </div>
        </footer>
    );
};

export default Footer;

