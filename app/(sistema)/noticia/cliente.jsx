'use client'

import { useEffect } from "react"
import { useContext } from "react"
import { createContext } from "react"
import { useState } from "react"
import { Dropdown, Table } from "react-bootstrap"
import { MessageCallbackContext } from "../layout"
import NoticiaAtualizacao from "./atualizacao"
import NoticiaNovo from "./novo"
import NoticiaRemover from "./remocao"

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
        props.serverRequest({method: 'get'}).then((result) => {
            if (result.success) {
                let finalGrid = result.data.map((p) =>
                    <tr key={p.id}>
                        <td>{p.idautor}</td>
                        <td>{p.titulo}</td>
                        <td>{p.texto}</td>
                        <td>{p.data}</td>
                        <td>{p.senha}</td>
                        <td>{p.status}</td>
                        <td>
                            <Dropdown>
                                <Dropdown.Toggle>Opção</Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => setOperacao({ id: p.id, action: "update" })}>Atualizar</Dropdown.Item>
                                    <Dropdown.Item onClick={() => setOperacao({ id: p.id, action: "delete" })}>Remover</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </td>
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

            <Table striped hover>
                <thead>
                    <tr>
                        <th>Título</th>
                        <th>Texto</th>
                        <th>Data de postagem</th>
                        <th>Senha</th>
                        <th>Status</th>
                        <th>Opções</th>
                    </tr>
                </thead>
                <tbody>
                    {grid}
                </tbody>
            </Table>
        </>
    )
}