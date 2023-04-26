'use client'

import { useEffect } from "react"
import { useContext } from "react"
import { createContext } from "react"
import { useState } from "react"
import { Button, Dropdown, Table } from "react-bootstrap"
import { MessageCallbackContext } from "../layout"
import LeitorRemover from "./remocao"

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

    if (operacao.action === "update") {
        modal = <LeitorAtualizacao id={operacao.id} />
    }
    else if (operacao.action === "delete") {
        modal = <LeitorRemover id={operacao.id} />
    }

    const fecharModals = () => {
        setOperacao({ id: null, action: null });
    }

    const pesquisar = () => {
        props.serverRequest({ method: 'get' }).then((result) => {
            if (result.success) {
                let finalGrid = result.data.map((p) =>
                    <tr key={p.id}>
                        <td>{p.nome}</td>
                        <td>{p.email}</td>
                        <td>{p.nascimento}</td>
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
            <AtualizarLeitorContext.Provider value={{ atualizar: setAtualizarGrid, fechar: fecharModals, serverRequest: props.serverRequest }}>
                {modal}
            </AtualizarLeitorContext.Provider>

            <Table striped hover>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>E-mail</th>
                        <th>Data de nascimento</th>
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