'use client'

import { useContext } from "react"
import { createContext } from "react"
import { useState } from "react"
import { Button } from "react-bootstrap"
import { MessageCallbackContext } from "../layout"
import LeitorNovo from "./novo"

export const metadata = {
    title: 'Leitores'
}

export const AtualizarLeitorContext = createContext(null);

export default function Cliente(props) {

    const [grid, setGrid] = useState(null);
    const [atualizarGrid, setAtualizarGrid] = useState(null);
    const [operacao, setOperacao] = useState({ id: null, action: null });
    const messageCallback = useContext(MessageCallbackContext);

    let modal = null;

    const fecharModals = () => {
        setOperacao({ id: null, action: null });
    }

    return (
        <>
            <AtualizarLeitorContext.Provider value={{ atualizar: setAtualizarGrid, fechar: fecharModals, serverRequest: props.serverRequest }}>
                <LeitorNovo />
                <a href="/listaleitor">
                    <Button> Gerenciar Leitores </Button>
                </a>
            </AtualizarLeitorContext.Provider>
            <p/> 
            <h3>Termos e condições de uso do blog</h3>
            <h5>Seja bem-vindo ao nosso blog. Leia com atenção todos os termos abaixo.</h5>
            <br/>            
            <h8>A permanência no website implica-se automaticamente na leitura e aceitação tácita do presente termos de uso a seguir.</h8>
            <p/>
            <h8>Todo o conteúdo é atualizado periodicamente, porém, pode conter em algum artigo, vídeo ou imagem, alguma informação que não reflita a verdade atual, não podendo a EMPRESA ser responsabilizada de nenhuma forma ou meio por qualquer conteúdo que não esteja devidamente atualizado.</h8>
            <h8> É de responsabilidade do usuário de usar todas as informações presentes no site com senso crítico, utilizando apenas como fonte de informação, e sempre buscando especialistas da área para a solução concreta do seu conflito.</h8>

        </>
    )
}