'use client'

import { useEffect } from "react"
import { useContext } from "react"
import { createContext } from "react"
import { useState } from "react"
import { Dropdown, Table } from "react-bootstrap"
import { MessageCallbackContext } from "../layout"
import AutorAtualizacao from "./atualizacao"
import AutorNovo from "./novo"
import AutorRemover from "./remocao"

export const metadata = {
    title: 'Autores'
}

export const AtualizarAutorContext = createContext(null);

export default function Cliente(props) {

    const [grid, setGrid] = useState(null);
    const [atualizarGrid, setAtualizarGrid] = useState(null);
    const [operacao, setOperacao] = useState({ id: null, action: null });
    const messageCallback = useContext(MessageCallbackContext);

    let modal = null;

    if (operacao.action === "update") {
        modal = <AutorAtualizacao id={operacao.id} />
    }
    else if (operacao.action === "delete") {
        modal = <AutorRemover id={operacao.id} />
    }

    const fecharModals = () => {
        setOperacao({ id: null, action: null });
    }

    const pesquisar = () => {
        props.serverRequest({method: 'get'}).then((result) => {
            if (result.success) {
                let finalGrid = result.data.map((p) =>
                    <tr key={p.id}>
                        <td>{p.nome}</td>
                        <td>{p.apelido}</td>
                        <td>{p.email}</td>                        
                        <td>{p.nascimento}</td>
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
            <AtualizarAutorContext.Provider value={{ atualizar: setAtualizarGrid, fechar: fecharModals, serverRequest: props.serverRequest }}>
                <AutorNovo />
                {modal}
            </AtualizarAutorContext.Provider>

            <Table striped hover>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Apelido</th>
                        <th>E-mail</th>
                        <th>Data de nascimento</th>
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