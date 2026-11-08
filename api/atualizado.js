// =====================================================================
// api/atualizado.js — função que roda no servidor da Vercel
// =====================================================================
// O navegador pede /api/atualizado e esta função responde com a data do
// último commit do site no GitHub.
//
// Ela usa a variável de ambiente GITHUB_TOKEN, que é definida nas
// configurações da Vercel (Settings → Environment Variables) e NUNCA no
// código. O token fica só no servidor: esta função não devolve o token
// para o navegador, só a data e a mensagem do commit.
//
// Sem token a função ainda funciona, mas o GitHub limita os pedidos
// anônimos a 60 por hora para cada endereço de internet — e os servidores
// da Vercel são compartilhados, então esse limite acaba rápido.

const REPOSITORIO = "ricardozanlorenzimd/minha-primeira-pagina";

module.exports = async function (req, res) {
  const token = process.env.GITHUB_TOKEN; // lido do host, não do git

  const cabecalhos = {
    Accept: "application/vnd.github+json",
    "User-Agent": "minha-primeira-pagina",
  };
  if (token) {
    cabecalhos.Authorization = "Bearer " + token;
  }

  try {
    const resposta = await fetch(
      "https://api.github.com/repos/" + REPOSITORIO + "/commits?per_page=1",
      { headers: cabecalhos }
    );
    if (!resposta.ok) {
      throw new Error("GitHub respondeu " + resposta.status);
    }
    const commits = await resposta.json();
    const ultimo = commits[0].commit;

    // Guarda a resposta por 5 minutos para não pedir ao GitHub toda hora
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
    res.status(200).json({
      data: ultimo.committer.date,
      mensagem: ultimo.message.split("\n")[0], // só a primeira linha
      usouToken: Boolean(token), // diz SE tem token, nunca QUAL é
    });
  } catch (erro) {
    res.status(502).json({ erro: "Não consegui falar com o GitHub agora." });
  }
};
