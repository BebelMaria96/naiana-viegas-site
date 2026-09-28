# Naiana Viegas — site

Landing page da psicóloga clínica e educacional Naiana Viegas (CRP 22/03405).

Site estático (HTML/CSS/JS puro, sem build), publicado no Netlify e servido em
[psinaianaviegas.com.br](https://psinaianaviegas.com.br).

## Estrutura
- `index.html` — página principal (hero, serviços, abordagem, como funciona,
  sobre, experiências/depoimentos, FAQ, contato).
- `depoimento.html` — página de confirmação exibida após a aprovação/recusa
  de um depoimento (redirecionada por uma Edge Function no Supabase).
- `styles.css` — todo o visual (paleta creme + azul-sereno + terracota,
  fontes Fraunces + Nunito Sans).
- `script.js` — interações do site: menu mobile, FAQ, animações de entrada,
  modal "Deixar depoimento" e a leitura automática dos depoimentos aprovados.
- `MODELO-DEPOIMENTO.txt` — modelo de referência para publicação manual de
  depoimentos (fluxo legado; hoje a aprovação é automática).

## Depoimentos
A seção "Experiências" lê depoimentos aprovados de um banco de dados
(Supabase) usando apenas a chave pública (`publishable key`), protegida por
Row Level Security: o site só consegue ler os depoimentos já aprovados,
nunca os pendentes. Novos depoimentos são enviados a uma Edge Function que
avisa a psicóloga por e-mail com links de aprovar/recusar (a lógica dessa
automação — banco de dados e funções — não está neste repositório).

## Nota ética
Por orientação do Código de Ética Profissional do Psicólogo (Resolução CFP
nº 011/2019), o site não publica depoimentos de pacientes sobre atendimento
clínico sem critério; a seção prioriza experiências sobre palestras e
serviços educacionais, sempre com autorização explícita de quem escreve.

## Deploy
Sem processo de build. Basta publicar a pasta como está (ex.: arrastar em
Netlify Drop, ou conectar este repositório a um serviço de hospedagem
estática).
