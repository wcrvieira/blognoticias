import Image from "next/image";

export async function generateMetadata({ params }) {
    return {
      title: 'Alunos'
    };
  }

export default async function Page(){
    return(
        <>
            <h2>Projeto Blog com Next.js e API em C#</h2>
            <h4>Equipe</h4>

            <section className="perfil">
                <a href="mailto:adriano.fortunato@aluno.ifsp.edu.br"><p>Adriano Fortunato</p></a>
                <img src="../../Adriano.jpg" alt="Sumiu" title="Perfil de Adriano" />

                <a href="mailto:joao.fernandes@aluno.ifsp.edu.br"><p>João Paulo Fernandes</p></a>
                <img src="../../JoaoPaulo.jpg" alt="Sumiu" title="Perfil de João Paulo" />

                <a href="mailto:vieira.wagner@aluno.ifsp.edu.br"><p>Wagner Cesar Vieira</p></a>
                <img src="../../Wagner.jpg" alt="Sumiu" title="Perfil de Wagner" />
            </section>
        </>
    )
}