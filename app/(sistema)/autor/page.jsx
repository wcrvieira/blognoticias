'use server'

import { handleRequest } from "./api";
import Cliente from "./cliente";

export async function generateMetadata({ params }) {
    return {
      title: 'Autores'
    };
  }

export default async function Page(){
    return(
        <>
            <h2>Cadastro de autor</h2>
            <h4>Manutenção de autores</h4>

            <Cliente serverRequest={handleRequest}/>
        </>
    )
}