import BusyButton from "@/app/componentes/busybutton";
import { useEffect, useState, useContext } from "react";
import { Button, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { schema } from "./novo";
import { MessageCallbackContext } from "../layout";
import { AtualizarNoticiaContext } from "./cliente";

export default function NoticiaAtualizacao(props) {

    const [modalShow, setModalShow] = useState(true);
    const [busy, setBusy] = useState(false);
    const [primeiroAcesso, setPrimeiroAcesso] = useState(null);

    const messageCallback = useContext(MessageCallbackContext);
    const atualizarCallback = useContext(AtualizarNoticiaContext);

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    const handleClose = () => {
        atualizarCallback.fechar();
        setModalShow(false);
    }

    const onSubmit = (data) => {
        setBusy(true);
        data.id = props.id;
        atualizarCallback.serverRequest({method: 'put', args: data}).then((result) => {
            setBusy(false);
            if (result.success) {
                handleClose();
                atualizarCallback.atualizar(true);
                messageCallback({ tipo: 'sucesso', texto: result.data });
            }
            else{
                messageCallback({tipo: 'erro', texto: result.data});
            }
        });
    }

    useEffect(() => {
        if (modalShow === false) {
            reset({ titulo: '', texto: '', data: '',
                    senha: '', status: ''})
        }
    }, [modalShow]);

    useEffect(() => {
        if (primeiroAcesso === null)
            setPrimeiroAcesso(true);
    
        if (primeiroAcesso) {
            setPrimeiroAcesso(false);
            atualizarCallback.serverRequest({method: 'get', args: {id: props.id}}).then(
                (result) => {
                    if (result.success)
                        reset({ titulo: result.data.titulo, texto: result.data.texto,
                                data: result.data.data, senha: result.data.senha,
                                status: result.data.status});
                    else {
                        handleClose();
                        messageCallback({tipo: 'erro', texto: result.data});
                    }
                }
            );
        }
    }, [primeiroAcesso]);

    return (
        <Modal size="md" centered show={modalShow}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Modal.Header>
                    <Modal.Title>Atualização de Leitor</Modal.Title>
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
                        <input type="datetime-local" className="form-control" disabled {...register("data")} />
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
                    <BusyButton variant="success" type="submit" label="Salvar" busy={busy} />
                    <Button variant="secondary" onClick={handleClose}>Fechar</Button>
                </Modal.Footer>
            </form>
        </Modal>
    )
}