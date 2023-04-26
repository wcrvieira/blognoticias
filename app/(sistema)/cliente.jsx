'use client'

import { createContext, useContext, useEffect, useState } from "react";
import { MessageCallbackContext } from "./layout";
import { Table } from "react-bootstrap";

export const metadata = {
    title: 'Lista de Notícias'
}

export const AtualizarNoticiaContext = createContext(null);

export default function Cliente(props) {

    const [grid, setGrid] = useState(null);
    const [atualizarGrid, setAtualizarGrid] = useState(null);
    const [operacao, setOperacao] = useState({ id: null, action: null });
    const messageCallback = useContext(MessageCallbackContext);

    let modal = null;

    const fecharModals = () => {
        setOperacao({ id: null, action: null });
    }

    const pesquisar = () => {
        props.serverRequest({ method: 'get' }).then((result) => {
            if (result.success) {
                let finalGrid = result.data.map((p) =>

                    <div class="card">
                        <h5 class="card-header">{p.data}</h5>
                        <div class="card-body">
                            <h5 class="card-title">Título : {p.titulo}</h5>
                            <h7 class="card-title">::. {p.subtitulo} ..::</h7>
                            <p class="card-text">{p.texto}</p>
                            <a href="#" class="btn btn-primary">Continuar lendo...</a>
                        </div>
                    </div>
                );
                setGrid(finalGrid);
            }
            else
                messageCallback({ tipo: 'erro', texto: result.data });
        });
    }

    useEffect(() => {
        if (atualizarGrid === null)
            setAtualizarGrid(true);
        if (atualizarGrid) {
            setAtualizarGrid(false);
            pesquisar();
        }
    }, [atualizarGrid])

    return (
        <>
            <AtualizarNoticiaContext.Provider value={{ atualizar: setAtualizarGrid, fechar: fecharModals, serverRequest: props.serverRequest }}>
            </AtualizarNoticiaContext.Provider>

            {grid}
        </>
    )


}