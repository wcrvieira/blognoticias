import 'bootstrap/dist/css/bootstrap.min.css'
import 'app/globals.css'

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <main className='container'>
          {children}
        </main>
        </body>
    </html>
  )
}
