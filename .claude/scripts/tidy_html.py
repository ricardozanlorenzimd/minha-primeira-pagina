"""Arruma os espaços de um arquivo .html depois que o Claude o edita.

Chamado pelo hook PostToolUse (veja .claude/settings.json). Recebe no
stdin o JSON do Claude Code e lê o caminho do arquivo em
tool_input.file_path. Também funciona direto:  python3 -I tidy_html.py arquivo.html

O que ele faz (só espaços, nunca o conteúdo):
  - tira espaços e tabs no fim das linhas
  - troca tabs no começo das linhas por 2 espaços
  - junta várias linhas em branco seguidas numa só
  - tira linhas em branco do começo e deixa exatamente uma quebra no fim
Dentro de <pre> e <textarea> nada é mexido, porque lá os espaços aparecem
na tela. Só regrava o arquivo se algo mudou.
"""

import json
import os
import re
import sys

ABRE_INTOCAVEL = re.compile(r"<(pre|textarea)\b", re.IGNORECASE)
FECHA_INTOCAVEL = re.compile(r"</(pre|textarea)\s*>", re.IGNORECASE)


def arrumar(texto):
    linhas = texto.split("\n")
    resultado = []
    dentro = False  # dentro de <pre> ou <textarea>?
    for linha in linhas:
        comeca_dentro = dentro
        # atualiza o estado conforme as tags desta linha (pode abrir e fechar)
        for m in re.finditer(r"</?(pre|textarea)\b[^>]*>", linha, re.IGNORECASE):
            dentro = not m.group(0).startswith("</")
        if comeca_dentro:
            # linha que começa dentro do bloco: preserva exatamente
            resultado.append(linha)
            continue
        recuo = re.match(r"[ \t]*", linha).group(0)
        linha = recuo.replace("\t", "  ") + linha[len(recuo):]
        if not dentro:
            linha = linha.rstrip(" \t")
        if linha == "" and resultado and resultado[-1] == "":
            continue  # pula a segunda linha em branco seguida
        resultado.append(linha)
    while resultado and resultado[0] == "":
        resultado.pop(0)
    while resultado and resultado[-1] == "":
        resultado.pop()
    return "\n".join(resultado) + "\n"


def caminho_do_arquivo():
    if len(sys.argv) > 1:
        return sys.argv[1]
    try:
        dados = json.load(sys.stdin)
    except ValueError:
        return None
    entrada = dados.get("tool_input") or {}
    resposta = dados.get("tool_response") or {}
    return entrada.get("file_path") or resposta.get("filePath")


def main():
    caminho = caminho_do_arquivo()
    if not caminho or not caminho.lower().endswith(".html") or not os.path.isfile(caminho):
        return 0  # não é HTML: não faz nada
    with open(caminho, encoding="utf-8", newline="") as f:
        original = f.read()
    if "\r\n" in original:
        return 0  # quebras de linha do Windows: melhor não mexer
    novo = arrumar(original)
    if novo != original:
        with open(caminho, "w", encoding="utf-8", newline="") as f:
            f.write(novo)
    return 0


if __name__ == "__main__":
    sys.exit(main())
