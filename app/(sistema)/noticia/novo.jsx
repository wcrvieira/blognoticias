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
        .min(3, 'O título deve conter, no mínimo, 3 caracteres')
        .max(100, 'O título deve conter, no máximo, 100 caracteres')
        .required('O título é obrigatório'),
    texto: yup.string()
    .min(3, 'O texto deve conter, no mínimo, 3 caracteres')
    .required('O texto é obrigatório'),
    subtitulo: yup.string()
        .min(3, 'O Subtítulo deve conter, no mínimo, 3 caracteres')
        .max(100, 'O Subtítulo deve conter, no máximo, 100 caracteres')
        .required('O Subtítulo é obrigatório'),    
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
            reset({ titulo: '', subtitulo: '', texto: '', data: ''})
        }
    }, [modalShow]);

    return (
        <>
            <Button onClick={() => setModalShow(true)}>Nova Notícia</Button>

            <Modal size="md" centered show={modalShow}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Header>
                        <Modal.Title>Nova notícia</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <label className="row mx-2">
                        Data notícia
                        <input type="date" className="form-control"  {...register("data")} />
                        <span className='text-danger'>{errors.data?.message}</span>
                    </label>                        
                    <label className="row mx-2">
                        Título
                        <input type="text" className="form-control"  {...register("titulo")} />
                        <span className='text-danger'>{errors.titulo?.message}</span>
                    </label>

                    <label className="row mx-2">
                        Subtítulo
                        <input type="text" className="form-control"  {...register("subtitulo")} />
                        <span className='text-danger'>{errors.subtitulo?.message}</span>
                    </label>                    
                    
                    <label className="row mx-2">
                        Notícia
                        <textarea className="form-control" style={{ height: '120px' }}  {...register("texto")} />
                        <span className='text-danger'>{errors.texto?.message}</span>
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