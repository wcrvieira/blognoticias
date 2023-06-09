'use client'

import { useEffect } from "react"
import { useContext } from "react"
import { createContext } from "react"
import { useState } from "react"
import { Dropdown, Table } from "react-bootstrap"
import { MessageCallbackContext } from "../layout"
import NoticiaNovo from "./novo"

export const metadata = {
    title: 'Notícias'
}

export const AtualizarNoticiaContext = createContext(null);

export default function Cliente(props) {

    const [grid, setGrid] = useState(null);
    const [atualizarGrid, setAtualizarGrid] = useState(null);
    const [operacao, setOperacao] = useState({ id: null, action: null });
    const messageCallback = useContext(MessageCallbackContext);

    let modal = null;

    if (operacao.action === "update") {
        modal = <NoticiaAtualizacao id={operacao.id} />
    }
    else if (operacao.action === "delete") {
        modal = <NoticiaRemover id={operacao.id} />
    }

    const fecharModals = () => {
        setOperacao({ id: null, action: null });
    }

    const pesquisar = () => {
        props.serverRequest({ method: 'get' }).then((result) => {
            if (result.success) {
                let finalGrid = result.data.map((p) =>
                    <tr key={p.id}>
                        <td>{p.data}</td>
                        <td>{p.titulo}</td>
                    </tr>
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
                <NoticiaNovo />
                {modal}
            </AtualizarNoticiaContext.Provider>

            <p/>
            <h5>Lista de notícias publicadas.</h5>

            <Table striped hover>
                <thead>
                    <tr>
                        <th>Data notícia</th>
                        <th>Título</th>                      
                    </tr>
                </thead>
                <tbody>
                    {grid}
                </tbody>
            </Table>
        </>
    )
}