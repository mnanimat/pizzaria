# 🍕 Pizzaria MNAnimat - Web App & Cardápio Digital Interativo

Sistema completo e moderno de cardápio digital e montagem de pedidos de pizzaria com envio direto para o **WhatsApp**.

> 💡 **Nota:** Este é um site fictício demonstrativo desenvolvido como exemplo para apresentação a clientes e empresas interessadas em criar sites e sistemas web profissionais.

---

## 🌟 Funcionalidades Principal

- **🍕 Cardápio Interativo Completo:** Pizzas salgadas, doces, bordas recheadas, acompanhamentos (batatas cheddar, pão de alho), refrigerantes (Coca-Cola, Guaraná Antarctica, Pepsi), sucos naturais da casa e molhos artesanais.
- **🛠️ Montador Customizado de Pizzas:**
  - Escolha o tamanho (Brotinho, Média, Grande, Gigante).
  - Seleção de massa (Tradicional, Fina e Crocante, Pan).
  - Opção de pizza meio a meio (2 sabores).
  - Adição de bordas recheadas (Catupiry®, Cheddar, Nutella®) e adicionais extra.
- **🏷️ Cupons de Desconto e Combos:** Sistema de cupons promocionais ativáveis com desconto automático no carrinho.
- **🛒 Carrinho em Tempo Real:** Cálculo de taxa de entrega, subtotal, cupom e resumo visual dos itens.
- **📲 Integração Direta com WhatsApp:** Gerador de mensagens totalmente formatadas com opção de edição da mensagem antes do envio para o número do proprietário (**Micael Nildo: (75) 98232-1124**).
- **🛡️ Sistema de Blindagem & Segurança Cloudflare Pages:**
  - **Limitação de Pedidos (Rate Limiter):** Intervalo mínimo obrigatório entre pedidos (45s), limite de 3 pedidos a cada 10 minutos por dispositivo e teto diário de 10 pedidos para evitar ataques de estouro e sobrecarga.
  - **Filtro Anti-Bot (Honeypot):** Campo de captura invisível para neutralizar robôs e scripts automatizados de spam.
  - **Sanitização de Dados:** Proteção contra injeção de scripts (XSS) e limite de caracteres nos campos de formulário.
  - **Headers de Segurança HTTP (`_headers` Cloudflare Pages):** Content Security Policy (CSP), X-Frame-Options, X-Content-Type-Options, Referrer-Policy e HSTS ativados.
  - **Isolamento de Falhas (Error Boundary):** Captura e isolamento de exceções em tempo de execução para evitar tela branca ou travamento do app.
- **🌙 Modo Claro / Escuro (Dark Mode):** Alternância fluida de temas.

---

## 🚀 Tecnologias Utilizadas

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Motion (Lucide Icons)
- **Bundler:** Vite
- **Estilização:** Tailwind CSS responsivo e otimizado

---

## 💻 Como Rodar o Projeto Localmente

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/usuario/pizzaria-mnanimat.git
   cd pizzaria-mnanimat
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

4. Acesse no navegador: `http://localhost:3000`

---

## 📄 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](./LICENSE) para mais detalhes.

---

**Desenvolvido por Micael Nildo** | Contato para orçamentos de sites e aplicações web via WhatsApp: **(75) 98232-1124**.
