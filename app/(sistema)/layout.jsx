'use client'

import Link from "next/link";
import { createContext } from "react";
import { Container, Nav, NavDropdown, Navbar } from "react-bootstrap";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const MySwal = withReactContent(Swal);
export const MessageCallbackContext = createContext(null);

export default function Layout({ children }) {

    const handleMessageCallback = (msg) => {
        if (msg.tipo !== 'nada') {
            let icon = '';
            if (msg.tipo === 'sucesso')
                icon = 'success';
            else if (msg.tipo === 'erro')
                icon = 'error';
    
            MySwal.fire({
                position: 'top-end',
                icon: icon,
                title: msg.texto,
                showConfirmButton: false,
                timer: 3500,
                toast: true
            })
        }
    }

    return (
        <>
            <Navbar bg="light" expand="lg">
                <Container fluid>
                    <Navbar.Brand href="/">Home</Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                        <Nav
                            className="me-auto my-2 my-lg-0"
                            style={{ maxHeight: '100px' }}
                            navbarScroll
                        >
                            <Nav.Link href="/leitor">Leitores</Nav.Link>
                            <NavDropdown title="Notícias" id="navbarScrollingDropdown">
                                <NavDropdown.Item href="/noticia">Nova notícia</NavDropdown.Item>
                                <NavDropdown.Item href="/lista">
                                    Lista de Notícias
                                </NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="/autor">
                                    Cadastro de Autor
                                </NavDropdown.Item>
                            </NavDropdown>
                            <Nav.Link href="/sobre" legacyBehavior passHref>
                                Sobre
                            </Nav.Link>
                        </Nav>
                        <Form className="d-flex">
                            <Form.Control
                                type="search"
                                placeholder="Busca"
                                className="me-2"
                                aria-label="Search"
                            />
                            <Button variant="outline-success">Pesquisar</Button>
                        </Form>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <img src="https://img.freepik.com/premium-vector/hexagon-dark-blue-abstract-geometric-wide-banner-design-background_181182-21244.jpg" class="bd-placeholder-img" width="100%" height="200" ></img>

            <MessageCallbackContext.Provider value={handleMessageCallback}>
                {children}
            </MessageCallbackContext.Provider>
        </>
    )
}