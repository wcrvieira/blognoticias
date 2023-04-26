'use client'

import { Button, Modal } from "react-bootstrap";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { MessageCallbackContext } from "../layout";
import BusyButton from "@/app/componentes/busybutton";
import { AtualizarLeitorContext } from "./cliente";

export const schema = yup.object({
    nome: yup.string()
        .min(1, 'O nome deve conter, no mínimo, 10 caracteres')
        .max(100, 'O nome deve conter, no máximo, 100 caracteres')
        .required('O nome é obrigatório'),
    email: yup.string()
        .min(1, 'O e-mail deve ser válido, conforme exemplo: usuario@dominio.com')
        .max(100, 'O e-mail deve ser único para acesso do leitor')
        .required('O e-mail é obrigatório'),
    nascimento: yup.string()
        .min(1, 'A data de nascimento deve estar no formato dd/mm/aaaa')
        .max(100, 'A data deve ser válida')
        .required('A data de nascimento é obrigatória'),
    senha: yup.string()
        .min(8, 'A senha deve conter, no mínimo, 8 caracteres')
        .max(100, 'A senha deve conter letras, números e símbolos')
        .required('A senha é obrigatória'),
}).required();

export default function LeitorNovo() {
    const [modalShow, setModalShow] = useState(false);
    const [busy, setBusy] = useState(false);

    const messageCallback = useContext(MessageCallbackContext);
    const atualizarCallback = useContext(AtualizarLeitorContext);

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    const onSubmit = (data) => {
        setBusy(true);
        atualizarCallback.serverRequest({method: 'post', args: data}).then((result) => {
            setBusy(false);
            if (result.success) {
                handleClose();
                atualizarCallback.atualizar(true);
                messageCallback({ tipo: 'sucesso', texto: result.data });
            }
            else
                messageCallback({tipo: 'erro', texto: result.data});
        });
    }

    const handleClose = () => {
        setModalShow(false);
    }

    useEffect(() => {
        if (modalShow === false) {
            reset({ nome: '', email: '', nascimento: '', senha: ''})
        }
    }, [modalShow]);

    return (
        <>
            <Button onClick={() => setModalShow(true)}>Novo</Button>

            <Modal size="md" centered show={modalShow}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Header>
                        <Modal.Title>Novo Leitor</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <label className="row mx-2">
                        Nome
                        <input type="text" className="form-control"  {...register("nome")} />
                        <span className='text-danger'>{errors.nome?.message}</span>
                    </label>
                    
                    <label className="row mx-2">
                        E-mail
                        <input type="email" className="form-control"  {...register("email")} />
                        <span className='text-danger'>{errors.email?.message}</span>
                    </label>

                    <label className="row mx-2">
                        Data de nascimento
                        <input type="date" className="form-control"  {...register("nascimento")} />
                        <span className='text-danger'>{errors.nascimento?.message}</span>
                    </label>

                    <label className="row mx-2">
                       Senha
                        <input type="password" className="form-control"  {...register("senha")} />
                        <span className='text-danger'>{errors.senha?.message}</span>
                    </label>
                    </Modal.Body>
                    <Modal.Footer>
                        <BusyButton variant="success" type="submit" label="Salvar" busy={busy}/>
                        <Button variant="secondary" onClick={handleClose}>Fechar</Button>
                    </Modal.Footer>
                </form>
            </Modal>
        </>
    )
}