import BusyButton from "@/app/componentes/busybutton";
import { useEffect, useState, useContext } from "react";
import { Button, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { schema } from "./novo";
import { MessageCallbackContext } from "../layout";
import { AtualizarLeitorContext } from "./cliente";

export default function LeitorAtualizacao(props) {

    const [modalShow, setModalShow] = useState(true);
    const [busy, setBusy] = useState(false);
    const [primeiroAcesso, setPrimeiroAcesso] = useState(null);

    const messageCallback = useContext(MessageCallbackContext);
    const atualizarCallback = useContext(AtualizarLeitorContext);

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
            reset({ nome: '', email: '', senha: '', nascimento: ''})
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
                        reset({ nome: result.data.nome, email: result.data.email,
                                nascimento: result.data.nascimento, senha: result.data.senha});
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
                    <BusyButton variant="success" type="submit" label="Salvar" busy={busy} />
                    <Button variant="secondary" onClick={handleClose}>Fechar</Button>
                </Modal.Footer>
            </form>
        </Modal>
    )
}