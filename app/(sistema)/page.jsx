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
            <h4>Lista de Notícias.</h4>

            <Cliente serverRequest={handleRequest}/>
        </>
    )
}