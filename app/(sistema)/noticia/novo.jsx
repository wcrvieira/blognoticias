'use client'

import { Button, Modal } from "react-bootstrap";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { MessageCallbackContext } from "../layout";
import BusyButton from "@/app/componentes/busybutton";
import { AtualizarNoticiaContext } from "./cliente";

export const schema = yup.object({
    titulo: yup.string()
        .min(1, 'O título deve conter, no mínimo, 10 caracteres')
        .max(30, 'O título deve conter, no máximo, 30 caracteres')
        .required('O título é obrigatório'),
    texto: yup.string()
    .min(1, 'O texto deve conter, no mínimo, 30 caracteres')
    .max(100, 'O texto deve conter, no máximo, 100 caracteres')
    .required('O texto é obrigatório'),
    data: yup.string()
        .min(8, 'A data de postagem será gerada automaticamente')       
        .required('A data de postagem é obrigatória'),
    senha: yup.string()
        .min(8, 'A senha deve conter, no mínimo, 8 caracteres')
        .max(100, 'A senha deve conter letras, números e símbolos')
        .required('A senha é obrigatória'),
    status: yup.string()
        .min(8, 'A senha deve conter, no mínimo, 8 caracteres')
        .max(100, 'A senha deve conter letras, números e símbolos')
        .required('A senha é obrigatória')
}).required();

export default function NoticiaNovo() {
    const [modalShow, setModalShow] = useState(false);
    const [busy, setBusy] = useState(false);

    const messageCallback = useContext(MessageCallbackContext);
    const atualizarCallback = useContext(AtualizarNoticiaContext);

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
            reset({ titulo: '', texto: '', data: '', senha: '', status: ''})
        }
    }, [modalShow]);

    return (
        <>
            <Button onClick={() => setModalShow(true)}>Novo</Button>

            <Modal size="md" centered show={modalShow}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Header>
                        <Modal.Title>Nova notícia</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <label className="row mx-2">
                        Título
                        <input type="text" className="form-control"  {...register("titulo")} />
                        <span className='text-danger'>{errors.titulo?.message}</span>
                    </label>
                    
                    <label className="row mx-2">
                        Texto
                        <input type="text" className="form-control"  {...register("texto")} />
                        <span className='text-danger'>{errors.texto?.message}</span>
                    </label>

                    <label className="row mx-2">
                        Data de postagem
                        <input type="datetime-local" className="form-control" disabled  {...register("data")} />
                        <span className='text-danger'>{errors.data?.message}</span>
                    </label>

                    <label className="row mx-2">
                       Senha
                        <input type="password" className="form-control"  {...register("senha")} />
                        <span className='text-danger'>{errors.senha?.message}</span>
                    </label>

                    <label className="row mx-2">
                       Status
                        <input type="text" className="form-control"  {...register("status")} />
                        <span className='text-danger'>{errors.status?.message}</span>
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