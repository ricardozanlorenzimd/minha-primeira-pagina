// =====================================================================
// projetos.js — os dados da página de projetos
// =====================================================================

// ---------------------------------------------------------------------
// TIPO: o "molde" de um projeto
// ---------------------------------------------------------------------
// Este comentário especial (chamado JSDoc) descreve quais informações
// todo projeto precisa ter. O navegador ignora comentários, mas editores
// como o VS Code leem este molde e avisam se algum projeto estiver
// faltando um campo ou com um valor que não existe.

/**
 * Em que pé está o projeto. Só estes três valores são aceitos.
 * @typedef {"concluido" | "andamento" | "planejado"} Status
 */

/**
 * Um projeto da página "Meus projetos".
 * @typedef {Object} Projeto
 * @property {string}   nome          Nome que aparece em negrito.
 * @property {string}   descricao     Uma frase curta explicando o projeto.
 * @property {Status}   status        Em que pé está o projeto.
 * @property {string[]} tecnologias   Com o que ele é (ou será) feito,
 *                                    ex.: ["HTML", "CSS"]. Pode ser uma
 *                                    lista vazia, [], se ainda não sei.
 * @property {string}   [link]        Opcional: endereço da página do
 *                                    projeto, se ela já existir.
 */

// ---------------------------------------------------------------------
// DADOS: a lista dos meus projetos
// ---------------------------------------------------------------------
// Cada projeto segue o molde acima. Para adicionar um projeto novo,
// copie um bloco { ... }, cole no fim da lista e troque os valores.
// A ordem aqui é a ordem em que eles aparecem na página.

/** @type {Projeto[]} */
const PROJETOS = [
  {
    nome: "Meus 5 melhores prompts",
    descricao: "Os pedidos ao Claude Code que mais deram certo, com o que cada um ensina.",
    status: "concluido",
    tecnologias: ["HTML", "CSS", "JavaScript"],
    link: "prompt.html",
  },
  {
    nome: "Site pessoal completo",
    descricao: "Portfólio e blog para mostrar o que estou criando.",
    status: "andamento",
    tecnologias: ["HTML", "CSS", "JavaScript", "Vercel"],
  },
  {
    nome: "Organizador de tarefas",
    descricao: "Um aplicativo simples para as tarefas do dia a dia.",
    status: "planejado",
    tecnologias: ["HTML", "CSS", "JavaScript"],
  },
  {
    nome: "Automação para o trabalho",
    descricao: "Uma ferramenta que faça sozinha uma tarefa repetitiva.",
    status: "planejado",
    tecnologias: ["Python"],
  },
];
