'use server'

import { handleRequest } from "./api";
import Cliente from "./cliente";

export async function generateMetadata({ params }) {
    return {
      title: 'Leitores'
    };
  }

export default async function Page(){
    return(
        <>
            <h2>Cadastro de leitor</h2>
            <h4>Manutenção de leitores</h4>

            <Cliente serverRequest={handleRequest}/>
        </>
    )
}