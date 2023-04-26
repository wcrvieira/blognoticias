'use server'

import { handleRequest } from "./api";
import Cliente from "./cliente";

export async function generateMetadata({ params }) {
    return {
      title: 'Notícias'
    };
  }

export default async function Page(){
    return(
        <>
            <h2>Cadastro de notícias.</h2>
            <Cliente serverRequest={handleRequest}/>
        </>
    )
}